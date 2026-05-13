const express = require("express");
const router = express.Router();
const { getRoom } = require("../controllers/roomController");

router.get("/:roomId", getRoom);

module.exports = router;
