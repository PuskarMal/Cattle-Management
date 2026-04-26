const fs = require("fs");
const path = require("path");

const DEFAULT_MAX_CHUNK_CHARS = 800;
const DEFAULT_CHUNK_OVERLAP = 150;

let cachedIndex = null;

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function stripHtmlTags(text) {
  return text.replace(/<[^>]*>/g, " ");
}

function extractTextFromJsx(source) {
  const matches = [];
  const tagRegex = />[^<]{2,}</g;
  let match;
  while ((match = tagRegex.exec(source))) {
    const chunk = match[0].replace(/^>/, "").replace(/<$/, "");
    matches.push(chunk);
  }
  return matches.join(" ");
}

function cleanText(text) {
  return text.replace(/\s+/g, " ").trim();
}

function collectFiles(rootDir, allowedExts, ignoreDirs) {
  if (!fs.existsSync(rootDir)) return [];
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      if (ignoreDirs.has(entry.name)) continue;
      files.push(...collectFiles(fullPath, allowedExts, ignoreDirs));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (allowedExts.has(ext)) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

function chunkText(text, maxChars = DEFAULT_MAX_CHUNK_CHARS, overlap = DEFAULT_CHUNK_OVERLAP) {
  const chunks = [];
  if (!text) return chunks;
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + maxChars, text.length);
    const chunk = text.slice(start, end);
    if (chunk.trim().length > 30) {
      chunks.push(chunk.trim());
    }
    start = end - overlap;
    if (start < 0) start = 0;
  }
  return chunks;
}

function buildIndex({ force = false } = {}) {
  if (cachedIndex && !force) return cachedIndex;

  const frontendRoot = path.resolve(__dirname, "../../frontend");
  const contentRoots = [
    path.join(frontendRoot, "src", "pages"),
    path.join(frontendRoot, "src", "components"),
    path.join(frontendRoot, "public"),
  ];

  const allowedExts = new Set([".jsx", ".js", ".tsx", ".ts", ".md", ".txt", ".html", ".htm"]);
  const ignoreDirs = new Set(["node_modules", "dist", "build"]);

  const rawDocuments = [];

  for (const root of contentRoots) {
    const files = collectFiles(root, allowedExts, ignoreDirs);
    for (const filePath of files) {
      let content = "";
      try {
        content = fs.readFileSync(filePath, "utf8");
      } catch {
        continue;
      }

      const ext = path.extname(filePath).toLowerCase();
      let text = "";
      if (ext === ".html" || ext === ".htm") {
        text = stripHtmlTags(content);
      } else if (ext === ".md" || ext === ".txt") {
        text = content;
      } else {
        text = extractTextFromJsx(content);
      }

      text = cleanText(text);
      if (!text) continue;

      const relativePath = path.relative(frontendRoot, filePath);
      rawDocuments.push({ path: relativePath, text });
    }
  }

  const chunks = [];
  let chunkId = 0;
  for (const doc of rawDocuments) {
    const docChunks = chunkText(doc.text);
    for (const chunk of docChunks) {
      chunks.push({
        id: `chunk-${chunkId++}`,
        path: doc.path,
        text: chunk,
      });
    }
  }

  const docFreq = new Map();
  const chunkVectors = new Map();

  for (const chunk of chunks) {
    const tokens = tokenize(chunk.text);
    const termCounts = new Map();
    for (const token of tokens) {
      termCounts.set(token, (termCounts.get(token) || 0) + 1);
    }
    chunkVectors.set(chunk.id, termCounts);

    const uniqueTokens = new Set(tokens);
    for (const token of uniqueTokens) {
      docFreq.set(token, (docFreq.get(token) || 0) + 1);
    }
  }

  const totalDocs = Math.max(chunks.length, 1);
  const idf = new Map();
  for (const [token, df] of docFreq.entries()) {
    idf.set(token, Math.log((totalDocs + 1) / (df + 1)) + 1);
  }

  cachedIndex = { chunks, chunkVectors, idf, totalDocs };
  return cachedIndex;
}

function buildQueryVector(query, idf) {
  const tokens = tokenize(query);
  const termCounts = new Map();
  for (const token of tokens) {
    termCounts.set(token, (termCounts.get(token) || 0) + 1);
  }

  const vector = new Map();
  for (const [token, count] of termCounts.entries()) {
    const weight = (idf.get(token) || 0) * count;
    if (weight > 0) vector.set(token, weight);
  }
  return vector;
}

function cosineSimilarity(vecA, vecB) {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (const value of vecA.values()) {
    normA += value * value;
  }
  for (const value of vecB.values()) {
    normB += value * value;
  }
  if (normA === 0 || normB === 0) return 0;

  for (const [token, value] of vecA.entries()) {
    const other = vecB.get(token);
    if (other) dot += value * other;
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function search(query, maxResults = 4) {
  const index = buildIndex();
  const queryVector = buildQueryVector(query, index.idf);
  const scored = [];

  for (const chunk of index.chunks) {
    const chunkVector = index.chunkVectors.get(chunk.id);
    const weightedChunk = new Map();
    for (const [token, count] of chunkVector.entries()) {
      const weight = (index.idf.get(token) || 0) * count;
      if (weight > 0) weightedChunk.set(token, weight);
    }
    const score = cosineSimilarity(queryVector, weightedChunk);
    if (score > 0) {
      scored.push({ ...chunk, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, maxResults);
}

module.exports = {
  buildIndex,
  search,
};
