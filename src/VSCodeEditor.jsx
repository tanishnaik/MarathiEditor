import React, { useRef, useState } from "react";

const SUGGESTIONS = [
  "set ",
  "bol ",
  "jar ",
  "naitar",
  "kram ",
  "vela:",
  "samplya"
];

export default function VSCodeEditor({ value, onChange }) {
  const textareaRef = useRef();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestPos, setSuggestPos] = useState({ top: 0, left: 0 });

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
    <div style={{ position: "relative" }}>
      <textarea
        ref={textareaRef}
        className="vscode-editor"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={18}
        spellCheck={false}
        style={{ fontFamily: 'Fira Mono, monospace', fontSize: '1.1rem', background: '#1e1e1e', color: '#d4d4d4', border: 'none', borderRadius: '6px', width: '100%', padding: '1rem', resize: 'vertical' }}
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
