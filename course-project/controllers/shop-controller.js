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
  const { user } = request;
  const { productId } = request.body;

  try {
    const product = await Product.findById(productId);
    console.log('shop controller - product: ', product);
    const addToCartResult = await user.addToCart(product);

    console.log('shop controller - postCart: ', addToCartResult);

    response.redirect('/cart');
  } catch(error) {
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

const postOrder = async (request, response) => {
  const { user } = request;

  try {
    const cart = await user.getCart();
    const cartItems = await cart.getProducts();
    const newOrder = await user.createOrder();
    const result = await newOrder.addProducts(cartItems.map(item => {
      item.order_item = { quantity: item.cartItem.quantity }

      return item;
    }));

    await cart.setProducts(null);

    response.redirect('/orders');
  } catch (error) {
    console.log(`Sorry, an error occurred while creating order: ${error.message}`);

    response.redirect('/cart');
  }
};

const getOrders = async (request, response) => {
  const { user } = request;

  try {
    const orders = await user.getOrders({ include: ['products'] });

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
