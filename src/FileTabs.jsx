import React from "react";

export default function FileTabs({ files, activeFile, onSelect, onAdd, onRename, onDelete }) {
  return (
    <div className="file-tabs" style={{ overflowX: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0 }}>
      {files.map((file, idx) => (
        <div
          key={file.name}
          className={"tab" + (activeFile === file.name ? " active" : "")}
          onClick={() => onSelect(file.name)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            background: activeFile === file.name ? '#007acc' : '#2d2d2d',
            color: activeFile === file.name ? '#fff' : '#d4d4d4',
            marginBottom: '2px',
            minWidth: '120px',
            fontSize: '1rem',
            cursor: 'pointer',
            position: 'relative',
            zIndex: 2,
            flexShrink: 0
          }}
        >
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '90px' }}>{file.name}</span>
          <button className="rename-btn" style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '1rem', marginLeft: '4px', zIndex: 2 }} onClick={e => { e.stopPropagation(); onRename(file.name); }}>✎</button>
          <button className="delete-btn" style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '1rem', marginLeft: '4px', zIndex: 2 }} onClick={e => { e.stopPropagation(); onDelete(file.name); }}>🗑️</button>
        </div>
      ))}
      <button className="add-btn" style={{ background: 'none', border: 'none', color: '#4caf50', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', marginLeft: '4px', zIndex: 2, minWidth: '120px', flexShrink: 0 }} onClick={onAdd}>+ New File</button>
    </div>
  );
}
