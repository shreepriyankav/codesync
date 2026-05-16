const Message = require("../models/Message");

exports.getChatHistory = async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId })
      .sort({ timestamp: 1 })
      .limit(100);
    res.json(messages);
  } catch (err) {
    console.error("getChatHistory error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
