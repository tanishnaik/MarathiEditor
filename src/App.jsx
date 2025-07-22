import React, { useState, useEffect } from "react";
import HeaderBar from "./HeaderBar";
import EditorPane from "./EditorPane";
import OutputTerminal from "./OutputTerminal";
import FileTabs from "./FileTabs";
import { compileMarathiScript, runCompiledJS } from "./marathiCompiler";
import "./App.css";

const syntaxHelp = `// MarathiScript Syntax Reference\n// thev x = 5        => let x = 5;\n// bol \"Hello\"       => console.log(\"Hello\");\n// jar x baag 5:     => if (x == 5) {\n// nahi tar:         => else {\n// samplya           => }\n// kram 3 vela:      => for (let i0 = 0; i0 < 3; i0++) {\n// kay payje         => prompt() (takes user input as string)\n// baag              => ==\n`;

const LS_KEY = "marathiScriptFiles";

function validateSyntax(code) {
  const lines = code.split(/\r?\n/);
  let errors = [];
  let blockStack = [];
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("//")) return;
    if (/^thev\s+(\w+)\s*=\s*(.+)$/.test(trimmed)) return;
    if (/^bol\s+(.+)$/.test(trimmed)) return;
    if (/^jar\s+(.+)\s+baag\s+(.+):$/.test(trimmed)) { blockStack.push('if'); return; }
    if (/^nahi\s+tar:$/.test(trimmed)) {
      if (!blockStack.length || blockStack[blockStack.length-1] !== 'if') errors.push(`Line ${idx+1}: 'nahi tar:' without matching 'jar'`);
      return;
    }
    if (/^kram\s+(\d+)\s+vela:$/.test(trimmed)) { blockStack.push('for'); return; }
    if (/^samplya$/.test(trimmed)) {
      if (!blockStack.length) errors.push(`Line ${idx+1}: 'samplya' without open block`);
      else blockStack.pop();
      return;
    }
    if (/^kay\s+payje$/.test(trimmed)) return;
    errors.push(`Line ${idx+1}: Unknown or invalid syntax`);
  });
  if (blockStack.length) errors.push(`Unclosed block(s) at end of file`);
  return errors;
}

export default function App() {
  const [files, setFiles] = useState(() => {
    const saved = localStorage.getItem(LS_KEY);
    return saved ? JSON.parse(saved) : [{ name: "main.m", content: syntaxHelp }];
  });
  const [activeFile, setActiveFile] = useState(files[0].name);
  const [output, setOutput] = useState("");
  const [theme, setTheme] = useState("dark");
  const [syntaxErrors, setSyntaxErrors] = useState([]);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    const code = files.find(f => f.name === activeFile)?.content || "";
    setSyntaxErrors(validateSyntax(code));
  }, [files, activeFile]);

  const handleRun = () => {
    const code = files.find(f => f.name === activeFile)?.content || "";
    const errors = validateSyntax(code);
    setSyntaxErrors(errors);
    if (errors.length) {
      setOutput(errors.map(e => `[Syntax Error] ${e}`).join("\n"));
      return;
    }
    const compiled = compileMarathiScript(code);
    const result = runCompiledJS(compiled);
    setOutput(result);
  };

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleFileChange = content => {
    setFiles(files => files.map(f => f.name === activeFile ? { ...f, content } : f));
  };

  const handleAddFile = () => {
    let idx = 1;
    let name;
    do { name = `untitled${idx}.m`; idx++; } while (files.some(f => f.name === name));
    setFiles([...files, { name, content: syntaxHelp }]);
    setActiveFile(name);
  };

  const handleRenameFile = oldName => {
    const newName = prompt("Rename file:", oldName);
    if (newName && !files.some(f => f.name === newName)) {
      setFiles(files => files.map(f => f.name === oldName ? { ...f, name: newName } : f));
      setActiveFile(newName);
    }
  };

  const handleDeleteFile = name => {
    if (files.length === 1) return;
    const idx = files.findIndex(f => f.name === name);
    const newFiles = files.filter(f => f.name !== name);
    setFiles(newFiles);
    setActiveFile(newFiles[Math.max(0, idx - 1)].name);
  };

  return (
    <div className={`ide-root ${theme}`}>
      <HeaderBar theme={theme} onThemeToggle={handleThemeToggle} onRun={handleRun} />
      <div className="main-content">
        <FileTabs
          files={files}
          activeFile={activeFile}
          onSelect={setActiveFile}
          onAdd={handleAddFile}
          onRename={handleRenameFile}
          onDelete={handleDeleteFile}
        />
        <EditorPane
          value={files.find(f => f.name === activeFile)?.content || ""}
          onChange={handleFileChange}
          theme={theme}
        />
        <OutputTerminal output={output} />
        {syntaxErrors.length > 0 && (
          <div style={{ color: '#ff4c4c', marginTop: '1rem', fontFamily: 'Fira Mono, monospace', fontSize: '1rem' }}>
            <b>Syntax Errors:</b>
            <ul>
              {syntaxErrors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
