const formElems = document.querySelectorAll('.delete-product-form');

formElems.forEach(deleteProductForm => {
  const csrfToken = deleteProductForm.querySelector('[name=_csrf]').value;
  const productId = deleteProductForm.querySelector('[name=productId]').value;
  const deleteBtn = deleteProductForm.querySelector('.btn-delete');

  deleteBtn.addEventListener('click', async (event) => {
    const productItemElem = event.target.closest('.product-item');

    try {
      const response = await fetch(`/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'csrf-token': csrfToken,
        }
      });
      const data = await response.json();

      console.log(data);

      /**
       * Using the `remove()` method from the browser DOM API
       * to remove the `productItemElem` element from the
       * DOM
       * NOTE: The `remove()` method works on modern browsers
       * only. If support for older browsers like Internet Explorer
       * is required then we need to use the `parentNode.removeChild()`
       * method instead like below:
       * productItemElem.parentNode.removeChild(productItemElem);
      */
      productItemElem.remove();
    } catch (error) {
      console.log(error);
    }
  });
});
