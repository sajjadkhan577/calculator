// calculator JS (same logic as before)
const exprEl = document.getElementById("expr");
const resultEl = document.getElementById("result");
let expression = "";

function updateDisplay() {
  exprEl.textContent = expression;
  resultEl.textContent = expression === "" ? "0" : evaluateSafe(expression);
}

function evaluateSafe(input) {
  if (input.trim() === "") return "0";
  // Replace operator symbols if needed; here we use standard JS operators
  const jsExpr = input.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/%/g,'/100');
  try {
    const val = Function('"use strict"; return ('+jsExpr+')')();
    if (!isFinite(val)) return "Error";
    return Number.isInteger(val) ? String(val) : String(parseFloat(val.toFixed(10))).replace(/\.0+$/,'');
  } catch {
    return "";
  }
}

function addChar(ch) {
  const last = expression.slice(-1);
  const operators = ['+','-','*','/'];
  if (operators.includes(ch)) {
    if (expression === "" && ch !== '-') return;
    if (operators.includes(last)) {
      expression = expression.slice(0,-1) + ch;
      updateDisplay(); return;
    }
  }
  expression += ch;
  updateDisplay();
}

document.querySelectorAll(".key").forEach(key => {
  key.addEventListener("click", () => {
    const val = key.dataset.value;
    const action = key.dataset.action;
    if (action === 'clear') { expression = ''; updateDisplay(); return; }
    if (action === 'back') { expression = expression.slice(0,-1); updateDisplay(); return; }
    if (action === 'equals') {
      const res = evaluateSafe(expression);
      if (res === 'Error' || res === '') { resultEl.textContent = 'Error'; }
      else { expression = res; updateDisplay(); }
      return;
    }
    if (val) addChar(val);
  });
});

// keyboard support
window.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') { addChar(e.key); e.preventDefault(); return; }
  if (e.key === '.') { addChar('.'); e.preventDefault(); return; }
  if (['+','-','*','/'].includes(e.key)) { addChar(e.key); e.preventDefault(); return; }
  if (e.key === 'Enter') {
    const res = evaluateSafe(expression);
    if (res === 'Error' || res === '') { resultEl.textContent = 'Error'; }
    else { expression = res; updateDisplay(); }
    e.preventDefault(); return;
  }
  if (e.key === 'Backspace') { expression = expression.slice(0,-1); updateDisplay(); e.preventDefault(); return; }
  if (e.key === 'Escape') { expression = ''; updateDisplay(); e.preventDefault(); return; }
  if (e.key === '%') { addChar('%'); e.preventDefault(); return; }
});

updateDisplay();
