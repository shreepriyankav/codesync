const Room = require("../models/Room");

exports.getRoom = async (req, res) => {
  try {
    let room = await Room.findOne({ roomId: req.params.roomId });
    if (!room) {
      room = await Room.create({ roomId: req.params.roomId });
    }
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
