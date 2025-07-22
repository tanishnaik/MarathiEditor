import React from "react";

export default function JSViewer({ code }) {
  return (
    <div className="js-viewer">
      <h2>Compiled JavaScript</h2>
      <pre className="code-output">{code}</pre>
    </div>
  );
}
