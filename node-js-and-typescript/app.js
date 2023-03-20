var num1Elem = document.getElementById('num1');
var num2Elem = document.getElementById('num2');
var btnElem = document.querySelector('button');
var paragraphElem = document.querySelector('p');
function add(num1, num2) {
    return num1 + num2;
}
btnElem === null || btnElem === void 0 ? void 0 : btnElem.addEventListener('click', function () {
    var result = add(+(num1Elem === null || num1Elem === void 0 ? void 0 : num1Elem.value), +(num2Elem === null || num2Elem === void 0 ? void 0 : num2Elem.value));
    console.log('result: ', result);
    paragraphElem === null || paragraphElem === void 0 ? void 0 : paragraphElem.innerText = result;
});
