const fs = require("fs");
const path = require("path");
const { listWebsiteSources } = require("./websiteSources");

const DEFAULT_MAX_CHUNK_CHARS = 700;
const DEFAULT_CHUNK_OVERLAP = 120;
const MIN_TEXT_LENGTH = 12;
const MIN_ALPHA_RATIO = 0.3;
const MAX_NOISE_RATIO = 0.6;
const MAX_FILE_BYTES = 512 * 1024;
const CHATBOT_CONTENT_ROOT = "src/content";
const STOPWORDS = new Set([
  "the","a","an","and","or","but","if","then","this","that","these","those","is","are","was","were",
  "to","of","in","on","for","with","as","by","from","at","it","its","be","can","will","we","you","your",
  "our","their","they","he","she","i","me","my"
]);

let cachedIndex = null;

function rawTokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function tokenize(text) {
  return rawTokenize(text).filter((token) => !STOPWORDS.has(token));
}

function stripHtmlTags(text) {
  return text.replace(/<[^>]*>/g, " ");
}

function removeJsComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/\/\/.*$/gm, " ");
}

function extractStringLiterals(source) {
  const results = [];
  const stringRegex = /(["'`])((?:\\.|(?!\1).)*)\1/g;
  let match;
  while ((match = stringRegex.exec(source))) {
    const value = match[2];
    if (!value) continue;
    const cleaned = value.replace(/\s+/g, " ").trim();
    if (cleaned.length < 4) continue;
    if (!/[a-zA-Z]/.test(cleaned)) continue;
    if (/^(\.\/|\/|https?:)/.test(cleaned)) continue;
    if (/^[A-Z0-9_-]+$/.test(cleaned)) continue;
    if (/className|onClick|type=|value=/.test(cleaned)) continue;
    results.push(cleaned);
  }
  return results;
}

function extractTextFromJsx(source) {
  const withoutComments = removeJsComments(source);
  const stringLiterals = extractStringLiterals(withoutComments);

  const withoutExpressions = withoutComments.replace(/\{[^}]*\}/g, " ");
  const textOnly = stripHtmlTags(withoutExpressions);

  return [textOnly, ...stringLiterals].join(" ");
}

function extractTextFromJson(source) {
  try {
    const data = JSON.parse(source);
    const strings = [];
    const stack = [data];
    while (stack.length) {
      const item = stack.pop();
      if (item == null) continue;
      if (typeof item === "string") {
        const cleaned = item.replace(/\s+/g, " ").trim();
        if (cleaned.length >= 4) strings.push(cleaned);
      } else if (Array.isArray(item)) {
        for (const entry of item) stack.push(entry);
      } else if (typeof item === "object") {
        for (const value of Object.values(item)) stack.push(value);
      }
    }
    return strings.join(" ");
  } catch {
    return "";
  }
}

function parseFaqFromText(source) {
  const faqs = [];
  const lines = source.split(/\r?\n/);
  let currentQ = null;
  let currentA = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (/^Q[:\s]/i.test(trimmed)) {
      if (currentQ && currentA) {
        faqs.push({ question: currentQ, answer: currentA });
      }
      currentQ = trimmed.replace(/^Q[:\s]+/i, "").trim();
      currentA = null;
      continue;
    }
    if (/^A[:\s]/i.test(trimmed)) {
      currentA = trimmed.replace(/^A[:\s]+/i, "").trim();
      continue;
    }
    if (currentA) {
      currentA = `${currentA} ${trimmed}`.trim();
    } else if (currentQ) {
      currentQ = `${currentQ} ${trimmed}`.trim();
    }
  }

  if (currentQ && currentA) {
    faqs.push({ question: currentQ, answer: currentA });
  }

  return faqs;
}

function cleanText(text) {
  return text.replace(/\s+/g, " ").trim();
}

function alphaRatio(text) {
  if (!text) return 0;
  const alpha = (text.match(/[a-zA-Z]/g) || []).length;
  return alpha / text.length;
}

function noiseRatio(text) {
  if (!text) return 1;
  const noise = (text.match(/[^a-zA-Z0-9\s.,:;!?'"-]/g) || []).length;
  return noise / text.length;
}

function isLowQuality(text) {
  const cleaned = cleanText(text);
  if (cleaned.length < MIN_TEXT_LENGTH) return true;
  if (alphaRatio(cleaned) < MIN_ALPHA_RATIO) return true;
  if (noiseRatio(cleaned) > MAX_NOISE_RATIO) return true;
  return false;
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
    const chunk = text.slice(start, end).trim();
    if (!isLowQuality(chunk)) {
      chunks.push(chunk);
    }
    if (end >= text.length) break;
    start = Math.max(end - overlap, start + 1);
  }
  return chunks;
}

function buildIndex({ force = false } = {}) {
  if (cachedIndex && !force) return cachedIndex;

  const frontendRoot = path.resolve(__dirname, "../../frontend");
  const contentRoots = [
    path.join(frontendRoot, CHATBOT_CONTENT_ROOT),
  ];

  const allowedExts = new Set([".jsx", ".js", ".tsx", ".ts", ".md", ".txt", ".html", ".htm", ".json"]);
  const ignoreDirs = new Set(["node_modules", "dist", "build"]);

  const rawDocuments = [];
  const faqPairs = [];
  let skippedLarge = 0;

  for (const root of contentRoots) {
    const files = collectFiles(root, allowedExts, ignoreDirs);
    for (const filePath of files) {
      const relativePath = path.relative(frontendRoot, filePath).replace(/\\/g, "/");

      let content = "";
      try {
        const stats = fs.statSync(filePath);
        if (stats.size > MAX_FILE_BYTES) {
          skippedLarge += 1;
          continue;
        }
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
      } else if (ext === ".json") {
        text = extractTextFromJson(content);
      } else {
        text = extractTextFromJsx(content);
      }

      text = cleanText(text);
      if (!text || isLowQuality(text)) continue;

      rawDocuments.push({ path: relativePath, text });

      if (ext === ".md" || ext === ".txt") {
        const faqs = parseFaqFromText(content);
        for (const faq of faqs) {
          if (faq.question && faq.answer) {
            faqPairs.push({ ...faq, path: relativePath });
          }
        }
      }
    }
  }

  const websiteSources = listWebsiteSources();
  for (const source of websiteSources) {
    const text = cleanText(
      [source.title, source.excerpt, source.text]
        .filter(Boolean)
        .join("\n")
    );

    if (!text || isLowQuality(text)) continue;

    rawDocuments.push({
      path: `website:${source.title || source.url}`,
      text,
    });
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

  cachedIndex = {
    chunks,
    chunkVectors,
    idf,
    totalDocs,
    faqs: faqPairs,
    generatedAt: new Date().toISOString(),
    stats: {
      skippedLarge,
      websiteSources: websiteSources.length,
    }
  };
  return cachedIndex;
}

function buildQueryVector(query, idf) {
  let tokens = tokenize(query);
  if (tokens.length === 0) {
    tokens = rawTokenize(query);
  }
  const termCounts = new Map();
  for (const token of tokens) {
    termCounts.set(token, (termCounts.get(token) || 0) + 1);
  }

  const vector = new Map();
  for (const [token, count] of termCounts.entries()) {
    const idfWeight = idf.get(token);
    const weight = (idfWeight !== undefined ? idfWeight : 0.2) * count;
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
    scored.push({ ...chunk, score });
  }

  scored.sort((a, b) => b.score - a.score);

  const hasSignal = queryVector.size > 0 && scored.some((item) => item.score > 0);
  if (hasSignal) {
    return {
      results: scored.filter((item) => item.score > 0).slice(0, maxResults),
      usedFallback: false
    };
  }

  const fallback = scored
    .filter((item) => !isLowQuality(item.text))
    .map((item, index) => ({
      ...item,
      score: item.score || 0,
      rank: index,
      quality: alphaRatio(item.text)
    }))
    .sort((a, b) => b.quality - a.quality || b.text.length - a.text.length)
    .slice(0, maxResults);

  return { results: fallback, usedFallback: true };
}

module.exports = {
  buildIndex,
  search,
  rawTokenize,
  parseFaqFromText,
};
