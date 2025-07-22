import React from "react";

export default function FileTabs({ files, activeFile, onSelect, onAdd, onRename, onDelete }) {
  return (
    <div className="file-tabs">
      {files.map((file, idx) => (
        <div
          key={file.name}
          className={"tab" + (activeFile === file.name ? " active" : "")}
          onClick={() => onSelect(file.name)}
        >
          {file.name}
          <button className="rename-btn" onClick={e => { e.stopPropagation(); onRename(file.name); }}>✎</button>
          <button className="delete-btn" onClick={e => { e.stopPropagation(); onDelete(file.name); }}>🗑️</button>
        </div>
      ))}
      <button className="add-btn" onClick={onAdd}>+ New File</button>
    </div>
  );
}
