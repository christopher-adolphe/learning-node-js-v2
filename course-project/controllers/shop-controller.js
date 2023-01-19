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

    response.redirect('/cart');
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
