import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import CodeEditor from "../components/CodeEditor";
import ChatPanel from "../components/ChatPanel";
import UserList from "../components/UserList";
import OutputPanel from "../components/OutputPanel";
import Toolbar from "../components/Toolbar";
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

export default function EditorPage() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.username;

  const socketRef = useRef(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [remoteCursors, setRemoteCursors] = useState({});

  useEffect(() => {
    if (!username) {
      navigate("/");
      return;
    }

    socketRef.current = io(process.env.REACT_APP_SERVER_URL || "http://localhost:5000");
    const socket = socketRef.current;

    socket.emit("join-room", { roomId, username });

    socket.on("room-state", ({ code, language }) => {
      setCode(code);
      setLanguage(language);
    });

    socket.on("code-update", (newCode) => setCode(newCode));
    socket.on("language-update", (lang) => setLanguage(lang));
    socket.on("users-update", (userList) => setUsers(userList));

    socket.on("user-joined", ({ username: u }) => toast.success(`${u} joined`));
    socket.on("user-left", ({ username: u }) => toast.error(`${u} left`));
    socket.on("code-saved", () => toast.success("Code saved!"));

    socket.on("chat-message", (msg) => setMessages((prev) => [...prev, msg]));

    socket.on("cursor-update", ({ socketId, username: u, cursor }) => {
      setRemoteCursors((prev) => ({ ...prev, [socketId]: { username: u, cursor } }));
    });

    // Load chat history
    axios.get(`${process.env.REACT_APP_SERVER_URL || "http://localhost:5000"}/api/chat/${roomId}`).then((res) => setMessages(res.data));

    return () => socket.disconnect();
  }, [roomId, username, navigate]);

  const handleCodeChange = useCallback((newCode) => {
    setCode(newCode);
    socketRef.current?.emit("code-change", { roomId, code: newCode });
  }, [roomId]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    socketRef.current?.emit("language-change", { roomId, language: lang });
  };

  const handleCursorChange = (cursor) => {
    socketRef.current?.emit("cursor-move", { roomId, cursor, username });
  };

  const handleSendMessage = (message) => {
    socketRef.current?.emit("chat-message", { roomId, username, message });
  };

  const handleSaveCode = () => {
    socketRef.current?.emit("save-code", { roomId });
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput("Running...");
    try {
      const res = await axios.post(`${process.env.REACT_APP_SERVER_URL || "http://localhost:5000"}/api/execute`, { code, language });
      setOutput(res.data.output);
    } catch {
      setOutput("Execution failed. Check your Judge0 API key.");
    } finally {
      setIsRunning(false);
    }
  };

  const handleLeave = () => {
    socketRef.current?.disconnect();
    navigate("/");
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast.success("Room ID copied!");
  };

  return (
    <div className="editor-layout">
      <Toolbar
        language={language}
        onLanguageChange={handleLanguageChange}
        onRun={handleRunCode}
        onSave={handleSaveCode}
        onLeave={handleLeave}
        onCopyRoomId={copyRoomId}
        isRunning={isRunning}
        roomId={roomId}
        toggleChat={() => setShowChat((p) => !p)}
        showChat={showChat}
      />

      <div className="editor-body">
        <div className="sidebar">
          <UserList users={users} currentUser={username} />
        </div>

        <div className="editor-main">
          <CodeEditor
            code={code}
            language={language}
            onChange={handleCodeChange}
            onCursorChange={handleCursorChange}
            remoteCursors={remoteCursors}
          />
          <OutputPanel output={output} />
        </div>

        {showChat && (
          <div className="chat-sidebar">
            <ChatPanel
              messages={messages}
              onSend={handleSendMessage}
              username={username}
            />
          </div>
        )}
      </div>
    </div>
  );
}
