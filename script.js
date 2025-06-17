
console.log("1");

let operand1 = '0';
let operand2 = '';
let operator = '';

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
    case '%':
      return a % b;
  }
}

const clearAll = () => {
  operand1 = '0';
  operand2 = '';
  operator = '';
  main.forEach(x => x.textContent = '');
  main[0].textContent = '0';
  sub.textContent = '-';
};

const applyOperandRules = (num, value) => {
  // cannot pad zeroes
  if (value === '0' && num === '0') return num;

  // a decimal can succeed a zero
  if (num === '0' && value !== '.') num = '';

  // cannot have more than one decimal
  if (num.includes('.') && value == '.') return num;

  return num += value;
}

const applyOperatorRules = (op, value, num1, num2) => {
  // cannot be equal if there's no second operand
  if (value === '=' && num2 === '') return '';
  return value;
}

const requiresFloat = (a, b, op) => {
  return a.includes('.') || b.includes('.') || op === '/';
};

const convert = (a, b, op) => {
  if (requiresFloat(a, b, op)) {
    return [parseFloat(a), parseFloat(b)];
  }
  return [parseInt(a), parseInt(b)];
};

const nb = document.querySelector('.number-buttons');
const ob = document.querySelector('.operator-buttons');
const sb = document.querySelector('.special-buttons');
const main = document.querySelectorAll('#main span');
const sub = document.querySelector('#sub');

nb.addEventListener('click', (e) => {
  // prevent clicking between the buttons
  if (!e.target.matches('button')) return;

  const value = e.target.textContent;

  if (operator !== '') {
    operand2 = applyOperandRules(operand2, value);
    main[2].textContent = operand2;
    return;
  }

  operand1 = applyOperandRules(operand1, value);
  main[0].textContent = operand1;
});

ob.addEventListener('click', (e) => {
  // prevent clicking between the buttons
  if (!e.target.matches('button') || main[0].textContent === 'Undefined') return;

  const value = e.target.textContent;

  if (operator !== '' && operand2 !== '') {
    // results
    sub.textContent = main[0].textContent + main[1].textContent + main[2].textContent;
    [operand1, operand2] = convert(operand1, operand2, operator);
    let result = operate(operator, operand1, operand2);

    // clear
    main.forEach(x => x.textContent = '');
    [operand2, operator] = ['', ''];

    operand1 = result.toString();

    // handle infinity case
    if (operand1 === 'Infinity' || isNaN(operand1)) {
      operand1 = '0';
      main[0].textContent = 'Undefined';
      return;
    }
    main[0].textContent = operand1;
  }

  operator = applyOperatorRules(operator, value, operand1, operand2);
  main[1].textContent = operator;
});

sb.addEventListener('click', (e) => {
  // prevent clicking between the buttons
  if (!e.target.matches('button') || main[0].textContent === 'Undefined') return;

  const value = e.target.textContent;
  
switch(value) {
  case 'C':
    clearAll();
    break;
  case '+/-':
    break;
  case '%':
    // this is a repeat so this should be refactored
    if (operator !== '' && operand2 !== '') {
      // results
      sub.textContent = main[0].textContent + main[1].textContent + main[2].textContent;
      [operand1, operand2] = convert(operand1, operand2, operator);
      let result = operate(operator, operand1, operand2);

      // clear
      main.forEach(x => x.textContent = '');
      [operand2, operator] = ['', ''];

      operand1 = result.toString();

      // handle infinity case
      if (operand1 === 'Infinity' || isNaN(operand1)) {
        operand1 = '0';
        main[0].textContent = 'Undefined';
        return;
      }
      main[0].textContent = operand1;
    }
    operator = applyOperatorRules(operator, value, operand1, operand2);
    main[1].textContent = operator;
    break;
}
});