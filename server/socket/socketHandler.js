const Message = require("../models/Message");
const Room = require("../models/Room");

// roomId -> { code, language }
const roomState = {};
// roomId -> Map(socketId -> username)
const roomUsers = {};

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join-room", async ({ roomId, username }) => {
      socket.join(roomId);
      socket.roomId = roomId;
      socket.username = username;

      if (!roomUsers[roomId]) roomUsers[roomId] = new Map();
      roomUsers[roomId].set(socket.id, username);

      // Load or init room state
      if (!roomState[roomId]) {
        const room = await Room.findOne({ roomId });
        roomState[roomId] = {
          code: room?.code || "",
          language: room?.language || "javascript",
        };
      }

      // Send current state to joining user
      socket.emit("room-state", roomState[roomId]);

      // Notify others
      socket.to(roomId).emit("user-joined", { username, socketId: socket.id });

      // Send updated user list to all
      io.to(roomId).emit("users-update", Array.from(roomUsers[roomId].values()));
    });

    socket.on("code-change", ({ roomId, code }) => {
      if (roomState[roomId]) roomState[roomId].code = code;
      socket.to(roomId).emit("code-update", code);
    });

    socket.on("language-change", ({ roomId, language }) => {
      if (roomState[roomId]) roomState[roomId].language = language;
      io.to(roomId).emit("language-update", language);
    });

    socket.on("cursor-move", ({ roomId, cursor, username }) => {
      socket.to(roomId).emit("cursor-update", { cursor, username, socketId: socket.id });
    });

    socket.on("chat-message", async ({ roomId, username, message }) => {
      const msg = await Message.create({ roomId, username, message });
      io.to(roomId).emit("chat-message", {
        username,
        message,
        timestamp: msg.timestamp,
      });
    });

    socket.on("save-code", async ({ roomId }) => {
      if (roomState[roomId]) {
        await Room.findOneAndUpdate(
          { roomId },
          { code: roomState[roomId].code, language: roomState[roomId].language },
          { upsert: true }
        );
        io.to(roomId).emit("code-saved");
      }
    });

    socket.on("disconnect", () => {
      const { roomId, username } = socket;
      if (roomId && roomUsers[roomId]) {
        roomUsers[roomId].delete(socket.id);
        socket.to(roomId).emit("user-left", { username, socketId: socket.id });
        io.to(roomId).emit("users-update", Array.from(roomUsers[roomId].values()));
      }
    });
  });
};

module.exports = socketHandler;
