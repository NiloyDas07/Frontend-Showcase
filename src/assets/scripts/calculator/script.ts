if (typeof window !== "undefined") {
  const display = document.getElementById("display")!;
  let expression = "";
  let decimalAllowed = true;

  const updateDisplay = (value: string) => {
    display.textContent = value || "0";
  };

  const appendNumber = (num: string) => {
    expression += num;
    updateDisplay(expression);
  };

  const appendDecimal = () => {
    if (!decimalAllowed) return;
    if (expression === "" || /[+\-×÷*\/]$/.test(expression)) {
      expression += "0";
    }
    expression += ".";
    decimalAllowed = false;
    updateDisplay(expression);
  };

  type Operator = "+" | "-" | "×" | "÷" | "*" | "/";
  const chooseOperator = (op: Operator) => {
    if (!expression) return;
    // replace trailing operator
    if (/[+\-×÷*\/]$/.test(expression)) {
      expression = expression.slice(0, -1);
    }
    expression = compute(expression);
    expression += op;
    decimalAllowed = true;
    updateDisplay(expression);
  };

  const compute = (expr: string): string => {
    // replace ×,÷ with * and /
    const safeExpr = expr.replace(/×/g, "*").replace(/÷/g, "/");
    try {
      return Function(`"use strict"; return (${safeExpr})`)().toString();
    } catch {
      return "";
    }
  };

  const clearAll = () => {
    expression = "";
    decimalAllowed = true;
    updateDisplay("");
  };

  const calculate = () => {
    if (!expression) return;
    if (/[+\-×÷*\/]$/.test(expression)) {
      expression = expression.slice(0, -1);
    }
    expression = compute(expression);
    decimalAllowed = !expression.includes(".");
    updateDisplay(expression);
  };

  // Event delegation for button clicks
  const buttonContainer = document.querySelector(".buttons");
  if (buttonContainer) {
    buttonContainer.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (!target.matches("button")) return;

      const btn = target as HTMLButtonElement;

      if (btn.dataset.number) {
        appendNumber(btn.dataset.number);
      } else if (btn.dataset.operator) {
        chooseOperator(btn.dataset.operator as Operator);
      } else if (btn.dataset.action === "decimal") {
        appendDecimal();
      } else if (btn.dataset.action === "clear") {
        clearAll();
      } else if (btn.dataset.action === "equals") {
        calculate();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    const { key } = e;

    // Digits 0–9
    if (/^[0-9]$/.test(key)) {
      appendNumber(key);
      return;
    }

    // Operators
    if (key === "+" || key === "-" || key === "*" || key === "/") {
      // Map slash to ÷, asterisk to ×
      chooseOperator(key === "*" ? "×" : key === "/" ? "÷" : (key as Operator));
      return;
    }

    // Decimal point
    if (key === "." || key === ",") {
      appendDecimal();
      return;
    }

    // Enter or = for equals
    if (key === "Enter" || key === "=") {
      e.preventDefault();
      calculate();
      return;
    }

    // Backspace or Escape or c/C for clear
    if (key === "Backspace" || key === "Escape" || key.toLowerCase() === "c") {
      clearAll();
      return;
    }
  });
}
