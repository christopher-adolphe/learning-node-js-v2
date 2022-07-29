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
    const [ rows, fieldData ] = await Product.fetchAll();

    products = [ ...rows ];

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
  let product;

  try {
    const [ row ] = await Product.findById(productId);

    product = { ...row[0] };

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

const deleteCartItem = (request, response) => {
  const { productId } = request.body;
  console.log('Deleting cart item...', productId);

  Product.findById(productId, (product) => {
    Cart.deleteItem(productId, product.price);
    
    response.redirect('/cart');
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
  postCart,
  getOrders,
  getCheckout,
  deleteCartItem
};
