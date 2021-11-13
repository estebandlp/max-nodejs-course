const num1Element = document.getElementById("num1") as HTMLInputElement;
const num2Element = document.getElementById("num2") as HTMLInputElement;
const buttonElement = document.querySelector("button")!;

const numberResults: Array<number> = [];
const textResults: string[] = [];

type NumberOrString = number | string;
type Result = { val: number; timestamp: Date };

interface ResultObj {
  val: number;
  timestamp: Date;
}

function add(num1: NumberOrString, num2: NumberOrString) {
  if (typeof num1 === "number" && num2 === "number") return num1 + num2;
  if (typeof num1 === "string" && num2 === "string")
    return num1 + " Hi " + num2;

  return +num1 + +num2;
}

function printResult(resultObj: Result) {
  console.log(resultObj.val);
}

buttonElement.addEventListener("click", () => {
  const num1 = num1Element.value;
  const num2 = num2Element.value;
  const numberResult = add(+num1, +num2);
  const stringResult = add(num1, num2);

  numberResults.push(numberResult as number);
  textResults.push(stringResult as string);

  console.log(numberResult);
  console.log(stringResult);

  printResult({ val: numberResult as number, timestamp: new Date() });
  console.log(numberResults, textResults);
});

const myPromise = new Promise<String>((resolve, reject) => {
  setTimeout(() => {
    resolve("It worked!");
  }, 2000);
});

myPromise.then((result) => {
  console.log(result.split("w"));
});
