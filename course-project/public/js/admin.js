const deleteBtnElems = document.querySelectorAll('.btn-delete');
const handleDeleteProduct = (event) => {
  console.log('handleDeleteProduct called...', event.target);
};

console.log('deleteBtnElems: ', deleteBtnElems);

deleteBtnElems.forEach(deleteBtn => {
  deleteBtn.addEventListener('click', handleDeleteProduct);
});
