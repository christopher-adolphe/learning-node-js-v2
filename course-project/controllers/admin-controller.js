const getProducts = (request, response) => {
  response.render('admin/view-products', {
    pageTitle: 'View Products',
    slug: 'view-products',
  });
};

const getProduct = (request, response) => {
  // NOT IMPLEMENTED
  response.render('admin/view-product', {
    pageTitle: 'Product details',
    slug: 'view-products',
  });
};

const addProduct = (request, response) => {
  // NOT IMPLEMENTED
  response.render('admin/add-product', {
    pageTitle: 'Add Product',
    slug: 'add-product',
  });
};

const createProduct = (request, response) => {
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
  addProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
