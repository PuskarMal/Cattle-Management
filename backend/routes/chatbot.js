const express = require("express");
const router = express.Router();
const { chat, health } = require("../controllers/chatbotController");

router.get("/health", health);
router.post("/", chat);

module.exports = router;
