const Product = require('../models/product');

const getShop = (request, response) => {
  const getAllProducts = (products) => {
    response.render('shop/index', {
      pageTitle: 'Welcome',
      slug: 'shop',
    });
  };

  Product.fetchAll(getAllProducts);
};

const getProductList = (request, response) => {
  const getAllProducts = (products) => {
    response.render('shop/product-list', {
      pageTitle: 'Product List',
      slug: 'products',
      hasProducts: products.length,
      products,
    });
  };

  Product.fetchAll(getAllProducts);
};

const getProductDetails = (request, response) => {
  response.render('shop/product-details', {
    pageTitle: 'Product Details',
    slug: 'products',
  });
};

const getCart = (request, response) => {
  response.render('shop/cart', {
    pageTitle: 'My Cart',
    slug: 'cart',
  });
};

const getOrders = (request, response) => {
  response.render('shop/orders', {
    pageTitle: 'My Orders',
    slug: 'orders',
  });
};

const getCheckout = (request, response) => {
  response.render('shop/checkout', {
    pageTitle: 'Checkout',
    slug: 'checkout',
  });
};

module.exports = {
  getShop,
  getProductList,
  getProductDetails,
  getCart,
  getOrders,
  getCheckout
};
