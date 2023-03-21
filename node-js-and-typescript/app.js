"use strict";
const num1Elem = document.getElementById('num1');
const num2Elem = document.getElementById('num2');
const btnElem = document.querySelector('button');
const paragraphElem = document.querySelector('p');
const resultList = [];
function add(num1, num2) {
    return num1 + num2;
}
function printVal(resultObj) {
    console.log(resultObj.val);
}
btnElem.addEventListener('click', () => {
    const result = add(+num1Elem.value, +num2Elem.value);
    resultList.push(result);
    console.log('result: ', result);
    console.log('resultList: ', resultList);
    printVal({ val: result, timestamp: new Date() });
});
const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('Promise is resolved!!');
    }, 1500);
});
myPromise.then(result => {
    console.log('Result: ', result);
});
