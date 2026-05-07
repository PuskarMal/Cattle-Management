const express = require("express");
const router = express.Router();
const {
  chat,
  health,
  stats,
  listSources,
  addSource,
  deleteSource,
} = require("../controllers/chatbotController");

router.get("/health", health);
router.get("/stats", stats);
router.get("/sources", listSources);
router.post("/sources", addSource);
router.delete("/sources/:id", deleteSource);
router.post("/", chat);

module.exports = router;
