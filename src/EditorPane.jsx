import React, { useRef, useEffect } from "react";
import "./EditorPane.css";

const KEYWORDS = ["set", "bol", "jar", "naitar", "kram", "vela:", "samplya"];

export default function EditorPane({ value, onChange, theme }) {
  const textareaRef = useRef();

  useEffect(() => {
    if (theme === "dark") {
      document.body.style.background = "#1e1e1e";
    } else {
      document.body.style.background = "#f5f5f5";
    }
  }, [theme]);

  // Render line numbers
  const lines = value.split(/\r?\n/);

  return (
    <div className={`editor-pane ${theme}`}>  
      <div className="line-numbers">
        {lines.map((_, i) => (
          <div key={i} className="line-number">{i + 1}</div>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        className="editor-textarea"
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={lines.length || 1}
        spellCheck={false}
        placeholder="// Write your MarathiScript code here"
        style={{ fontFamily: 'Fira Code, Courier New, monospace', fontSize: '1.1rem', background: theme === "dark" ? '#1e1e1e' : '#fff', color: theme === "dark" ? '#d4d4d4' : '#222', border: 'none', borderRadius: '6px', width: '100%', padding: '1rem', resize: 'vertical', tabSize: 4 }}
        tabIndex={0}
      />
    </div>
  );
}
