import React from "react";

const LANGUAGES = ["javascript", "python", "java", "cpp", "c"];

export default function Toolbar({
  language, onLanguageChange, onRun, onSave, onLeave,
  onCopyRoomId, isRunning, roomId, toggleChat, showChat,
}) {
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <span className="toolbar-logo">{"</>"} CodeSync</span>
        <span className="toolbar-room" onClick={onCopyRoomId} title="Click to copy">
          🔗 {roomId.slice(0, 8)}...
        </span>
      </div>

      <div className="toolbar-center">
        <select value={language} onChange={(e) => onLanguageChange(e.target.value)}>
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>{l.toUpperCase()}</option>
          ))}
        </select>
      </div>

      <div className="toolbar-right">
        <button className="btn-toolbar btn-run" onClick={onRun} disabled={isRunning}>
          {isRunning ? "Running..." : "▶ Run"}
        </button>
        <button className="btn-toolbar btn-save" onClick={onSave}>💾 Save</button>
        <button className="btn-toolbar btn-chat" onClick={toggleChat}>
          {showChat ? "Hide Chat" : "💬 Chat"}
        </button>
        <button className="btn-toolbar btn-leave" onClick={onLeave}>🚪 Leave</button>
      </div>
    </div>
  );
}
