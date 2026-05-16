require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
const socketHandler = require("./socket/socketHandler");

const app = express();
const server = http.createServer(app);
const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://charming-tulumba-41f933.netlify.app",
  "http://localhost:3000",
];

const io = new Server(server, {
  cors: { origin: allowedOrigins, methods: ["GET", "POST"] },
});

connectDB();

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.use("/api/execute", require("./routes/execute"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/room", require("./routes/room"));

socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
