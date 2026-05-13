import React from "react";
import Editor from "@monaco-editor/react";

const LANGUAGE_MAP = {
  javascript: "javascript",
  python: "python",
  java: "java",
  cpp: "cpp",
  c: "c",
};

export default function CodeEditor({ code, language, onChange, onCursorChange }) {
  const handleEditorDidMount = (editor) => {
    editor.onDidChangeCursorPosition((e) => {
      onCursorChange({ lineNumber: e.position.lineNumber, column: e.position.column });
    });
  };

  return (
    <div className="code-editor-wrapper">
      <Editor
        height="100%"
        language={LANGUAGE_MAP[language] || "javascript"}
        value={code}
        onChange={(val) => onChange(val || "")}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
        }}
      />
    </div>
  );
}
