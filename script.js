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
const carSounds = ["q", "w", "e", "r", "t", "y", "u", "i"];

let currentValue = "";
let lastValue = "";
let answer = "0";
let lastOperator = "";
let calculating = false;

function random(n) {
  return Math.floor(Math.random() * n);
}

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
  if (result.toString().length > 10) return Number(result).toExponential(1);
  return result;
}

function updateScreen(num1, op, num2, ans, eq = "") {
  if (num1 === "0.") num1 = "0";
  if (num2 === "0.") num2 = "0";
  topScreen.textContent = `${num1} ${op} ${num2} ${eq}`;
  mainScreen.textContent = `${ans}`;
}

function clear() {
  currentValue = "";
  lastValue = "";
  lastOperator = "";
  answer = "0";
  calculating = false;
  updateScreen("", "", "", answer);
}

function checkError(result) {
  if (result === "Undefined") {
    clear();
    updateScreen("You cannot divided by zero !", "", "", "");
    playSound(carSounds[random(carSounds.length)]);
  }
}

function getNumber(number) {
  if (currentValue === "0") currentValue = "";
  if (topScreen.textContent.includes("=")) clear();
  if (currentValue.length <= 9) currentValue += number;
  updateScreen(lastValue, lastOperator, "", currentValue);
}

function setOperation(operator) {
  if (!calculating) {
    if (lastValue === "" && currentValue === "") {
      lastValue = "0";
    } else {
      lastValue = currentValue;
      currentValue = "";
    }
    calculating = true;
  }
  if (topScreen.textContent.includes("=")) currentValue = "";
  if (calculating && currentValue !== "") {
    lastValue = operate(lastValue, lastValue, currentValue);
    currentValue = "";
  }
  updateScreen(lastValue, operator, "", lastValue);
  lastOperator = operator;
  checkError(lastValue);
}

function evaluate() {
  if (lastValue === "" && currentValue === "") return;
  if (calculating) {
    if (currentValue === "") currentValue = lastValue;
    answer = operate(lastOperator, lastValue, currentValue);
    updateScreen(lastValue, lastOperator, currentValue, answer, "=");
    lastValue = answer;
  }
  checkError(lastValue);
}

function negate() {
  mainScreen.textContent *= -1;
  currentValue = mainScreen.textContent;
}

function addDecimal() {
  if (!currentValue.toString().includes(".")) mainScreen.textContent += ".";
  if (currentValue === "") mainScreen.textContent = "0.";
  currentValue = mainScreen.textContent;
}

function undo() {
  mainScreen.textContent = mainScreen.textContent.slice(0, -1);
  currentValue = mainScreen.textContent;
  if (mainScreen.textContent === "") {
    currentValue = "";
    mainScreen.textContent = "0";
  }
}

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

function findKey(e) {
  let button = document.querySelector(`button[value="${e.key}"]`);
  if (button === null) button = keys;
  return button;
}

function getKey(e) {
  if (e.key !== "Enter") return findKey(e);
  return document.querySelector(`button[value="="]`);
}

window.addEventListener("DOMContentLoaded", clear);
numberKeys.forEach((numberKey) =>
  numberKey.addEventListener("click", () => {
    getNumber(numberKey.value);
  })
);
operatorKeys.forEach((operatorKey) =>
  operatorKey.addEventListener("click", () => {
    setOperation(operatorKey.textContent);
  })
);
equalKey.addEventListener("click", evaluate);
decimalKey.addEventListener("click", addDecimal);
undoKey.addEventListener("click", undo);
signKey.addEventListener("click", negate);
clearKey.addEventListener("click", clear);
carKey.addEventListener("click", () => {
  playSound(carSounds[random(carSounds.length)]);
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Delete") deleteValue();
  if (getKey(e).value !== "=") getKey(e).click();
  getKey(e).focus();
  playSound(e.key);
});
window.addEventListener("mouseup", (e) => {
  e.target.blur();
});
window.addEventListener("keyup", (e) => {
  e.target.blur();
});
