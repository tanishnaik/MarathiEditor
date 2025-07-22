import React, { useState } from "react";
import HeaderBar from "./HeaderBar";
import EditorPane from "./EditorPane";
import OutputTerminal from "./OutputTerminal";
import FileTabs from "./FileTabs";
import { compileMarathiScript, runCompiledJS } from "./marathiCompiler";
import "./App.css";

const syntaxHelp = `// MarathiScript Syntax Reference
// thev x = 5        => let x = 5;
// bol "Hello"       => console.log("Hello");
// jar x baag 5:     => if (x == 5) {
// nahi tar:         => else {
// samplya           => }
// kram 3 vela:      => for (let i0 = 0; i0 < 3; i0++) {
// kay payje         => prompt() (takes user input as string)
// baag              => ==
`;

const defaultFiles = [
  { name: "main.m", content: `thev a = 10\nthev b = 5\nthev sum = a + b\nbol sum` }
];

export default function App() {
  const [files, setFiles] = useState(defaultFiles);
  const [activeFile, setActiveFile] = useState(files[0].name);
  const [output, setOutput] = useState("");
  const [theme, setTheme] = useState("dark");

  const handleRun = () => {
    const code = files.find(f => f.name === activeFile)?.content || "";
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
    if (newName && newName.endsWith(".m") && !files.some(f => f.name === newName)) {
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
      </div>
    </div>
  );
}
