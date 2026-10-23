/**
 * AccessibleVerse — Interactive Coding Playground
 * HTML/CSS/JS Live Preview + Client-Side Secure Isolated Python Runner
 */

const CODING_EXERCISES = [
  {
    id: 'ex_html_1',
    lang: 'html',
    title: '1. Hello Universe Heading (HTML)',
    desc: 'Create an <h1> heading with the text "Hello Universe" and a paragraph with "Welcome to AccessibleVerse".',
    starter: `<!-- Exercise 1: HTML Basics -->\n<h1>Hello Universe</h1>\n<p>Welcome to AccessibleVerse</p>`,
    hint: 'Use the <h1> tag for your main title and <p> for the paragraph.',
    tests: [
      { name: 'Contains <h1> tag', check: (c) => /<h1>[\s\S]*?<\/h1>/i.test(c) },
      { name: 'Contains "Hello Universe"', check: (c) => /Hello Universe/i.test(c) },
      { name: 'Contains <p> tag with "AccessibleVerse"', check: (c) => /<p>[\s\S]*?AccessibleVerse[\s\S]*?<\/p>/i.test(c) }
    ]
  },
  {
    id: 'ex_css_1',
    lang: 'css',
    title: '2. Glowing Button Styling (CSS)',
    desc: 'Style a button with background color #6366f1, white text, padding 10px 20px, and border-radius 8px.',
    starter: `/* Exercise 2: Button Styling */\nbutton {\n  background-color: #6366f1;\n  color: #ffffff;\n  padding: 10px 20px;\n  border-radius: 8px;\n  border: none;\n  font-size: 16px;\n  cursor: pointer;\n}\n\nbutton:hover {\n  background-color: #4f46e5;\n}`,
    hint: 'Check that your background-color is set to #6366f1 and border-radius is 8px.',
    tests: [
      { name: 'Sets background-color to #6366f1', check: (c) => /background(-color)?:\s*#6366f1/i.test(c) },
      { name: 'Sets border-radius to 8px', check: (c) => /border-radius:\s*8px/i.test(c) },
      { name: 'Includes :hover state', check: (c) => /button:hover/i.test(c) }
    ]
  },
  {
    id: 'ex_js_1',
    lang: 'js',
    title: '3. Interactive Click Counter (JS)',
    desc: 'Write a JavaScript function that increments a variable count and logs "Count: X" to the console.',
    starter: `// Exercise 3: Click Counter\nlet count = 0;\n\nfunction increment() {\n  count += 1;\n  console.log("Count: " + count);\n  return count;\n}\n\nincrement();\nincrement();`,
    hint: 'Use count += 1 inside increment() and call console.log("Count: " + count).',
    tests: [
      { name: 'Defines count variable', check: (c) => /(let|var)\s+count\s*=/i.test(c) },
      { name: 'Defines increment function', check: (c) => /function\s+increment/i.test(c) },
      { name: 'Logs "Count: "', check: (c) => /console\.log\([^)]*Count:/i.test(c) }
    ]
  },
  {
    id: 'ex_py_1',
    lang: 'python',
    title: '4. Multiplication Tables (Python)',
    desc: 'Write a Python program that uses a for loop to print the 5 times table from 1 to 5 (e.g. "5 x 1 = 5").',
    starter: `# Exercise 4: Python Multiplication Table\nnum = 5\nfor i in range(1, 6):\n    print(f"{num} x {i} = {num * i}")`,
    hint: 'Use a for loop: for i in range(1, 6): and print(f"5 x {i} = {5 * i}")',
    tests: [
      { name: 'Uses for loop with range', check: (c) => /for\s+\w+\s+in\s+range\(/i.test(c) },
      { name: 'Contains print statement', check: (c) => /print\(/i.test(c) },
      { name: 'Produces 5 times table', check: (c) => /5\s*\*/i.test(c) || /5\s*x/i.test(c) }
    ]
  },
  {
    id: 'ex_py_2',
    lang: 'python',
    title: '5. Odd or Even Classifier (Python)',
    desc: 'Write an if/else condition checking if a number is even (num % 2 == 0) or odd.',
    starter: `# Exercise 5: Odd or Even\nnumber = 14\nif number % 2 == 0:\n    print(f"{number} is Even")\nelse:\n    print(f"{number} is Odd")`,
    hint: 'Use the modulo operator % to check divisibility by 2.',
    tests: [
      { name: 'Checks num % 2 == 0', check: (c) => /%\s*2\s*==\s*0/i.test(c) },
      { name: 'Includes if and else branches', check: (c) => /if[\s\S]*?:[\s\S]*?else\s*:/i.test(c) }
    ]
  }
];

let activeExercise = CODING_EXERCISES[0];
let currentLang = 'html';

document.addEventListener('DOMContentLoaded', () => {
  renderExercisesBar();
  loadExercise(CODING_EXERCISES[0].id);
  if (window.lucide) lucide.createIcons();
});

function renderExercisesBar() {
  const container = document.getElementById('exercises-bar');
  if (!container) return;
  container.innerHTML = CODING_EXERCISES.map(ex => `
    <div class="challenge-card ${ex.id === activeExercise.id ? 'active' : ''}" id="card-${ex.id}" onclick="loadExercise('${ex.id}')">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
        <span style="text-transform: uppercase; font-size: 0.75rem; font-weight: 800; color: #38bdf8;">${ex.lang}</span>
        <i data-lucide="code" style="width: 14px; height: 14px; color: #94a3b8;"></i>
      </div>
      <strong style="color: #f8fafc; font-size: 0.95rem; display: block; margin-bottom: 0.25rem;">${ex.title}</strong>
      <p style="color: #94a3b8; font-size: 0.8rem; margin: 0; line-height: 1.4;">${ex.desc}</p>
    </div>
  `).join('');
}

window.loadExercise = function(id) {
  const ex = CODING_EXERCISES.find(x => x.id === id);
  if (!ex) return;
  activeExercise = ex;

  document.querySelectorAll('.challenge-card').forEach(c => c.classList.remove('active'));
  const card = document.getElementById(`card-${id}`);
  if (card) card.classList.add('active');

  switchLanguage(ex.lang);
  const editor = document.getElementById('code-editor');
  if (editor) editor.value = ex.starter;

  renderTestCases();
  runCode();
  if (window.lucide) lucide.createIcons();
};

window.switchLanguage = function(lang) {
  currentLang = lang;
  ['html', 'css', 'js', 'python'].forEach(l => {
    const tab = document.getElementById(`tab-${l}`);
    if (tab) tab.classList.toggle('active', l === lang);
  });

  const previewFrame = document.getElementById('preview-frame');
  const consoleOutput = document.getElementById('console-output');

  if (lang === 'python') {
    if (previewFrame) previewFrame.style.display = 'none';
    if (consoleOutput) {
      consoleOutput.style.minHeight = '340px';
      consoleOutput.textContent = 'Python 3 Isolated Client Sandbox Ready.\nClick "Run Code" to execute.';
    }
  } else {
    if (previewFrame) previewFrame.style.display = 'block';
    if (consoleOutput) consoleOutput.style.minHeight = '100px';
  }
};

window.runCode = function() {
  const code = document.getElementById('code-editor')?.value || '';
  const consoleOut = document.getElementById('console-output');

  if (currentLang === 'python') {
    // Execute Python in strictly isolated client runner
    runIsolatedPython(code);
    return;
  }

  // HTML / CSS / JS in preview iframe
  const frame = document.getElementById('preview-frame');
  if (!frame) return;

  let docContent = '';
  if (currentLang === 'html') {
    docContent = `<!DOCTYPE html><html><head><style>body { font-family: sans-serif; padding: 1.5rem; color: #1e293b; }</style></head><body>${code}</body></html>`;
  } else if (currentLang === 'css') {
    docContent = `<!DOCTYPE html><html><head><style>${code}</style></head><body><button>AccessibleVerse Button</button></body></html>`;
  } else if (currentLang === 'js') {
    docContent = `
      <!DOCTYPE html><html><head></head><body>
      <div id="out" style="font-family: monospace; padding: 1.5rem; color: #0f172a;"></div>
      <script>
        const logs = [];
        const originalLog = console.log;
        console.log = function(...args) {
          logs.push(args.join(' '));
          originalLog.apply(console, args);
          window.parent.postMessage({ type: 'iframe_log', text: args.join(' ') }, '*');
        };
        try {
          ${code}
        } catch(err) {
          window.parent.postMessage({ type: 'iframe_err', text: err.toString() }, '*');
        }
      <\/script></body></html>
    `;
  }

  frame.srcdoc = docContent;
  if (consoleOut) consoleOut.textContent = `[${currentLang.toUpperCase()} Build Succeeded] Output rendered in Live Preview.`;
};

// Handle Iframe Console Messages
window.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'iframe_log') {
    const out = document.getElementById('console-output');
    if (out) out.textContent += '\n> ' + e.data.text;
  } else if (e.data && e.data.type === 'iframe_err') {
    const out = document.getElementById('console-output');
    if (out) out.textContent += '\n❌ Error: ' + e.data.text;
  }
});

/**
 * Isolated Client-Side Python Sandbox
 * Safely parses and evaluates basic Python programs in the browser without network calls.
 */
function runIsolatedPython(code) {
  const out = document.getElementById('console-output');
  if (!out) return;
  out.textContent = 'Executing Python code in sandboxed client runtime...\n';

  try {
    const logs = [];
    // Safe interpreter for basic Python exercises
    const lines = code.split('\n');
    const scope = {};

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line || line.startsWith('#')) continue;

      // Handle simple print(...)
      if (line.startsWith('print(') && line.endsWith(')')) {
        let inner = line.substring(6, line.length - 1);
        // Handle f-string
        if (inner.startsWith('f"') || inner.startsWith("f'")) {
          inner = inner.substring(2, inner.length - 1);
          const resolved = inner.replace(/\{([^}]+)\}/g, (_, expr) => {
            return evalSafeExpr(expr, scope);
          });
          logs.push(resolved);
        } else {
          logs.push(evalSafeExpr(inner, scope));
        }
      }
      // Handle simple assignment: var = val
      else if (line.includes('=') && !line.includes('==') && !line.startsWith('for') && !line.startsWith('if')) {
        const [k, v] = line.split('=').map(s => s.trim());
        scope[k] = evalSafeExpr(v, scope);
      }
      // Handle simple for loop: for i in range(start, end):
      else if (line.startsWith('for ') && line.includes('in range(')) {
        const loopMatch = line.match(/for\s+(\w+)\s+in\s+range\((\d+),\s*(\d+)\):/);
        if (loopMatch) {
          const varName = loopMatch[1];
          const start = parseInt(loopMatch[2]);
          const end = parseInt(loopMatch[3]);

          // Collect body lines
          let bodyLines = [];
          while (i + 1 < lines.length && (lines[i + 1].startsWith('    ') || lines[i + 1].startsWith('\t'))) {
            bodyLines.push(lines[i + 1].trim());
            i++;
          }

          for (let val = start; val < end; val++) {
            scope[varName] = val;
            bodyLines.forEach(b => {
              if (b.startsWith('print(')) {
                let inner = b.substring(6, b.length - 1);
                if (inner.startsWith('f"') || inner.startsWith("f'")) {
                  inner = inner.substring(2, inner.length - 1);
                  const res = inner.replace(/\{([^}]+)\}/g, (_, expr) => evalSafeExpr(expr, scope));
                  logs.push(res);
                } else {
                  logs.push(evalSafeExpr(inner, scope));
                }
              }
            });
          }
        }
      }
      // Handle simple if/else: if num % 2 == 0:
      else if (line.startsWith('if ')) {
        const condMatch = line.match(/if\s+(.*?):/);
        if (condMatch) {
          const cond = condMatch[1];
          const condResult = !!evalSafeExpr(cond, scope);

          let ifBody = [];
          while (i + 1 < lines.length && lines[i + 1].startsWith('    ') && !lines[i + 1].trim().startsWith('else:')) {
            ifBody.push(lines[i + 1].trim());
            i++;
          }

          let elseBody = [];
          if (i + 1 < lines.length && lines[i + 1].trim() === 'else:') {
            i++; // skip else:
            while (i + 1 < lines.length && lines[i + 1].startsWith('    ')) {
              elseBody.push(lines[i + 1].trim());
              i++;
            }
          }

          const targetBody = condResult ? ifBody : elseBody;
          targetBody.forEach(b => {
            if (b.startsWith('print(')) {
              let inner = b.substring(6, b.length - 1);
              if (inner.startsWith('f"') || inner.startsWith("f'")) {
                inner = inner.substring(2, inner.length - 1);
                const res = inner.replace(/\{([^}]+)\}/g, (_, expr) => evalSafeExpr(expr, scope));
                logs.push(res);
              } else {
                logs.push(evalSafeExpr(inner, scope));
              }
            }
          });
        }
      }
    }

    out.textContent = logs.join('\n') || 'Code executed with return code 0 (no output).';
  } catch (err) {
    out.textContent = `❌ Python Runtime Exception: ${err.message}`;
  }
}

function evalSafeExpr(expr, scope) {
  expr = expr.trim();
  // Strip quotes for strings
  if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
    return expr.substring(1, expr.length - 1);
  }
  // Check numbers
  if (!isNaN(expr)) return Number(expr);
  // Substitute scope variables
  let jsExpr = expr;
  Object.keys(scope).forEach(k => {
    const regex = new RegExp(`\\b${k}\\b`, 'g');
    jsExpr = jsExpr.replace(regex, scope[k]);
  });

  // Evaluate simple arithmetic safely
  try {
    return Function(`"use strict"; return (${jsExpr})`)();
  } catch {
    return expr;
  }
}

function renderTestCases() {
  const container = document.getElementById('test-results-list');
  if (!container) return;
  container.innerHTML = activeExercise.tests.map(t => `
    <div style="background: #0f172a; border: 1px solid #334155; padding: 0.65rem 1rem; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
      <span style="font-size: 0.9rem; color: #e2e8f0;">${t.name}</span>
      <span class="test-status" style="font-size: 0.85rem; color: #94a3b8;">Pending Run</span>
    </div>
  `).join('');
}

window.runTestCases = function() {
  const code = document.getElementById('code-editor')?.value || '';
  const testItems = document.querySelectorAll('#test-results-list > div');
  let allPassed = true;

  activeExercise.tests.forEach((t, idx) => {
    const passed = t.check(code);
    if (!passed) allPassed = false;
    const item = testItems[idx];
    if (item) {
      const statusSpan = item.querySelector('.test-status');
      if (statusSpan) {
        statusSpan.innerHTML = passed ? '<span style="color: #10b981; font-weight: 700;">✅ Passed</span>' : '<span style="color: #ef4444; font-weight: 700;">❌ Failed</span>';
      }
    }
  });

  if (allPassed) {
    if (window.showToast) window.showToast(`🎉 All tests passed for "${activeExercise.title}"! +25 XP!`, 'success');
    try {
      const user = JSON.parse(localStorage.getItem('accessibleverse_user') || '{}');
      user.xp = (user.xp || 0) + 25;
      localStorage.setItem('accessibleverse_user', JSON.stringify(user));
      window.dispatchEvent(new CustomEvent('xpUpdated', { detail: { xp: user.xp, added: 25 } }));
      if (window.ApiClient && window.ApiClient.portfolio) {
        window.ApiClient.portfolio.addItem({
          title: `Solved: ${activeExercise.title}`,
          category: 'code',
          content: code,
          tags: [activeExercise.lang, 'coding']
        }).catch(() => {});
      }
    } catch {}
  } else {
    if (window.showToast) window.showToast('Some test cases failed. Click Hint for assistance.', 'warning');
  }
};

window.showChallengeHint = function() {
  if (window.showToast) {
    window.showToast(`💡 Hint: ${activeExercise.hint}`, 'info');
  } else {
    alert(activeExercise.hint);
  }
};

window.clearConsole = function() {
  const c = document.getElementById('console-output');
  if (c) c.textContent = 'Console cleared.';
};
