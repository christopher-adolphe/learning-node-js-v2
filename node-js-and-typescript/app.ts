const num1Elem = document.getElementById('num1')! as HTMLInputElement;
const num2Elem = document.getElementById('num2')! as HTMLInputElement;
const btnElem = document.querySelector('button')!;
const paragraphElem = document.querySelector('p');

const resultList: number[] = [];
// const resultList: Array<number> = [];

type NumOrString = number | string;

type Result = {
  val: number;
  timestamp: Date;
};

interface ResultObj {
  val: number;
  timestamp: Date;
}

function add(num1: number, num2: number): number {
  return num1 + num2;
}

function printVal(resultObj: Result) {
  console.log(resultObj.val);
}

btnElem.addEventListener('click', () => {
  const result = add(+num1Elem.value, +num2Elem.value);

  resultList.push(result);

  console.log('result: ', result);

  console.log('resultList: ', resultList);

  printVal({ val: result, timestamp: new Date() });
});

const myPromise = new Promise<string>((resolve, reject) => {
  setTimeout(() => {
    resolve('Promise is resolved!!');
  }, 1500);
});

myPromise.then(result => {
  console.log('Result: ', result);
});
