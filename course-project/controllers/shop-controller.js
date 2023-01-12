const Product = require('../models/product');

const getShop = (request, response) => {
  // const getAllProducts = (products) => {
  //   response.render('shop/index', {
  //     pageTitle: 'Welcome',
  //     slug: 'shop',
  //   });
  // };

  // Product.fetchAll(getAllProducts);
  response.render('shop/index', {
    pageTitle: 'Welcome',
    slug: 'shop',
  });
};

const getProductList = async (request, response) => {
  let products = [];
  
  try {
    products = await Product.fetchAll();;

    response.render('shop/product-list', {
      pageTitle: 'Product List',
      slug: 'products',
      hasProducts: products.length,
      products,
    });
  } catch (error) {
    console.log(`Sorry, an error occurred while fetching products: ${error.message}`);

    response
      .status(500)
      .render('shop/product-list', {
        pageTitle: 'Product List',
        slug: 'products',
        hasProducts: products.length,
        products,
    });
  }
};

const getProductDetails = async (request, response) => {
  const productId = request.params.id;
  // const getProduct = (product) => {
  //   response.render('shop/product-details', {
  //     pageTitle: 'Product Details',
  //     slug: 'products',
  //     product,
  //   });
  // };

  // Product.findById(productId, getProduct);
  let product = null;

  try {
    product = await Product.findById(productId);

    response.render('shop/product-details', {
      pageTitle: 'Product Details',
      slug: 'products',
      product,
    });
  } catch (error) {
    console.log(`Sorry, an error occurred while fetching product: ${error.message}`);

    response
      .status(500)
      .render('shop/product-details', {
        pageTitle: 'Product Details',
        slug: 'products',
        product,
      });
  }
};

const getCart = async (request, response) => {
  const { user } = request;
  let cartItems = [];

  try {
    cartItems = await user.getCart();

    response.render('shop/cart', {
      pageTitle: 'My Cart',
      slug: 'cart',
      cartItems,
    });
  } catch (error) {
    console.log(`Sorry, an error occurred while fetching cart: ${error.message}`);

    response
      .status(500)
      .render('shop/cart', {
        pageTitle: 'My Cart',
        slug: 'cart',
        cartItems,
      });
  }
};

const postCart = async (request, response) => {
  const { user } = request;
  const { productId } = request.body;

  try {
    const addToCartResult = await user.addToCart(productId);

    response.redirect('/products');
  } catch(error) {
    console.log(`Sorry, an error occurred while saving item to cart: ${error.message}`);

    response.redirect('shop/index');
  }
};

const deleteCartItem = async (request, response) => {
  const { user } = request;
  const { productId } = request.body;

  try {
    await user.removeFromCart(productId);

    response.redirect('/cart');
  } catch (error) {
    console.log(`Sorry, an error occurred while deleting item from cart: ${error.message}`);

    response.redirect('shop/index');
  }
};

const postOrder = async (request, response) => {
  const { user } = request;

  try {
    await user.createOrder();

    response.redirect('/orders');
  } catch (error) {
    console.log(`Sorry, an error occurred while creating order: ${error.message}`);

    response.redirect('/cart');
  }
};

const getOrders = async (request, response) => {
  const { user } = request;

  try {
    const orders = await user.getOrders();

    response.render('shop/orders', {
      pageTitle: 'My Orders',
      slug: 'orders',
      orders,
    });
  } catch (error) {
    console.log(`Sorry, an error occurred while fetching orders: ${error.message}`);

    response.redirect('/cart');
  }
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
  postOrder,
  getOrders,
  getCheckout,
  deleteCartItem
};
