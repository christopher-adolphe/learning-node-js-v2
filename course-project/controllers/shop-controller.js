const Product = require('../models/product');
const Cart = require('../models/cart');

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
  const productId = request.params.id;
  const getProduct = (product) => {
    response.render('shop/product-details', {
      pageTitle: 'Product Details',
      slug: 'products',
      product,
    });
  };

  Product.findById(productId, getProduct);
};

const getCart = (request, response) => {
  const getCartData = (cart) => {
    Product.fetchAll((products) => {
      const cartItems = [];

      products.forEach(product => {
        const item = cart.items.find(item => item.id === product.id);

        if (item) {
          cartItems.push({ product, quantity: item.quantity });
        }
      });

      response.render('shop/cart', {
        pageTitle: 'My Cart',
        slug: 'cart',
        cartItems,
      });
    });
  };

  Cart.getCart(getCartData);
};

const postCart = (request, response) => {
  const { productId } = request.body;

  Product.findById(productId, (product) => {
    console.log('postCart: ', product);
    Cart.addItem(productId, product.price);
  });

  response.redirect('/cart');
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
  postCart,
  getOrders,
  getCheckout
};
