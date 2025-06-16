console.log("1");

let operand1 = '';
let operand2 = '';
let operator = ''
let entered = '';
let decimal = false;

const add = (a, b) => {
  return a + b;
}

const subtract = (a, b) => {
  return a - b;
}

const multiply = (a, b) => {
  return a * b;
}

const divide = (a, b) => {
  return a / b;
}

const operate = (operator, a, b) => {
  switch(operator) {
    case '+':
      return add(a, b);
    case '-':
      return subtract(a, b);
    case '*':
      return multiply(a, b);
    case '/':
      return divide(a, b);
  }
}

const nb = document.querySelector('.number-buttons');
const ob = document.querySelector('.operator-buttons');

const input = document.querySelector('#input');

nb.addEventListener('click', (e) => {
  // prevent clicking between the buttons
  if(!e.target.matches('button')) return;

  // prevents entering leading zeroes
  if (e.target.textContent === '0' && entered === '') return;

  // remove the beginning zero on first number input
  if (input.textContent === '0') input.textContent = '';

  entered += e.target.textContent;
  input.textContent += e.target.textContent;
});

ob.addEventListener('click', (e) => {
  // prevent clicking between the buttons
  if (!e.target.matches('button')) return;

  // prevent spamming operators
  if (entered === '' && operand1 === '') return;

  if (operand1 === '' && e.target.textContent !== '=') {
    operand1 = entered;
    entered = '';
    operator += e.target.textContent;
    input.textContent += e.target.textContent;
  } else if (operand2 === '') {
    operand2 = entered;
    entered = '';

    operate(operator, operand1, operand2);

    switch(e.target.textContent) {
      case '=':
        break;
      case '+':
        break;
      case '-':
        break;
      case '*':
        break;
      case '/':
        break;
    }

  } else {
    console.log("error: what the sigma");
  }
});