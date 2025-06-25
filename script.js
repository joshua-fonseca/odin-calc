let inputBuffer = '0';
// let inputBuffer = '12309812398201083912';
let firstOperand = null;
let operator = null;  
let isResultDisplayed = false;
let awaitingNegativeSecond = false;
let hasDecimal = false;
let savedOperator = null;
let savedfirstOperand = null;
let savedsecondOperand = null;

// on start
const result = document.querySelector('#main');
result.textContent = inputBuffer;

function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) { return b === 0 ? 'Undefined' : a / b; }
function modulo(a, b) { return b === 0 ? 'Undefined' : a % b; }

function operate(operator, a, b) {
  console.log(a, operator, b);
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
  if (value === 'AC') {
    btn.dataset.type = 'clear';
  } else if (value === '<[x]') {
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

  if (value !== '=' && type === 'operator') isResultDisplayed = false;

  switch (type) {
    case 'digit': handleDigit(value); break;
    case 'operator': handleOperator(value); break;
    case 'clear': handleClear(); break;
    case 'backspace': handleBackspace(); break;
    case 'equals': handleEquals(); break;
    case 'decimal': handleDecimal(); break;
    case 'sign': toggleSign(); break;
    case 'help': showHelp(); break;
  }

    // clear or backspace
    if ((result.textContent.length > 1 || result.textContent !== '0') && !isResultDisplayed && inputBuffer !== 'Undefined') {
      clr.dataset.type = 'backspace';
      clr.textContent = '<[x]'
    } else {
      clr.dataset.type = 'clear';
      clr.textContent = 'AC'
    }
});

// helper
const baseSize = 4;
const minSize = 1.25;
function updateDisplay() {
  if (operator && firstOperand !== null) {
    result.textContent = `${firstOperand}${operator}${inputBuffer}`;
  } else {
    result.textContent = inputBuffer;
  }
  // dynamic font size based on length
  const length = result.textContent.length;
  let size = baseSize;

  if (length > 8) {
    size = baseSize * (8 / length); // scale down after 8 chars
    size = Math.max(size, minSize);  // prevent going too small
  }

  result.style.fontSize = `${size}rem`;
}

// core
function handleDigit(value) {
  if (isResultDisplayed) {
    handleClear();
  }
  
  if (inputBuffer === '0') {
    inputBuffer = value;
  } else {
    inputBuffer += value;
  }

  if (operator !== null && inputBuffer !== '') {
    awaitingNegativeSecond = false;
  }

  updateDisplay();
}

function handleOperator(value) {
  if ((inputBuffer === '-' || inputBuffer === 'Undefined') && operator === null) return;

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
    // as long as the press is NOT a subtract AND not when the second is being typed
  } else if (isNaN(inputBuffer)) {
    if (value === '-') return;
    operator = value;
    inputBuffer = '';
    awaitingNegativeSecond = true;
    // this else is for when a full expression is present and an operator is pressed
    // behaviour would be to calculate existing and chain
  } else {
    handleEquals(value);
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
  sub.textContent = '';
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
function handleEquals(arg = null) {
  if ((operator === null || (operator !== null && inputBuffer === '')) && !isResultDisplayed) return;

  if (isResultDisplayed) {
    isResultDisplayed = false;
    operator = savedOperator;
    firstOperand = inputBuffer;
    inputBuffer = secondOperand;
    handleEquals();
    return;
  } else {
    secondOperand = inputBuffer;
    sub.textContent = `${firstOperand}${operator}${secondOperand}`;
    
    let result = operate(operator, cleanInput(firstOperand), cleanInput(secondOperand));
    savedFirstOperand = firstOperand;
    savedOperator = operator;
    savedSecondOperand = secondOperand;

    handleClear();
    inputBuffer = String(result);
  }

  if (arg !== null) {
    handleOperator(arg);
  } else {
      isResultDisplayed = true;
  }

  sub.textContent = `${savedFirstOperand}${savedOperator}${savedSecondOperand}`

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
  if (inputBuffer === '' ||  inputBuffer === '0' || inputBuffer === '-' || inputBuffer === 'Undefined') return;

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

function showHelp() {
  alert("iOS calculator replica\n\nKeyboard controls:\n- 0-9 for digits\n- + - / * % for operators\n- = or Enter for equals\n- Backspace or Escape for clear\n- ? for help (This menu)\n- Spacebar or shift for toggle sign '+/-'\n\nMissing features:\n- Backspace on brackets\n- Chaining operations\n- % as a percent calculator\n- Scrollable result line when number is too big\n\nTODO:\n- Fix number overflow\n- Add touch support");
}

// keyboard input
const nums = '0123456789';
const ops = '+-/*%';
document.addEventListener('keydown', (e) => {
  if (nums.includes(e.key)) {
    handleDigit(e.key);
  } else if (ops.includes(e.key)) {
    handleOperator(e.key);
  } else if (e.key === '.') {
    handleDecimal()
  } else if (e.key === '=' || e.key === 'Enter') {
    handleEquals();
  } else if (e.key === 'Backspace' || e.key === 'Escape') {
    handleClear();
  } else if (e.key === '?') {
    showHelp();
  } else if (e.key === ' ' || e.key === 'Shift') {
    toggleSign();
  } else {
    console.log("unrecognized input!");
  } 
});