import React from "react";

export default function OutputPanel({ output }) {
  return (
    <div className="output-panel">
      <div className="output-header">▶ Output</div>
      <pre className="output-body">{output || "Run your code to see output here..."}</pre>
    </div>
  );
}
