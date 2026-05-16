const Message = require("../models/Message");
const Room = require("../models/Room");

const roomState = {};
const roomUsers = {};

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join-room", async ({ roomId, username }) => {
      try {
        socket.join(roomId);
        socket.roomId = roomId;
        socket.username = username;

        if (!roomUsers[roomId]) roomUsers[roomId] = new Map();
        roomUsers[roomId].set(socket.id, username);

        if (!roomState[roomId]) {
          const room = await Room.findOne({ roomId });
          roomState[roomId] = {
            code: room?.code || "",
            language: room?.language || "javascript",
          };
        }

        socket.emit("room-state", roomState[roomId]);
        socket.to(roomId).emit("user-joined", { username });
        io.to(roomId).emit("users-update", Array.from(roomUsers[roomId].values()));

        console.log(`${username} joined room ${roomId}`);
      } catch (err) {
        console.error("join-room error:", err.message);
      }
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
      try {
        const msg = await Message.create({ roomId, username, message });
        console.log(`Chat message saved: ${username}: ${message}`);
        io.to(roomId).emit("chat-message", {
          username,
          message,
          timestamp: msg.timestamp,
        });
      } catch (err) {
        console.error("chat-message error:", err.message);
        // Still emit even if save fails
        io.to(roomId).emit("chat-message", {
          username,
          message,
          timestamp: new Date(),
        });
      }
    });

    socket.on("save-code", async ({ roomId }) => {
      try {
        if (roomState[roomId]) {
          await Room.findOneAndUpdate(
            { roomId },
            { code: roomState[roomId].code, language: roomState[roomId].language },
            { upsert: true, new: true }
          );
          console.log(`Code saved for room ${roomId}`);
          io.to(roomId).emit("code-saved");
        }
      } catch (err) {
        console.error("save-code error:", err.message);
      }
    });

    socket.on("disconnect", () => {
      const { roomId, username } = socket;
      if (roomId && roomUsers[roomId]) {
        roomUsers[roomId].delete(socket.id);
        socket.to(roomId).emit("user-left", { username });
        io.to(roomId).emit("users-update", Array.from(roomUsers[roomId].values()));
        console.log(`${username} left room ${roomId}`);
      }
    });
  });
};

module.exports = socketHandler;
