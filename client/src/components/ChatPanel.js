import React, { useState, useRef, useEffect } from "react";

export default function ChatPanel({ messages, onSend, username }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter") send();
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">💬 Chat</div>
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-msg ${msg.username === username ? "own" : ""}`}>
            <span className="chat-user">{msg.username}</span>
            <span className="chat-text">{msg.message}</span>
            <span className="chat-time">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="chat-input-row">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
        />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}
