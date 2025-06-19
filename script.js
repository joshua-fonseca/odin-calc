let inputBuffer = '';
let firstOperand = null;
let operator = null;  
let secondOperand = null;
let isResultDisplayed = false;
let awaitingNegativeSecond = false;
let hasDecimal = false;

function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) { return b === 0 ? 'Undefined' : a / b; }
function modulo(a, b) { return b === 0 ? 'Undefined' : a % b; }

function operate(operator, a, b) {
  switch(operator) {
    case '+': return add(a, b);
    case '-': return subtract(a, b);
    case '*': return multiply(a, b);
    case '/': return divide(a, b);
    case '%': return modulo(a, b);
  }
}

// set data types
const lgb = document.querySelectorAll('.light-grey-buttons button');
lgb.forEach(btn => {
  const value = btn.textContent;
  if (value === 'AC' || value === 'C') {
    btn.dataset.type = 'clear';
  } else if (value === '+/-') {
    btn.dataset.type = 'sign';
  } else if (value === '%') {
    btn.dataset.type = 'operator';
  } else {
    btn.dataset.type = 'unknown';
  }
});

const dgb = document.querySelectorAll('.dark-grey-buttons button');
dgb.forEach(btn => {
  const value = btn.textContent;
  if (!isNaN(value)) {
    btn.dataset.type = 'digit';
  } else if (value === '.') {
    btn.dataset.type = 'decimal';
  } else if (value === '?') {
    btn.dataset.type = 'help';
  } else {
    btn.dataset.type = 'unknown';
  }
});

const ob = document.querySelectorAll('.orange-buttons button');
ob.forEach((btn) => {
  const value = btn.textContent;
  switch(value) {
    case '=':
      btn.dataset.type = 'equals';
      break;
    case '+':
    case '-':
    case '*':
    case '/':
      btn.dataset.type = 'operator';
      break;
    default:
      btn.dataset.type = 'unknown';
  }
});

document.querySelector('.buttons').addEventListener('click', (e) => {
  if (e.target.tagName !== 'BUTTON') return;

  const type = e.target.dataset.type;
  const value = e.target.textContent;
  console.log(type, value);

  switch (type) {
    case 'digit': handleDigit(value); break;
    case 'operator': handleOperator(value); break;
    case 'clear': handleClear(); break;
    case 'equals': handleEquals(); break;
    case 'decimal': handleDecimal(); break;
    case 'sign': toggleSign(); break;
  }
});

function handleDigit() {
  return;
}
function handleOperator() {
  return;
}
function handleClear() {
  return;
}
function handleEquals() {
  return;
}
function handleEquals() {
  return;
}
function handleDecimal() {
  return;
}
function toggleSign() {
  return;
}