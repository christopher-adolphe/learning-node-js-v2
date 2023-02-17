const fs = require('fs');
const path = require('path');

const Product = require('../models/product');
const Order = require('../models/order');

const getShop = (request, response) => {
  response.render('shop/index', {
    pageTitle: 'Welcome',
    slug: 'shop',
  });
};

const getProductList = async (request, response) => {
  let products = [];
  
  try {
    products = await Product.find();

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
    const userCart = await user.populate('cart.productId');
    
    cartItems = userCart.cart;

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
    await user.addToCart(productId);

    response.redirect('/products');
  } catch(error) {
    console.log(`Sorry, an error occurred while saving item to cart: ${error.message}`);

    // response.redirect('shop/index');
    const failure = new Error(error);

    failure.httpStatusCode = 500;

    return next(failure);
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

    // response.redirect('shop/index');
    const failure = new Error(error);

    failure.httpStatusCode = 500;

    return next(failure);
  }
};

const postOrder = async (request, response) => {
  const { user } = request;

  try {
    const userCart = await user.populate('cart.productId');
    const order = new Order({
      items: userCart.cart.map(cartItem => ({
        /**
         * Using the `_doc` property to extract all the
         * fields for product from the `productId` field
         * stored in the `cart` field of the `User` model
        */
        product: { ...cartItem.productId._doc },
        quantity: cartItem.quantity,
      })),
      userId: user._id,
    });

    await order.save();
    await user.clearCart();

    response.redirect('/orders');
  } catch (error) {
    console.log(`Sorry, an error occurred while creating order: ${error.message}`);

    // response.redirect('/cart');
    const failure = new Error(error);

    failure.httpStatusCode = 500;

    return next(failure);
  }
};

const getOrders = async (request, response) => {
  const { user } = request;

  try {
    const orders = await Order.find({ 'userId': user._id });

    response.render('shop/orders', {
      pageTitle: 'My Orders',
      slug: 'orders',
      orders,
    });
  } catch (error) {
    console.log(`Sorry, an error occurred while fetching orders: ${error.message}`);

    // response.redirect('/cart');
    const failure = new Error(error);

    failure.httpStatusCode = 500;

    return next(failure);
  }
};

const getOrderInvoice = async (request, response, next) => {
  const user = request.user;
  const orderId = request.params.orderId;
  const invoiceFile = `invoice-${orderId}.pdf`;
  /*
  * Using Node.js `path` module to contruct the
  * to the invoice file
  */
  const invoicePath = path.join('data', 'invoices', invoiceFile);

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return next(new Error(`Sorry, no order found with id: ${orderId}`));
    }

    if (order.userId.toString() !== user._id.toString()) {
      return next(new Error(`Sorry, you are not authorized to view order with id: ${orderId}`));
    }

    /*
    * Using Node.js `fs` module to read the invoice
    * file from the path we constructed above
    */
    fs.readFile(invoicePath, (error, data) => {
      if (error) {
        return next(error);
      }

      response.setHeader('Content-Type', 'application/pdf');
      /**
       * If we set the response header `Content-Disposition` to
       * `attachment`, the user will be prompted to choose a
       * destination folder to save he/she wants to download
       * If set to `inline`, the file will open in the browser
       * itself
      */
      // response.setHeader('Content-Disposition', `attachment; filename=${invoiceFile}`);
      response.setHeader('Content-Disposition', `inline; filename=${invoiceFile}`);

      response.send(data);
    });
  } catch (error) {
    next(error);
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
  getOrderInvoice,
  getCheckout,
  deleteCartItem
};
