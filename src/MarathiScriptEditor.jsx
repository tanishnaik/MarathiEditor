import React from "react";

export default function MarathiScriptEditor({ value, onChange }) {
  return (
    <div className="editor-container">
      <h2>MarathiScript Code</h2>
      <textarea
        className="code-editor"
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={16}
        spellCheck={false}
        style={{ fontFamily: 'monospace', width: '100%' }}
      />
    </div>
  );
}
