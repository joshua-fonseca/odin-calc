let inputBuffer = '0';
let firstOperand = null;
let operator = null;  
let isResultDisplayed = false;
let awaitingNegativeSecond = false;
let hasDecimal = false;

// on start
const result = document.querySelector('#main');
result.textContent = inputBuffer;

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
  if (value === 'C') {
    btn.dataset.type = 'clear';
  } else if (value === 'AC') {
    btn.dataset.type = 'backspace';
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

const clr = document.querySelectorAll('.light-grey-buttons button')[0];
document.querySelector('.buttons').addEventListener('click', (e) => {
  if (e.target.tagName !== 'BUTTON') return;

  const type = e.target.dataset.type;
  const value = e.target.textContent;
  console.log(type, value);

  switch (type) {
    case 'digit': handleDigit(value); break;
    case 'operator': handleOperator(value); break;
    case 'clear': handleClear(); break;
    case 'backspace': handleBackspace(); break;
    case 'equals': handleEquals(); break;
    case 'decimal': handleDecimal(); break;
    case 'sign': toggleSign(); break;
  }

    // clear or backspace
    if (result.textContent.length > 1 || result.textContent !== '0') {
      clr.dataset.type = 'backspace';
      clr.textContent = 'AC'
    } else {
      clr.dataset.type = 'clear';
      clr.textContent = 'C'
    }
});

// helper
function updateDisplay() {
  if (operator && firstOperand !== null && !isResultDisplayed) {
    result.textContent = `${firstOperand}${operator}${inputBuffer}`;
  } else {
    result.textContent = inputBuffer;
  }
}

// core
function handleDigit(value) {
  if (inputBuffer === '0') {
    inputBuffer = value;
  } else {
    inputBuffer += value;
  }

  updateDisplay();
}

function handleOperator(value) {
  if (inputBuffer === '-') return;

  // when operator does not exist
  if (operator === null && inputBuffer === '0' && value === '-') {
      inputBuffer = '-';
  // when operator does not exist
  } else if (operator === null) {
    firstOperand = inputBuffer;
    inputBuffer = '';
    awaitingNegativeSecond = true;
    operator = value;
    hasDecimal = false; // reset if operand 1 has decimal
  } else if (awaitingNegativeSecond) {
    if (operator !== '+' && operator !== '-' && value === '-' && inputBuffer === '') {
      inputBuffer += '-';
      awaitingNegativeSecond = false;
      // if operator exists, replace it
    } else {
        operator = value;
        inputBuffer = '';
    }
    // in the case that someone presses operator again despite having an operator + '-' in inputBuffer
  } else {
    operator = value;
    inputBuffer = '';
    awaitingNegativeSecond = true;
  }
  updateDisplay();
}

function handleClear() {
  inputBuffer = '0';
  firstOperand = null;
  operator = null;  
  isResultDisplayed = false;
  awaitingNegativeSecond = false;
  hasDecimal = false;
  updateDisplay();
}

function handleBackspace() {
  let len = inputBuffer.length;

  // when wanting to delete the first digit of second operand
  if (len === 1 && firstOperand !== null) {
    inputBuffer = '';
    // in the case the first digit is '-'
    awaitingNegativeSecond = true;
  // when wanting to delete the first digit of first operand
  } else if (len === 1) {
    inputBuffer = '0';
  // when wanting to delete the operator
  } else if(inputBuffer === '') {
    operator = null;
    inputBuffer = firstOperand;
    firstOperand = null;
    awaitingNegativeSecond = false;
  // when wanting to delete a bracket -> this is not native to iOS but... it's complicated
  } else if (inputBuffer.startsWith('(-')) {
    toggleSign();
  }  else {
    if (inputBuffer.endsWith('.')) hasDecimal = false;
    inputBuffer = inputBuffer.slice(0, len-1);
  }
  updateDisplay();
}

const sub = document.querySelector('#sub');
function handleEquals() {
  secondOperand = inputBuffer;
  sub.textContent = `${firstOperand}${operator}${secondOperand}`;
  
  let result = operate(operator, cleanInput(firstOperand), cleanInput(secondOperand));
  handleClear();
  inputBuffer = String(result);
  updateDisplay();
}

function cleanInput(operand) {
  return operand.includes('.') ?
    parseFloat(operand.replace('(','').replace(')','')) :
    parseInt(operand.replace('(','').replace(')',''))
}

function handleDecimal() {
  if (hasDecimal) return;

  if (inputBuffer === '') inputBuffer = '0';

  inputBuffer += '.';
  hasDecimal = true;

  updateDisplay();
}

function toggleSign() {
  if (inputBuffer === '' ||  inputBuffer === '0' || inputBuffer === '-') return;

  if (inputBuffer.startsWith('(-') && inputBuffer.endsWith(')')) {
    inputBuffer = inputBuffer.slice(2, -1);
  } else if (inputBuffer.startsWith('-') && operator !== null && isNaN(inputBuffer)) {
    return;
  } else if (inputBuffer.startsWith('-') && operator !== null && !isNaN(inputBuffer)) {
    inputBuffer = inputBuffer.slice(1);
  } else {
    inputBuffer = `(-${inputBuffer})`;
  }

  updateDisplay();
}

