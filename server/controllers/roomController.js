const Room = require("../models/Room");

exports.getRoom = async (req, res) => {
  try {
    let room = await Room.findOne({ roomId: req.params.roomId });
    if (!room) {
      room = await Room.create({ roomId: req.params.roomId });
      console.log(`New room created: ${req.params.roomId}`);
    }
    res.json(room);
  } catch (err) {
    console.error("getRoom error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
