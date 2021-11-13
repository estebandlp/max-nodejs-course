"use strict";
const num1Element = document.getElementById("num1");
const num2Element = document.getElementById("num2");
const buttonElement = document.querySelector("button");
const numberResults = [];
const textResults = [];
function add(num1, num2) {
    if (typeof num1 === "number" && num2 === "number")
        return num1 + num2;
    if (typeof num1 === "string" && num2 === "string")
        return num1 + " Hi " + num2;
    return +num1 + +num2;
}
function printResult(resultObj) {
    console.log(resultObj.val);
}
buttonElement.addEventListener("click", () => {
    const num1 = num1Element.value;
    const num2 = num2Element.value;
    const numberResult = add(+num1, +num2);
    const stringResult = add(num1, num2);
    numberResults.push(numberResult);
    textResults.push(stringResult);
    console.log(numberResult);
    console.log(stringResult);
    printResult({ val: numberResult, timestamp: new Date() });
    console.log(numberResults, textResults);
});
const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("It worked!");
    }, 2000);
});
myPromise.then((result) => {
    console.log(result);
});
