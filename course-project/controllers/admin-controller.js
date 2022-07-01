const getProducts = (request, response) => {
  response.render('admin/view-products', {
    pageTitle: 'View Products',
    slug: 'view-products',
  });
};

const getProduct = (request, response) => {
  // NOT IMPLEMENTED
};

const editProduct = (request, response) => {
  // NOT IMPLEMENTED
};

const updateProduct = (request, response) => {
  // NOT IMPLEMENTED
};

const deleteProduct = (request, response) => {
  // NOT IMPLEMENTED
};

module.exports = {
  getProducts,
  getProduct,
  editProduct,
  updateProduct,
  deleteProduct,
};
