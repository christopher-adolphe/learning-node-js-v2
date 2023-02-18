const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');

const ITEMS_PER_PAGE = 1;

const getShop = (request, response) => {
  response.render('shop/index', {
    pageTitle: 'Welcome',
    slug: 'shop',
  });
};

const getProductList = async (request, response) => {
  const page = +request.query.page || 1;
  let products = [];
  
  try {
    /**
     * Using the `countDocuments()` method to get the
     * total number of product documents
    */
    const productCount = await Product.find().countDocuments();

    /**
     * Using the `skip()` method to offset the documents
     * per the number of items we want to display on a page
     * Using the `limit()` method to fetch only the specified
     * number of documents
    */
    products = await Product
      .find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    response.render('shop/product-list', {
      pageTitle: 'Product List',
      slug: 'products',
      hasProducts: products.length,
      products,
      hasNextPage: (ITEMS_PER_PAGE * +page) < productCount,
      hasPrevPage: page > 1,
      currPage: page,
      nextPage: page + 1,
      prevPage: page - 1,
      lastPage: Math.ceil(productCount / ITEMS_PER_PAGE),
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

    const pdfDoc = new PDFDocument();

    /*
    * Using Node.js `fs` module to read the invoice
    * file from the path we constructed above
    * This method is not suitable for large files
    */
    // fs.readFile(invoicePath, (error, data) => {
    //   if (error) {
    //     return next(error);
    //   }

    //   response.setHeader('Content-Type', 'application/pdf');
    //   /**
    //    * If we set the response header `Content-Disposition` to
    //    * `attachment`, the user will be prompted to choose a
    //    * destination folder to save he/she wants to download
    //    * If set to `inline`, the file will open in the browser
    //    * itself
    //   */
    //   // response.setHeader('Content-Disposition', `attachment; filename=${invoiceFile}`);
    //   response.setHeader('Content-Disposition', `inline; filename=${invoiceFile}`);

    //   response.send(data);
    // });

    /**
     * For large files, a streamed response is better as
     * this will allow Node.js to read the file in chunks
    */
    // const data = fs.createReadStream(invoicePath);

    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', `inline; filename=${invoiceFile}`);

    /**
     * Using the `pipe()` method on the response object to
     * pipe the readable stream of data into the response's
     * writable stream
    */
    // response.pipe(data);

    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(response);

    pdfDoc
      .fontSize(28)
      .text('Invoice', { underline: true });

    pdfDoc
      .text('-----------------------------');

    let totalPrice = 0;

    order.items.forEach((item, index) => {
      totalPrice = (totalPrice + item.quantity) * item.product.price;

      pdfDoc
        .fontSize(14)
        .text(`${index + 1}: ${item.product.title} - ${item.quantity} - $${item.product.price}`);
    });

    pdfDoc.end();
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
