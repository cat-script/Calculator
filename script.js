const keys = document.querySelector(".keys");
const numberKeys = document.querySelectorAll(".number");
const operatorKeys = document.querySelectorAll(".operator");
const topScreen = document.querySelector(".top.screen");
const mainScreen = document.querySelector(".main.screen");
const undoKey = document.querySelector(".undo");
const clearKey = document.querySelector(".clear");
const equalKey = document.querySelector(".equal");
const decimalKey = document.querySelector(".decimal");
const signKey = document.querySelector(".sign");
const carKey = document.querySelector(".car");
const soundList = ["q", "w", "e", "r", "t", "y", "u", "i"];
let currentValue = "";
let lastValue = "";
let answer = "0";
let lastOperator = "";
let calculating = false;

function roundNum(num) {
  return Math.round(num * 10 ** 10) / 10 ** 10;
}
function operate(op, a, b) {
  a = Number(a);
  b = Number(b);
  let result;
  if (op === "+") result = a + b;
  if (op === "−" || op === "-") result = a - b;
  if (op === "×" || op === "*") result = a * b;
  if (op === "÷" || op === "/") {
    if (b === 0) return "Undefined";
    result = a / b;
  }
  result = roundNum(result);
  if (result.toString().length > 10) return Number(result).toExponential(2);
  return result;
}

window.addEventListener("DOMContentLoaded", () => {
  updateScreen("", "", "", answer);
});
function updateScreen(num1, op, num2, ans, eq = "") {
  if (num1 === "0.") num1 = "0";
  if (num2 === "0.") num2 = "0";
  topScreen.textContent = `${num1} ${op} ${num2} ${eq}`;
  mainScreen.textContent = `${ans}`;
}

numberKeys.forEach((numberKey) =>
  numberKey.addEventListener("click", () => {
    getNumber(numberKey.value);
  })
);
function getNumber(number) {
  checkError();
  if (currentValue.length <= 9) currentValue += number;
  updateScreen(lastValue, lastOperator, "", currentValue);
}

operatorKeys.forEach((operatorKey) =>
  operatorKey.addEventListener("click", () => {
    setOperation(operatorKey.textContent);
  })
);
function setOperation(operator) {
  checkError();
  if (!calculating) {
    if (lastValue === "" && currentValue === "") {
      lastValue = "0";
    } else {
      lastValue = currentValue;
      currentValue = "";
    }
    calculating = true;
  }
  if (calculating && currentValue !== "") {
    lastValue = operate(lastOperator, lastValue, currentValue);
    currentValue = "";
  }
  updateScreen(lastValue, operator, "", lastValue);
  lastOperator = operator;
}

clearKey.addEventListener("click", clear);
function clear() {
  currentValue = "";
  lastValue = "";
  lastOperator = "";
  answer = "0";
  calculating = false;
  updateScreen("", "", "", answer);
}

decimalKey.addEventListener("click", addDecimal);
function addDecimal() {
  if (!currentValue.toString().includes(".")) mainScreen.textContent += ".";
  if (currentValue === "") mainScreen.textContent = "0.";
  currentValue = mainScreen.textContent;
}

undoKey.addEventListener("click", undo);
function undo() {
  mainScreen.textContent = mainScreen.textContent.slice(0, -1);
  currentValue = mainScreen.textContent;
  if (mainScreen.textContent === "") {
    currentValue = "";
    mainScreen.textContent = "0";
  }
}

equalKey.addEventListener("click", evaluate);
function evaluate() {
  if (lastValue === "" && currentValue === "") return;
  if (calculating) {
    if (currentValue === "") currentValue = lastValue;
    answer = operate(lastOperator, lastValue, currentValue);
    updateScreen(lastValue, lastOperator, currentValue, answer, "=");
    lastValue = answer;
  }
}

signKey.addEventListener("click", negate);
function negate() {
  mainScreen.textContent *= -1;
  currentValue = mainScreen.textContent;
}

function checkError() {
  if (topScreen.textContent.includes("=")) currentValue = "";
  if (currentValue === "0") currentValue = "";
  if (lastValue === "Undefined") lastValue = "0";
}

const getButton = function (e) {
  if (e.key !== "Enter") return findButton(e);
  return document.querySelector(`button[value="="]`);
};

const findButton = function (e) {
  let button = document.querySelector(`button[value="${e.key}"]`);
  if (button === null) button = keys;
  return button;
};

window.addEventListener("mouseup", (e) => {
  e.target.blur();
});
window.addEventListener("keyup", (e) => {
  e.target.blur();
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Delete") deleteValue();
  if (getButton(e).value !== "=") getButton(e).click();
  getButton(e).focus();
  playSound(e.key);
});

carKey.addEventListener("click", () => {
  let n = Math.floor(Math.random() * soundList.length);
  playSound(soundList[n]);
});

function playSound(key) {
  const sound = document.querySelector(`audio[data-key="${key}"]`);
  if (!sound) return;
  sound.currentTime = 0;
  sound.volume = 0.5;
  sound.play();
}

function deleteValue() {
  currentValue = "";
  updateScreen(lastValue, lastOperator, "", "0");
}
