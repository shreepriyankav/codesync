const express = require("express");
const router = express.Router();
const { getChatHistory } = require("../controllers/chatController");

router.get("/:roomId", getChatHistory);

module.exports = router;
