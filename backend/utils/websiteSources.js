const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DATA_DIR = path.resolve(__dirname, "../data");
const SOURCES_FILE = path.join(DATA_DIR, "chatbot-sources.json");
const REQUEST_TIMEOUT_MS = Number(process.env.CHATBOT_SOURCE_TIMEOUT_MS || 10000);
const MAX_TEXT_LENGTH = 30000;

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(SOURCES_FILE)) {
    fs.writeFileSync(SOURCES_FILE, JSON.stringify({ sources: [] }, null, 2));
  }
}

function readStore() {
  ensureStore();
  try {
    const raw = fs.readFileSync(SOURCES_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.sources) ? parsed : { sources: [] };
  } catch {
    return { sources: [] };
  }
}

function writeStore(store) {
  ensureStore();
  fs.writeFileSync(SOURCES_FILE, JSON.stringify(store, null, 2));
}

function listWebsiteSources() {
  const store = readStore();
  return store.sources;
}

function validateUrl(input) {
  let parsed;
  try {
    parsed = new URL(String(input).trim());
  } catch {
    throw new Error("Please enter a valid website URL.");
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Only HTTP and HTTPS website links are supported.");
  }

  return parsed.toString();
}

function decodeHtmlEntities(text) {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

function stripHtml(html) {
  return decodeHtmlEntities(
    html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
      .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();
}

function extractTitle(html, url) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = match ? stripHtml(match[1]) : "";
  if (title) return title;
  return new URL(url).hostname;
}

async function fetchWebsiteSnapshot(url) {
  if (typeof fetch !== "function") {
    throw new Error("This Node.js runtime does not support website fetching.");
  }

  const response = await fetch(url, {
    headers: {
      "User-Agent": "SAMRIDHI-Chatbot/1.0",
      Accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch website (${response.status}).`);
  }

  const html = await response.text();
  const title = extractTitle(html, url);
  const text = stripHtml(html).slice(0, MAX_TEXT_LENGTH);

  if (!text || text.length < 80) {
    throw new Error("The website did not return enough readable text to index.");
  }

  return {
    title,
    text,
    excerpt: text.slice(0, 220).trim(),
  };
}

async function createWebsiteSource(inputUrl) {
  const url = validateUrl(inputUrl);
  const snapshot = await fetchWebsiteSnapshot(url);
  const store = readStore();
  const existing = store.sources.find((item) => item.url === url);
  const source = {
    id: existing?.id || crypto.randomUUID(),
    url,
    title: snapshot.title,
    excerpt: snapshot.excerpt,
    text: snapshot.text,
    updatedAt: new Date().toISOString(),
  };

  const nextSources = existing
    ? store.sources.map((item) => (item.id === existing.id ? source : item))
    : [source, ...store.sources];

  writeStore({ sources: nextSources });
  return source;
}

function removeWebsiteSource(id) {
  const store = readStore();
  const nextSources = store.sources.filter((item) => item.id !== id);
  if (nextSources.length === store.sources.length) {
    return false;
  }
  writeStore({ sources: nextSources });
  return true;
}

module.exports = {
  listWebsiteSources,
  createWebsiteSource,
  removeWebsiteSource,
  SOURCES_FILE,
};
