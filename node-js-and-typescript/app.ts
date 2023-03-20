const num1Elem = document.getElementById('num1') as HTMLInputElement;
const num2Elem = document.getElementById('num2') as HTMLInputElement;
const btnElem = document.querySelector('button');
const paragraphElem = document.querySelector('p');

function add(num1: number, num2: number): number {
  return num1 + num2;
}

btnElem?.addEventListener('click', () => {
  const result = add(+num1Elem?.value, +num2Elem?.value);

  console.log('result: ', result);
});
