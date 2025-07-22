import React from "react";

export default function OutputViewer({ output }) {
  return (
    <div className="output-viewer">
      <h2>Output</h2>
      <pre className="code-output">{output}</pre>
    </div>
  );
}
