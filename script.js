
console.log("1");

let inputBuffer = "";
let firstOperand = null;
let operator = null;  
let secondOperand = null;
let isResultDisplayed = false;
let awaitingNegativeSecond = false;
let hasDecimal = false;

function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) { return b === 0 ? "Error" : a / b; }

function operate(operator, a, b) {
  switch(operator) {
    case '+': return add(a, b);
    case '-': return subtract(a, b);
    case '*': return multiply(a, b);
    case '÷': return divide(a, b);
  }
}