// MarathiScript to JS compiler and safe runner

export function compileMarathiScript(code) {
  let lines = code.split(/\r?\n/);
  let js = [];
  let indent = 0;
  let loopId = 0;
  let blockStack = [];
  lines.forEach(line => {
    let trimmed = line.trim();
    if (!trimmed) return;
    // thev x = 5
    if (/^thev\s+(\w+)\s*=\s*(.+)$/.test(trimmed)) {
      let [, v, val] = trimmed.match(/^thev\s+(\w+)\s*=\s*(.+)$/);
      // If value is 'kay payje', assign prompt result
      if (/^kay\s+payje$/.test(val.trim())) {
        js.push(`${'  '.repeat(indent)}let ${v} = prompt();`);
      } else {
        js.push(`${'  '.repeat(indent)}let ${v} = ${val};`);
      }
    }
    // bol "text" or bol x
    else if (/^bol\s+(.+)$/.test(trimmed)) {
      let [, val] = trimmed.match(/^bol\s+(.+)$/);
      js.push(`${'  '.repeat(indent)}console.log(${val});`);
    }
    // jar x baag 5:
    else if (/^jar\s+(.+)\s+baag\s+(.+):$/.test(trimmed)) {
      let [, left, right] = trimmed.match(/^jar\s+(.+)\s+baag\s+(.+):$/);
      js.push(`${'  '.repeat(indent)}if (${left} == ${right}) {`);
      blockStack.push('if');
      indent++;
    }
    // nahi tar:
    else if (/^nahi\s+tar:$/.test(trimmed)) {
      if (blockStack.length && blockStack[blockStack.length - 1] === 'if') {
        indent--;
        js.push(`${'  '.repeat(indent)}} else {`);
        blockStack[blockStack.length - 1] = 'else';
        indent++;
      } else {
        js.push(`${'  '.repeat(indent)}// nahi tar: (no matching if)`);
      }
    }
    // kram 5 vela:
    else if (/^kram\s+(\d+)\s+vela:$/.test(trimmed)) {
      let [, count] = trimmed.match(/^kram\s+(\d+)\s+vela:$/);
      js.push(`${'  '.repeat(indent)}for (let i${loopId} = 0; i${loopId} < ${count}; i${loopId}++) {`);
      blockStack.push('for');
      loopId++;
      indent++;
    }
    // samplya
    else if (/^samplya$/.test(trimmed)) {
      if (blockStack.length) {
        indent--;
        js.push(`${'  '.repeat(indent)}}`);
        blockStack.pop();
      } else {
        js.push(`${'  '.repeat(indent)}// samplya (no open block)`);
      }
    }
    // comments or unknown
    else {
      js.push(`${'  '.repeat(indent)}// ${trimmed}`);
    }
  });
  // Close any remaining open blocks
  while (blockStack.length) {
    indent--;
    js.push(`${'  '.repeat(indent)}}`);
    blockStack.pop();
  }
  return js.join('\n');
}

export function runCompiledJS(jsCode) {
  let output = "";
  const log = (...args) => {
    output += args.join(" ") + "\n";
  };
  const prompt = () => window.prompt("kay payje?");
  try {
    // eslint-disable-next-line no-new-func
    new Function("console", "prompt", jsCode)( { log }, prompt );
  } catch (e) {
    output += "[Error] " + e.message;
  }
  return output.trim();
}
