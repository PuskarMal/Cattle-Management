const { search, buildIndex } = require("../utils/siteIndex");

function formatAnswer(chunks) {
  const maxSnippetLength = 240;
  const used = new Set();
  const snippets = [];

  for (const chunk of chunks) {
    const trimmed = chunk.text.replace(/\s+/g, " ").trim();
    if (!trimmed) continue;
    if (used.has(trimmed)) continue;
    used.add(trimmed);
    const snippet =
      trimmed.length > maxSnippetLength
        ? `${trimmed.slice(0, maxSnippetLength).trim()}...`
        : trimmed;
    snippets.push(snippet);
  }

  if (!snippets.length) {
    return null;
  }

  return `Based on the website content, here's what I found:\n\n${snippets.join(
    "\n\n"
  )}`;
}

async function chat(req, res) {
  try {
    const { message, refresh } = req.body || {};
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required." });
    }

    if (refresh) {
      buildIndex({ force: true });
    } else {
      buildIndex();
    }

    const results = search(message, 4);
    const answer = formatAnswer(results);

    if (!answer) {
      return res.json({
        answer:
          "I can only answer using content from this website, and I couldn't find anything relevant yet.",
        sources: [],
      });
    }

    const sources = results.map((item) => ({
      path: item.path,
      score: Number(item.score.toFixed(4)),
    }));

    return res.json({ answer, sources });
  } catch (error) {
    console.error("Chatbot error:", error);
    return res.status(500).json({ error: "Chatbot failed to respond." });
  }
}

function health(req, res) {
  return res.json({ status: "ok" });
}

module.exports = {
  chat,
  health,
};
