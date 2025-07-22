import React from "react";

export default function OutputTerminal({ output }) {
  const lines = output.split(/\r?\n/);
  return (
    <div className="output-terminal">
      <div className="output-label">Output</div>
      <div className="output-content">
        {lines.map((line, i) =>
          line.startsWith("[Error]") ? (
            <div key={i} style={{ color: "#ff4c4c" }}>&gt; {line.replace("[Error]", "")}</div>
          ) : (
            <div key={i} style={{ color: "#00ff00" }}>&gt; {line}</div>
          )
        )}
      </div>
    </div>
  );
}
