const getShop = (request, response) => {
  response.render('shop/index', {
    pageTitle: 'Welcome',
    slug: 'shop',
  })
};

const getProductList = (request, response) => {
  response.render('shop/product-list', {
    pageTitle: 'Product List',
    slug: 'products',
  });
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
  getCheckout
};
