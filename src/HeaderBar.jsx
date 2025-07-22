import React from "react";

export default function HeaderBar({ theme, onThemeToggle, onRun }) {
  return (
    <div className="header-bar">
      <span className="app-title">MarathiScript IDE</span>
      <div className="toolbar">
        <button className="run-btn" onClick={onRun} title="Run (Ctrl+Enter)">▶ Run</button>
        <button className="theme-btn" onClick={onThemeToggle} title="Toggle Theme">
          {theme === "dark" ? "🌙" : "☀️"}
        </button>
      </div>
    </div>
  );
}
