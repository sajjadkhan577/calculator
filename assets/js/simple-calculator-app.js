const STORAGE_KEYS = {
  settings: "simple-calculator.settings",
  history: "simple-calculator.history",
  profile: "simple-calculator.profile",
};

const DEFAULT_SETTINGS = {
  theme: "dark",
  blurStrength: 22,
  precisionDigits: 6,
  soundEnabled: false,
  animationsEnabled: true,
  angleMode: "deg",
};

const DEFAULT_PROFILE = {
  name: "Alex Lumina",
  email: "alex.lumina@premium.ai",
  role: "Product Designer",
  bio: "Designing premium utility experiences with a focus on polish, responsiveness, and clarity.",
};

const CONVERTER_CATEGORIES = {
  length: {
    label: "Length",
    units: {
      m: { label: "Meters (m)", toBase: (value) => value, fromBase: (value) => value },
      km: { label: "Kilometers (km)", toBase: (value) => value * 1000, fromBase: (value) => value / 1000 },
      ft: { label: "Feet (ft)", toBase: (value) => value * 0.3048, fromBase: (value) => value / 0.3048 },
      mi: { label: "Miles (mi)", toBase: (value) => value * 1609.344, fromBase: (value) => value / 1609.344 },
    },
  },
  weight: {
    label: "Weight",
    units: {
      kg: { label: "Kilograms (kg)", toBase: (value) => value, fromBase: (value) => value },
      g: { label: "Grams (g)", toBase: (value) => value / 1000, fromBase: (value) => value * 1000 },
      lb: { label: "Pounds (lb)", toBase: (value) => value * 0.45359237, fromBase: (value) => value / 0.45359237 },
      oz: { label: "Ounces (oz)", toBase: (value) => value * 0.0283495231, fromBase: (value) => value / 0.0283495231 },
    },
  },
  temperature: {
    label: "Temperature",
    units: {
      c: { label: "Celsius (°C)", toBase: (value) => value, fromBase: (value) => value },
      f: { label: "Fahrenheit (°F)", toBase: (value) => (value - 32) * (5 / 9), fromBase: (value) => value * (9 / 5) + 32 },
      k: { label: "Kelvin (K)", toBase: (value) => value - 273.15, fromBase: (value) => value + 273.15 },
    },
  },
  currency: {
    label: "Currency",
    units: {
      usd: { label: "US Dollar (USD)", toBase: (value) => value, fromBase: (value) => value },
      eur: { label: "Euro (EUR)", toBase: (value) => value / 0.92, fromBase: (value) => value * 0.92 },
      gbp: { label: "British Pound (GBP)", toBase: (value) => value / 0.79, fromBase: (value) => value * 0.79 },
      pkr: { label: "Pakistani Rupee (PKR)", toBase: (value) => value / 278, fromBase: (value) => value * 278 },
    },
  },
};

function readStorage(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function getSettings() {
  return { ...DEFAULT_SETTINGS, ...readStorage(STORAGE_KEYS.settings, {}) };
}

function saveSettings(nextSettings) {
  writeStorage(STORAGE_KEYS.settings, nextSettings);
  applySettings(nextSettings);
}

function getProfile() {
  return { ...DEFAULT_PROFILE, ...readStorage(STORAGE_KEYS.profile, {}) };
}

function saveProfile(nextProfile) {
  writeStorage(STORAGE_KEYS.profile, nextProfile);
}

function getHistory() {
  return readStorage(STORAGE_KEYS.history, []);
}

function saveHistory(history) {
  writeStorage(STORAGE_KEYS.history, history.slice(0, 40));
  renderSharedStats();
}

function formatNumber(value, digits = getSettings().precisionDigits) {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  const absolute = Math.abs(value);
  if (absolute >= 1e12 || (absolute > 0 && absolute < 1e-6)) {
    return value.toExponential(Math.min(digits, 6)).replace(/\.?0+e/, "e");
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
  }).format(value);
}

function formatTimestamp(timestamp) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

function applySettings(settings = getSettings()) {
  const systemPrefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  const resolvedTheme = settings.theme === "system" ? (systemPrefersLight ? "light" : "dark") : settings.theme;

  document.documentElement.dataset.theme = resolvedTheme;
  document.documentElement.style.setProperty("--blur-strength", `${settings.blurStrength}px`);
  document.body.classList.toggle("motion-off", !settings.animationsEnabled);
}

function getTotals(history = getHistory()) {
  return {
    all: history.length,
    calculations: history.filter((entry) => entry.type === "calculation").length,
    conversions: history.filter((entry) => entry.type === "conversion").length,
    standard: history.filter((entry) => entry.page === "standard").length,
    scientific: history.filter((entry) => entry.page === "scientific").length,
  };
}

function renderSharedStats() {
  const totals = getTotals();
  document.querySelectorAll("[data-total-activities]").forEach((node) => {
    node.textContent = totals.all;
  });
  document.querySelectorAll("[data-total-calculations]").forEach((node) => {
    node.textContent = totals.calculations;
  });
  document.querySelectorAll("[data-total-conversions]").forEach((node) => {
    node.textContent = totals.conversions;
  });
  document.querySelectorAll("[data-standard-total]").forEach((node) => {
    node.textContent = totals.standard;
  });
  document.querySelectorAll("[data-scientific-total]").forEach((node) => {
    node.textContent = totals.scientific;
  });
}

function createEmptyState(message) {
  const wrapper = document.createElement("div");
  wrapper.className = "empty-state";
  wrapper.innerHTML = `<p>${message}</p>`;
  return wrapper;
}

function renderPreview(container, entries, emptyMessage) {
  if (!container) {
    return;
  }

  container.innerHTML = "";
  if (!entries.length) {
    container.append(createEmptyState(emptyMessage));
    return;
  }

  entries.forEach((entry) => {
    const item = document.createElement("article");
    item.className = "activity-item";
    item.innerHTML = `
      <div class="activity-meta">
        <span>${entry.pageLabel}</span>
        <span>${formatTimestamp(entry.createdAt)}</span>
      </div>
      <h4>${entry.title}</h4>
      <p>${entry.resultLabel}</p>
    `;
    container.append(item);
  });
}

function addHistoryEntry(entry) {
  const history = getHistory();
  history.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    createdAt: Date.now(),
    ...entry,
  });
  saveHistory(history);
}

function downloadData() {
  const payload = {
    settings: getSettings(),
    profile: getProfile(),
    history: getHistory(),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "simple-calculator-data-export.json";
  link.click();
  URL.revokeObjectURL(url);
}

function resetAppData() {
  const confirmed = window.confirm("Reset all saved settings, history, and profile data?");
  if (!confirmed) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEYS.settings);
  window.localStorage.removeItem(STORAGE_KEYS.history);
  window.localStorage.removeItem(STORAGE_KEYS.profile);
  applySettings(DEFAULT_SETTINGS);
  window.location.reload();
}

function playClick() {
  const settings = getSettings();
  if (!settings.soundEnabled) {
    return;
  }

  try {
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) {
      return;
    }
    const context = new AudioContextCtor();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    oscillator.frequency.value = 540;
    oscillator.type = "sine";
    gainNode.gain.value = 0.02;
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.05);
  } catch {
    // Audio feedback is optional.
  }
}

function pulseResult(node) {
  node.classList.remove("updated");
  void node.offsetWidth;
  node.classList.add("updated");
}

function buildPageLabel(page) {
  return {
    standard: "Standard Calculator",
    scientific: "Scientific Calculator",
    converter: "Unit Converter",
  }[page] || "Simple Calculator";
}

function initStandardCalculator() {
  const expressionNode = document.querySelector("[data-standard-expression]");
  const resultNode = document.querySelector("[data-standard-result]");
  if (!expressionNode || !resultNode) {
    return;
  }

  const state = {
    currentValue: "0",
    previousValue: null,
    operator: null,
    waitingForOperand: false,
    expression: "",
    justEvaluated: false,
  };

  const update = () => {
    expressionNode.textContent = state.expression || buildExpression();
    resultNode.textContent = formatNumber(Number(state.currentValue));
    pulseResult(resultNode);
  };

  const buildExpression = () => {
    if (state.operator && state.previousValue !== null) {
      const current = state.waitingForOperand ? "" : ` ${formatNumber(Number(state.currentValue))}`;
      return `${formatNumber(state.previousValue)} ${operatorLabel(state.operator)}${current}`;
    }
    return formatNumber(Number(state.currentValue));
  };

  const operatorLabel = (operator) => ({ "+": "+", "-": "−", "*": "×", "/": "÷" })[operator];

  const clear = () => {
    state.currentValue = "0";
    state.previousValue = null;
    state.operator = null;
    state.waitingForOperand = false;
    state.expression = "";
    state.justEvaluated = false;
    update();
  };

  const appendDigit = (digit) => {
    if (state.justEvaluated && !state.operator) {
      state.currentValue = digit;
      state.expression = "";
      state.justEvaluated = false;
      update();
      return;
    }
    if (state.waitingForOperand) {
      state.currentValue = digit;
      state.waitingForOperand = false;
    } else if (state.currentValue === "0") {
      state.currentValue = digit;
    } else if (state.currentValue.replace("-", "").replace(".", "").length < 14) {
      state.currentValue += digit;
    }
    state.expression = buildExpression();
    update();
  };

  const appendDecimal = () => {
    if (state.waitingForOperand) {
      state.currentValue = "0.";
      state.waitingForOperand = false;
    } else if (!state.currentValue.includes(".")) {
      state.currentValue += ".";
    }
    state.expression = buildExpression();
    update();
  };

  const applyOperator = (nextOperator) => {
    const numericCurrent = Number(state.currentValue);
    if (state.operator && !state.waitingForOperand) {
      const computed = compute(state.previousValue, numericCurrent, state.operator);
      if (computed === null) {
        state.expression = "Cannot divide by zero";
        state.currentValue = "0";
        state.previousValue = null;
        state.operator = null;
        state.waitingForOperand = false;
        update();
        return;
      }
      state.currentValue = String(computed);
      state.previousValue = computed;
    } else {
      state.previousValue = numericCurrent;
    }
    state.operator = nextOperator;
    state.waitingForOperand = true;
    state.justEvaluated = false;
    state.expression = `${formatNumber(state.previousValue)} ${operatorLabel(nextOperator)}`;
    update();
  };

  const compute = (left, right, operator) => {
    switch (operator) {
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "*":
        return left * right;
      case "/":
        return right === 0 ? null : left / right;
      default:
        return right;
    }
  };

  const evaluate = () => {
    if (!state.operator || state.waitingForOperand || state.previousValue === null) {
      return;
    }
    const left = state.previousValue;
    const right = Number(state.currentValue);
    const computed = compute(left, right, state.operator);
    if (computed === null) {
      state.expression = "Cannot divide by zero";
      state.currentValue = "0";
      state.previousValue = null;
      state.operator = null;
      state.waitingForOperand = false;
      update();
      return;
    }

    const expression = `${formatNumber(left)} ${operatorLabel(state.operator)} ${formatNumber(right)} =`;
    const result = formatNumber(computed);

    addHistoryEntry({
      type: "calculation",
      page: "standard",
      pageLabel: buildPageLabel("standard"),
      title: expression,
      resultLabel: result,
      expression,
      value: computed,
    });

    state.currentValue = String(computed);
    state.previousValue = null;
    state.operator = null;
    state.waitingForOperand = false;
    state.expression = expression;
    state.justEvaluated = true;
    update();
    renderSharedPreviews();
  };

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-standard-number], [data-standard-operator], [data-standard-action]");
    if (!button) {
      return;
    }
    playClick();
    button.classList.add("pressed");
    window.setTimeout(() => button.classList.remove("pressed"), 120);

    if (button.dataset.standardNumber) {
      appendDigit(button.dataset.standardNumber);
      return;
    }
    if (button.dataset.standardOperator) {
      applyOperator(button.dataset.standardOperator);
      return;
    }
    switch (button.dataset.standardAction) {
      case "clear":
        clear();
        break;
      case "sign":
        if (state.currentValue !== "0") {
          state.currentValue = state.currentValue.startsWith("-") ? state.currentValue.slice(1) : `-${state.currentValue}`;
          state.expression = buildExpression();
          update();
        }
        break;
      case "percent":
        state.currentValue = String(Number(state.currentValue) / 100);
        state.expression = buildExpression();
        update();
        break;
      case "decimal":
        appendDecimal();
        break;
      case "backspace":
        if (!state.waitingForOperand) {
          state.currentValue = state.currentValue.length <= 1 ? "0" : state.currentValue.slice(0, -1);
          state.expression = buildExpression();
          update();
        }
        break;
      case "equals":
        evaluate();
        break;
      default:
        break;
    }
  });

  document.addEventListener("keydown", (event) => {
    if (document.body.dataset.page !== "standard") {
      return;
    }
    if (/^\d$/.test(event.key)) {
      appendDigit(event.key);
    } else if (event.key === ".") {
      appendDecimal();
    } else if (["+", "-", "*", "/"].includes(event.key)) {
      applyOperator(event.key);
    } else if (event.key === "Enter" || event.key === "=") {
      event.preventDefault();
      evaluate();
    } else if (event.key === "Backspace") {
      event.preventDefault();
      state.currentValue = state.currentValue.length <= 1 ? "0" : state.currentValue.slice(0, -1);
      state.expression = buildExpression();
      update();
    } else if (event.key === "Escape") {
      clear();
    }
  });

  const openHistory = document.querySelector("[data-open-history]");
  if (openHistory) {
    openHistory.addEventListener("click", () => {
      window.location.href = "calculation-history.html";
    });
  }

  update();
}

function initScientificCalculator() {
  const expressionNode = document.querySelector("[data-scientific-expression]");
  const resultNode = document.querySelector("[data-scientific-result]");
  if (!expressionNode || !resultNode) {
    return;
  }

  const settings = getSettings();
  let expression = window.sessionStorage.getItem("simple-calculator.recallExpression") || "";
  let angleMode = settings.angleMode;
  window.sessionStorage.removeItem("simple-calculator.recallExpression");

  const angleSummary = document.querySelector("[data-angle-summary]");

  const update = (result = "0") => {
    expressionNode.textContent = expression || "0";
    resultNode.textContent = result;
    if (angleSummary) {
      angleSummary.textContent = angleMode.toUpperCase();
    }
    pulseResult(resultNode);
    document.querySelectorAll("[data-angle-mode]").forEach((button) => {
      button.classList.toggle("active", button.dataset.angleMode === angleMode);
    });
  };

  const safeEvaluate = (source) => {
    if (!source.trim()) {
      return 0;
    }

    const allowed = /^[0-9+\-*/().,%\s^a-z]+$/i;
    if (!allowed.test(source)) {
      throw new Error("Unsupported symbol");
    }

    const trig = {
      sin: (value) => Math.sin(angleMode === "deg" ? (value * Math.PI) / 180 : value),
      cos: (value) => Math.cos(angleMode === "deg" ? (value * Math.PI) / 180 : value),
      tan: (value) => Math.tan(angleMode === "deg" ? (value * Math.PI) / 180 : value),
    };

    let sanitized = source
      .replace(/\bpi\b/gi, "Math.PI")
      .replace(/\be\b/g, "Math.E")
      .replace(/\bsqrt\(/g, "Math.sqrt(")
      .replace(/\blog\(/g, "Math.log10(")
      .replace(/\bln\(/g, "Math.log(")
      .replace(/\bsin\(/g, "trig.sin(")
      .replace(/\bcos\(/g, "trig.cos(")
      .replace(/\btan\(/g, "trig.tan(")
      .replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");

    sanitized = sanitized.replace(/(\d+(?:\.\d+)?|\([^()]+\))\^(\d+(?:\.\d+)?|\([^()]+\))/g, "Math.pow($1,$2)");

    // Re-run exponent replacement to handle repeated operators.
    while (sanitized.includes("^")) {
      sanitized = sanitized.replace(/(\d+(?:\.\d+)?|\([^()]+\)|Math\.[A-Za-z0-9.()_,]+)\^(\d+(?:\.\d+)?|\([^()]+\)|Math\.[A-Za-z0-9.()_,]+)/, "Math.pow($1,$2)");
      if (!sanitized.includes("^")) {
        break;
      }
      if (!/Math\.pow/.test(sanitized)) {
        break;
      }
    }

    const evaluator = Function("trig", `return (${sanitized});`);
    const evaluated = evaluator(trig);
    if (!Number.isFinite(evaluated)) {
      throw new Error("Invalid result");
    }
    return evaluated;
  };

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-scientific-insert], [data-scientific-action], [data-angle-mode]");
    if (!button) {
      return;
    }
    playClick();

    if (button.dataset.angleMode) {
      angleMode = button.dataset.angleMode;
      update(resultNode.textContent || "0");
      return;
    }

    if (button.dataset.scientificInsert) {
      expression += button.dataset.scientificInsert;
      update(resultNode.textContent || "0");
      return;
    }

    switch (button.dataset.scientificAction) {
      case "clear":
        expression = "";
        update("0");
        break;
      case "backspace":
        expression = expression.slice(0, -1);
        update(resultNode.textContent || "0");
        break;
      case "percent":
        expression += "%";
        update(resultNode.textContent || "0");
        break;
      case "equals":
        try {
          const computed = safeEvaluate(expression);
          const formatted = formatNumber(computed);
          addHistoryEntry({
            type: "calculation",
            page: "scientific",
            pageLabel: buildPageLabel("scientific"),
            title: `${expression} =`,
            resultLabel: formatted,
            expression,
            value: computed,
          });
          update(formatted);
          renderSharedPreviews();
        } catch {
          update("Error");
        }
        break;
      default:
        break;
    }
  });

  update("0");
}

function initConverter() {
  const categoriesContainer = document.querySelector("[data-converter-categories]");
  const fromSelect = document.querySelector("[data-converter-from]");
  const toSelect = document.querySelector("[data-converter-to]");
  const amountInput = document.getElementById("converterAmount");
  const resultNode = document.querySelector("[data-converter-result]");
  const detailNode = document.querySelector("[data-converter-detail]");
  const badgeNode = document.querySelector("[data-converter-badge]");
  if (!categoriesContainer || !fromSelect || !toSelect || !amountInput || !resultNode || !detailNode || !badgeNode) {
    return;
  }

  let currentCategory = "length";

  const setUnits = () => {
    const category = CONVERTER_CATEGORIES[currentCategory];
    badgeNode.textContent = category.label;
    categoriesContainer.innerHTML = "";
    Object.entries(CONVERTER_CATEGORIES).forEach(([key, value]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `toggle-button${key === currentCategory ? " active" : ""}`;
      button.textContent = value.label;
      button.dataset.converterCategory = key;
      categoriesContainer.append(button);
    });

    const options = Object.entries(category.units)
      .map(([key, unit]) => `<option value="${key}">${unit.label}</option>`)
      .join("");
    fromSelect.innerHTML = options;
    toSelect.innerHTML = options;
    const unitKeys = Object.keys(category.units);
    fromSelect.value = unitKeys[0];
    toSelect.value = unitKeys[Math.min(1, unitKeys.length - 1)];
    convert();
  };

  const convert = () => {
    const category = CONVERTER_CATEGORIES[currentCategory];
    const amount = Number(amountInput.value || 0);
    const from = category.units[fromSelect.value];
    const to = category.units[toSelect.value];
    const baseValue = from.toBase(amount);
    const converted = to.fromBase(baseValue);
    const formatted = formatNumber(converted);
    resultNode.textContent = formatted;
    detailNode.textContent = `${formatNumber(amount)} ${from.label} = ${formatted} ${to.label}`;
    pulseResult(resultNode);
  };

  const saveConversion = () => {
    const category = CONVERTER_CATEGORIES[currentCategory];
    const amount = Number(amountInput.value || 0);
    const result = resultNode.textContent;
    addHistoryEntry({
      type: "conversion",
      page: "converter",
      pageLabel: buildPageLabel("converter"),
      title: `${category.label}: ${formatNumber(amount)} ${fromSelect.value.toUpperCase()} → ${toSelect.value.toUpperCase()}`,
      resultLabel: result,
      value: result,
    });
    renderSharedPreviews();
  };

  categoriesContainer.addEventListener("click", (event) => {
    const button = event.target.closest("[data-converter-category]");
    if (!button) {
      return;
    }
    playClick();
    currentCategory = button.dataset.converterCategory;
    setUnits();
  });

  [fromSelect, toSelect, amountInput].forEach((element) => {
    element.addEventListener("input", convert);
    element.addEventListener("change", convert);
  });

  const swapButton = document.querySelector("[data-converter-swap]");
  swapButton.addEventListener("click", () => {
    playClick();
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
    convert();
  });

  amountInput.addEventListener("change", saveConversion);
  fromSelect.addEventListener("change", saveConversion);
  toSelect.addEventListener("change", saveConversion);

  setUnits();
}

function initHistoryPage() {
  const listContainer = document.querySelector("[data-history-list]");
  if (!listContainer) {
    return;
  }

  let currentFilter = "all";

  const render = () => {
    const history = getHistory().filter((entry) => currentFilter === "all" || entry.type === currentFilter);
    listContainer.innerHTML = "";

    if (!history.length) {
      listContainer.append(createEmptyState("No saved entries yet. Use the calculators or converter to populate history."));
      return;
    }

    history.forEach((entry) => {
      const item = document.createElement("article");
      item.className = "history-item";
      item.innerHTML = `
        <div class="history-meta">
          <span>${entry.pageLabel}</span>
          <span>${formatTimestamp(entry.createdAt)}</span>
        </div>
        <h4>${entry.title}</h4>
        <p>${entry.resultLabel}</p>
        <div class="history-actions">
          <button class="history-action" type="button" data-history-copy="${entry.id}">Copy Result</button>
          <button class="history-action" type="button" data-history-reuse="${entry.id}">Reuse</button>
        </div>
      `;
      listContainer.append(item);
    });
  };

  document.querySelectorAll("[data-history-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      currentFilter = button.dataset.historyFilter;
      document.querySelectorAll("[data-history-filter]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      render();
    });
  });

  document.addEventListener("click", async (event) => {
    const copyButton = event.target.closest("[data-history-copy]");
    const reuseButton = event.target.closest("[data-history-reuse]");

    if (copyButton) {
      const entry = getHistory().find((item) => item.id === copyButton.dataset.historyCopy);
      if (entry) {
        try {
          await navigator.clipboard.writeText(entry.resultLabel);
        } catch {
          // Ignore clipboard failure.
        }
      }
    }

    if (reuseButton) {
      const entry = getHistory().find((item) => item.id === reuseButton.dataset.historyReuse);
      if (!entry) {
        return;
      }
      if (entry.page === "scientific" && entry.expression) {
        window.sessionStorage.setItem("simple-calculator.recallExpression", entry.expression);
        window.location.href = "scientific-calculator.html";
      } else {
        window.location.href = entry.type === "conversion" ? "unit-converter.html" : "standard-calculator.html";
      }
    }
  });

  const clearButton = document.querySelector("[data-history-clear]");
  clearButton.addEventListener("click", () => {
    const confirmed = window.confirm("Clear all history entries?");
    if (!confirmed) {
      return;
    }
    saveHistory([]);
    render();
  });

  render();
}

function initSettingsPage() {
  if (document.body.dataset.page !== "settings") {
    return;
  }

  const settings = getSettings();
  const blurInput = document.querySelector('[data-setting="blurStrength"]');
  const precisionInput = document.querySelector('[data-setting="precisionDigits"]');
  const blurReadout = document.querySelector("[data-blur-readout]");
  const precisionReadout = document.querySelector("[data-precision-readout]");

  blurInput.value = settings.blurStrength;
  precisionInput.value = settings.precisionDigits;
  blurReadout.textContent = `${settings.blurStrength}px blur`;
  precisionReadout.textContent = `${settings.precisionDigits} decimal places`;

  document.querySelectorAll("[data-theme-value]").forEach((button) => {
    button.classList.toggle("active", button.dataset.themeValue === settings.theme);
    button.addEventListener("click", () => {
      const next = { ...getSettings(), theme: button.dataset.themeValue };
      saveSettings(next);
      document.querySelectorAll("[data-theme-value]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
    });
  });

  document.querySelectorAll("[data-angle-default]").forEach((button) => {
    button.classList.toggle("active", button.dataset.angleDefault === settings.angleMode);
    button.addEventListener("click", () => {
      const next = { ...getSettings(), angleMode: button.dataset.angleDefault };
      saveSettings(next);
      document.querySelectorAll("[data-angle-default]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
    });
  });

  document.querySelectorAll("[data-setting-toggle]").forEach((button) => {
    const key = button.dataset.settingToggle;
    button.classList.toggle("active", Boolean(settings[key]));
    button.addEventListener("click", () => {
      const next = { ...getSettings(), [key]: !getSettings()[key] };
      saveSettings(next);
      button.classList.toggle("active", Boolean(next[key]));
    });
  });

  blurInput.addEventListener("input", () => {
    const next = { ...getSettings(), blurStrength: Number(blurInput.value) };
    saveSettings(next);
    blurReadout.textContent = `${next.blurStrength}px blur`;
  });

  precisionInput.addEventListener("input", () => {
    const next = { ...getSettings(), precisionDigits: Number(precisionInput.value) };
    saveSettings(next);
    precisionReadout.textContent = `${next.precisionDigits} decimal places`;
  });
}

function initProfilePage() {
  if (document.body.dataset.page !== "profile") {
    return;
  }

  const profile = getProfile();
  const form = document.querySelector("[data-profile-form]");
  const nameNode = document.querySelector("[data-profile-name]");
  const roleNode = document.querySelector("[data-profile-role]");
  const initialsNode = document.querySelector("[data-profile-initials]");
  const saveButton = document.querySelector("[data-profile-save]");

  const fill = (value) => {
    form.elements.name.value = value.name;
    form.elements.email.value = value.email;
    form.elements.role.value = value.role;
    form.elements.bio.value = value.bio;
    nameNode.textContent = value.name;
    roleNode.textContent = value.role;
    initialsNode.textContent = value.name
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("");
  };

  saveButton.addEventListener("click", () => {
    const nextProfile = {
      name: form.elements.name.value.trim() || DEFAULT_PROFILE.name,
      email: form.elements.email.value.trim() || DEFAULT_PROFILE.email,
      role: form.elements.role.value.trim() || DEFAULT_PROFILE.role,
      bio: form.elements.bio.value.trim() || DEFAULT_PROFILE.bio,
    };
    saveProfile(nextProfile);
    fill(nextProfile);
  });

  fill(profile);
}

function renderSharedPreviews() {
  const history = getHistory();
  renderPreview(
    document.querySelector("[data-activity-preview]"),
    history.slice(0, 3),
    "Your recent calculations will appear here."
  );
  renderPreview(
    document.querySelector("[data-scientific-preview]"),
    history.filter((entry) => entry.page === "scientific").slice(0, 3),
    "Scientific results will appear here."
  );
  renderPreview(
    document.querySelector("[data-converter-preview]"),
    history.filter((entry) => entry.page === "converter").slice(0, 3),
    "Saved conversions will appear here."
  );
}

function bindGlobalActions() {
  document.querySelectorAll("[data-export-data]").forEach((button) => {
    button.addEventListener("click", downloadData);
  });
  document.querySelectorAll("[data-reset-app]").forEach((button) => {
    button.addEventListener("click", resetAppData);
  });
}

applySettings();
renderSharedStats();
bindGlobalActions();
initStandardCalculator();
initScientificCalculator();
initConverter();
initHistoryPage();
initSettingsPage();
initProfilePage();
renderSharedPreviews();
