const { search, buildIndex } = require("../utils/siteIndex");
const {
  listWebsiteSources,
  createWebsiteSource,
  removeWebsiteSource,
} = require("../utils/websiteSources");

const MIN_CHUNKS_REQUIRED = 1;
const CACHE_TTL_MS = Number(process.env.CHATBOT_CACHE_TTL_MS || 10 * 60 * 1000);
const CACHE_MAX_ITEMS = Number(process.env.CHATBOT_CACHE_MAX_ITEMS || 200);
const FAQ_MATCH_THRESHOLD = Number(process.env.CHATBOT_FAQ_THRESHOLD || 0.25);
const SEARCH_MIN_SCORE = Number(process.env.CHATBOT_MIN_SCORE || 0.18);

const responseCache = new Map();

function normalizeForDedupe(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatWebsiteAnswer(chunks) {
  const maxSnippetLength = 240;
  const used = new Map();
  const snippets = [];

  for (const chunk of chunks) {
    const trimmed = chunk.text.replace(/\s+/g, " ").trim();
    if (!trimmed || trimmed.length < 12) continue;
    const key = normalizeForDedupe(trimmed);
    const seenCount = used.get(key) || 0;
    if (seenCount >= 1) continue;
    used.set(key, seenCount + 1);
    const snippet =
      trimmed.length > maxSnippetLength
        ? `${trimmed.slice(0, maxSnippetLength).trim()}...`
        : trimmed;
    snippets.push(snippet);
  }

  if (!snippets.length && chunks.length > 0) {
    const fallbackText = chunks[0].text.replace(/\s+/g, " ").trim();
    if (fallbackText) {
      snippets.push(
        fallbackText.length > maxSnippetLength
          ? `${fallbackText.slice(0, maxSnippetLength).trim()}...`
          : fallbackText
      );
    }
  }

  if (!snippets.length) return null;

  return snippets.join("\n\n");
}

function scoreFaqMatch(query, faq) {
  const qTokens = new Set(query.toLowerCase().split(/\s+/).filter(Boolean));
  const faqTokens = new Set(faq.question.toLowerCase().split(/\s+/).filter(Boolean));
  let overlap = 0;
  for (const token of qTokens) {
    if (faqTokens.has(token)) overlap += 1;
  }
  return overlap / Math.max(1, faqTokens.size);
}

function getCacheKey({ message, indexStamp }) {
  return `${indexStamp}::${message.toLowerCase().trim()}`;
}

function getCachedResponse(key) {
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.time > CACHE_TTL_MS) {
    responseCache.delete(key);
    return null;
  }
  return entry.value;
}

function setCachedResponse(key, value) {
  responseCache.set(key, { time: Date.now(), value });
  if (responseCache.size > CACHE_MAX_ITEMS) {
    const firstKey = responseCache.keys().next().value;
    responseCache.delete(firstKey);
  }
}

function clearResponseCache() {
  responseCache.clear();
}

function buildWebsiteAnswer({ message, index }) {
  const indexWarning =
    index.chunks.length < MIN_CHUNKS_REQUIRED
      ? "Index is small; answers may be incomplete."
      : null;

  if (index.faqs && index.faqs.length > 0) {
    let best = null;
    for (const faq of index.faqs) {
      const score = scoreFaqMatch(message, faq);
      if (!best || score > best.score) {
        best = { ...faq, score };
      }
    }
    if (best && best.score >= FAQ_MATCH_THRESHOLD) {
      return {
        answer: best.answer,
        sources: [{ path: best.path, score: Number(best.score.toFixed(3)) }],
        confidence: best.score,
        warning: indexWarning || undefined,
        usedFallback: false,
        matchedFaq: true,
      };
    }
  }

  const { results, usedFallback } = search(message, 6);
  const topScore = results.length > 0 ? results[0].score : 0;
  const answer = formatWebsiteAnswer(results);
  const sources = results.map((item) => ({
    path: item.path,
    score: Number(item.score.toFixed(4)),
  }));

  if (!answer || usedFallback || topScore < SEARCH_MIN_SCORE) {
    return {
      answer: "",
      sources,
      confidence: topScore,
      warning: indexWarning || undefined,
      usedFallback,
      matchedFaq: false,
    };
  }

  return {
    answer,
    sources,
    confidence: topScore,
    warning: indexWarning || undefined,
    usedFallback,
    matchedFaq: false,
  };
}

async function chat(req, res) {
  try {
    const { message, refresh } = req.body || {};
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required." });
    }

    const index = refresh ? buildIndex({ force: true }) : buildIndex();

    if (!index.chunks || index.chunks.length === 0) {
      return res.json({
        answer:
          "I couldn't find any chatbot content yet. Please add `chatbot.md` content or upload website links first.",
        sources: [],
        stats: { chunks: 0 },
      });
    }

    const cacheKey = getCacheKey({
      message,
      indexStamp: index.generatedAt || "unknown",
    });

    const cached = getCachedResponse(cacheKey);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    const websiteAnswer = buildWebsiteAnswer({ message, index });
    const payload = {
      answer:
        websiteAnswer.answer ||
        "I could not find a relevant answer in `chatbot.md` or the saved website links yet.",
      answerSource: websiteAnswer.answer ? "local-content" : "none",
      websiteAnswer: websiteAnswer.answer || null,
      sources: websiteAnswer.sources || [],
      warning: websiteAnswer.warning,
      stats: {
        websiteConfidence: Number((websiteAnswer.confidence || 0).toFixed(4)),
        usedFallback: Boolean(websiteAnswer.usedFallback),
        matchedFaq: Boolean(websiteAnswer.matchedFaq),
        localOnly: true,
      },
    };

    setCachedResponse(cacheKey, payload);
    return res.json(payload);
  } catch (error) {
    console.error("Chatbot error:", error);
    return res.status(500).json({ error: "Chatbot failed to respond." });
  }
}

function health(req, res) {
  return res.json({ status: "ok", mode: "local-content-only" });
}

function stats(req, res) {
  const index = buildIndex();
  const websiteSources = listWebsiteSources();
  return res.json({
    chunks: index.chunks ? index.chunks.length : 0,
    generatedAt: index.generatedAt || null,
    stats: index.stats || {},
    websiteSources: websiteSources.length,
  });
}

function listSources(req, res) {
  return res.json({ sources: listWebsiteSources() });
}

async function addSource(req, res) {
  try {
    const { url } = req.body || {};
    if (!url || !String(url).trim()) {
      return res.status(400).json({ error: "Website URL is required." });
    }

    const source = await createWebsiteSource(url);
    clearResponseCache();
    buildIndex({ force: true });

    return res.status(201).json({
      message: "Website link saved and indexed.",
      source,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed to save website link." });
  }
}

function deleteSource(req, res) {
  const removed = removeWebsiteSource(req.params.id);
  if (!removed) {
    return res.status(404).json({ error: "Website link not found." });
  }

  clearResponseCache();
  buildIndex({ force: true });

  return res.json({ message: "Website link removed." });
}

module.exports = {
  chat,
  health,
  stats,
  listSources,
  addSource,
  deleteSource,
};
