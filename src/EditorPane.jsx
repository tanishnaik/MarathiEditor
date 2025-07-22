import React, { useRef, useEffect, useState } from "react";
import "./EditorPane.css";

const KEYWORDS = ["set", "bol", "jar", "naitar", "kram", "vela:", "samplya"];
const SUGGESTIONS = [
  "thev ",
  "bol ",
  "jar ",
  "baag ",
  "nahi tar:",
  "kram ",
  "vela:",
  "samplya",
  "kay payje"
];

export default function EditorPane({ value, onChange, theme }) {
  const textareaRef = useRef();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestPos, setSuggestPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (theme === "dark") {
      document.body.style.background = "#1e1e1e";
    } else {
      document.body.style.background = "#f5f5f5";
    }
  }, [theme]);

  // Render line numbers
  const lines = value.split(/\r?\n/);

  const handleKeyDown = e => {
    if (e.ctrlKey && e.code === "Space") {
      e.preventDefault();
      const cursorPos = textareaRef.current.selectionStart;
      const before = value.slice(0, cursorPos);
      const lastWord = before.split(/\s|\n/).pop();
      const filtered = SUGGESTIONS.filter(s => s.startsWith(lastWord));
      setSuggestions(filtered.length ? filtered : SUGGESTIONS);
      setShowSuggestions(true);
      // Calculate position for suggestion box
      const rect = textareaRef.current.getBoundingClientRect();
      setSuggestPos({ top: rect.top + 30, left: rect.left + 20 });
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = suggestion => {
    const cursorPos = textareaRef.current.selectionStart;
    const before = value.slice(0, cursorPos);
    const after = value.slice(cursorPos);
    const lastWord = before.split(/\s|\n/).pop();
    const newBefore = before.slice(0, before.length - lastWord.length) + suggestion;
    onChange(newBefore + after);
    setShowSuggestions(false);
    setTimeout(() => textareaRef.current.focus(), 0);
  };

  return (
    <div className={`editor-pane ${theme}`} style={{ position: "relative" }}>  
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
        onKeyDown={handleKeyDown}
      />
      {showSuggestions && (
        <div
          style={{
            position: "absolute",
            top: suggestPos.top - textareaRef.current.getBoundingClientRect().top + 5,
            left: suggestPos.left - textareaRef.current.getBoundingClientRect().left,
            background: "#232323",
            color: "#fff",
            border: "1px solid #333",
            borderRadius: 6,
            zIndex: 10,
            boxShadow: "0 2px 8px #0005",
            minWidth: 120,
            padding: "0.5rem"
          }}
        >
          {suggestions.map(s => (
            <div
              key={s}
              style={{ padding: "4px 8px", cursor: "pointer", borderRadius: 4, marginBottom: 2, background: "#232323" }}
              onMouseDown={() => handleSuggestionClick(s)}
              onMouseOver={e => (e.currentTarget.style.background = "#007acc")}
              onMouseOut={e => (e.currentTarget.style.background = "#232323")}
            >
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
