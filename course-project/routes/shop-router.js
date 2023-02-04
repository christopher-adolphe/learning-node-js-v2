const express = require('express');
const router = express.Router();
const authentication = require('../middleware/authentication');

const {
  getShop,
  getProductList,
  getProductDetails,
  getCart,
  postCart,
  deleteCartItem,
  postOrder,
  getOrders,
  getCheckout
} = require('../controllers/shop-controller');

router.get('/', getShop);

router.get('/products', getProductList);

router.get('/products/:id', getProductDetails);

router.get('/cart', authentication, getCart);

router.post('/cart', authentication, postCart);

router.post('/cart-delete-item', authentication, deleteCartItem);

router.post('/add-order', authentication, postOrder);

router.get('/orders', authentication, getOrders);

// router.get('/checkout', getCheckout);

module.exports = router;
