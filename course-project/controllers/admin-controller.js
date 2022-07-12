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
    isEditMode: false
  });
};

const createProduct = (request, response) => {
  const { title, imgUrl, description, price } = request.body;

  if (title.trim() !== '' || imgUrl.trim() !== '' || description.trim() !== '' || price.trim() !== '') {
    const product = new Product(null, title, imgUrl, description, price);

    product.save();
  }

  response.redirect('/');
};

const editProduct = (request, response) => {
  const isEditMode =  request.query.edit;
  const productId = request.params.id;

  if (!isEditMode) {
    return response.redirect('/admin/products');
  }

  Product.findById(productId, (product) => {
    if (!product) {
      return response.redirect('/');
    }

    response.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      slug: 'edit-product',
      isEditMode: !!isEditMode,
      product
    });
  });
};

const updateProduct = (request, response) => {
  const { productId, title, imgUrl, description, price } = request.body;

  if (title.trim() !== '' || imgUrl.trim() !== '' || description.trim() !== '' || price.trim() !== '') {
    const updatedProduct = new Product(productId, title, imgUrl, description, price);

    updatedProduct.save();
  }

  response.redirect('/admin/products');
};

const deleteProduct = (request, response) => {
  const { productId } = request.body;

  Product.delete(productId);

  response.redirect('/admin/products');
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
