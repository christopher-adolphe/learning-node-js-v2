const Product = require('../models/product');
const Cart = require('../models/cart');

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
  // const getAllProducts = (products) => {
  //   response.render('shop/product-list', {
  //     pageTitle: 'Product List',
  //     slug: 'products',
  //     hasProducts: products.length,
  //     products,
  //   });
  // };

  // Product.fetchAll(getAllProducts);

  let products = [];
  
  try {
    // const [ rows, fieldData ] = await Product.fetchAll();

    products = await Product.findAll();;

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
    product = await Product.findByPk(productId);

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
  // const getCartData = (cart) => {
  //   Product.fetchAll((products) => {
  //     const cartItems = [];

  //     products.forEach(product => {
  //       const item = cart.items.find(item => item.id === product.id);

  //       if (item) {
  //         cartItems.push({ product, quantity: item.quantity });
  //       }
  //     });

  //     response.render('shop/cart', {
  //       pageTitle: 'My Cart',
  //       slug: 'cart',
  //       cartItems,
  //     });
  //   });
  // };

  // Cart.getCart(getCartData);

  const { user } = request;
  let cartItems = [];

  try {
    /**
     * Using the `getCart()` association
     * method to cart by user and from the
     * cart we get all products using the
     * `getProducts()`
    */
    const cart = await user.getCart();
    cartItems = await cart.getProducts();

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
  // const { productId } = request.body;

  // Product.findById(productId, (product) => {
  //   console.log('postCart: ', product);
  //   Cart.addItem(productId, product.price);
  // });

  // response.redirect('/cart');

  const { user } = request;
  const { productId } = request.body;
  let existingCartItem;
  let newQuantity = 1;

  try {
    const cart = await user.getCart();
    const existingCartItems = await cart.getProducts({ where: { id: productId } });

    if (existingCartItems.length) {
      existingCartItem = existingCartItems[0];
      console.log('postCart - existingCartItem: ', existingCartItem);
    }

    if (existingCartItem) {
      const oldQuantity = existingCartItem.cartItem.quantity;

      newQuantity = oldQuantity + 1;

      cart.addProduct(existingCartItem, { through: { quantity: newQuantity }});

      return response.redirect('/cart');
    }

    const newCartItem = await Product.findByPk(productId);

    cart.addProduct(newCartItem, { through: { quantity: newQuantity }});

    response.redirect('/cart');
  } catch (error) {
    console.log(`Sorry, an error occurred while saving item to cart: ${error.message}`);

    response.redirect('shop/index');
  }
};

const deleteCartItem = async (request, response) => {
  // const { productId } = request.body;

  // Product.findById(productId, (product) => {
  //   Cart.deleteItem(productId, product.price);
    
  //   response.redirect('/cart');
  // });

  const { user } = request;
  const { productId } = request.body;

  try {
    const cart = await user.getCart();
    const cartItems = await cart.getProducts({ where: { id: productId } });
    const product = cartItems[0];

    await product.cartItem.destroy();

    response.redirect('/cart');
  } catch (error) {
    console.log(`Sorry, an error occurred while deleting item from cart: ${error.message}`);

    response.redirect('shop/index');
  }
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
  getCheckout,
  deleteCartItem
};
