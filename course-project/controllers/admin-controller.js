const Product = require('../models/product');

const getProducts = (request, response) => {
  const getAllProducts = (products) => {
    response.render('admin/view-products', {
      pageTitle: 'View Products',
      slug: 'view-products',
      hasProducts: products.length,
      products,
    });
  };

  Product.fetchAll(getAllProducts);
};

const getProduct = (request, response) => {
  // NOT IMPLEMENTED
  response.render('admin/view-product', {
    pageTitle: 'Product details',
    slug: 'view-products',
  });
};

const addProduct = (request, response) => {
  response.render('admin/edit-product', {
    pageTitle: 'Add Product',
    slug: 'add-product',
  });
};

const createProduct = (request, response) => {
  const { title, imgUrl, description, price } = request.body;

  if (title.trim() !== '' || imgUrl.trim() !== '' || description.trim() !== '' || price.trim() !== '') {
    const product = new Product(title, imgUrl, description, price);

    product.save();
  }

  response.redirect('/');
};

const editProduct = (request, response) => {
  const isEditMode =  request.query.edit;

  if (!isEditMode) {
    return response.redirect('/');
  }

  response.render('admin/edit-product', {
    pageTitle: 'Edit Product',
    slug: 'edit-product',
    isEditMode: !!isEditMode
  });
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
  editProduct,
  updateProduct,
  deleteProduct,
};
