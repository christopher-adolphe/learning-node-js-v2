const Product = require('../models/product');

const getAddProduct = (request, response, next) => {
  response.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    isAdminPage: true,
    hasFormCSS: true,
  });
};

const postAddProduct = (request, response, next) => {
  console.log('request body: ', request.body);
  const { title } = request.body;

  if (title.trim() !== '') {
    // products.push({ title });
    // console.log('products: ', products);
    const product = new Product(title);

    product.save();
  }

  response.redirect('/');
};

const getProducts = (request, response, next) => {
  const products = Product.fetchAll();
  
  response.render('shop', {
    pageTitle: 'Shop',
    products,
    path: '/',
    isShopPage: true,
    hasProducts: products.length,
  });
};

module.exports = {
  getAddProduct,
  postAddProduct,
  getProducts,
}
