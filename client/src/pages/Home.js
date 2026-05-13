import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const createRoom = () => {
    const id = uuidv4();
    setRoomId(id);
    toast.success("Room ID generated!");
  };

  const joinRoom = () => {
    if (!roomId.trim() || !username.trim()) {
      toast.error("Room ID and username are required");
      return;
    }
    navigate(`/editor/${roomId}`, { state: { username } });
  };

  return (
    <div className="home-container">
      <div className="home-card">
        <div className="home-logo">
          <span className="logo-icon">{"</>"}</span>
          <h1>CodeSync</h1>
          <p>Real-Time Collaborative Code Editor</p>
        </div>

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Room ID</label>
          <input
            type="text"
            placeholder="Enter or generate a Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
        </div>

        <button className="btn btn-secondary" onClick={createRoom}>
          Generate Room ID
        </button>
        <button className="btn btn-primary" onClick={joinRoom}>
          Join Room
        </button>
      </div>
    </div>
  );
}
