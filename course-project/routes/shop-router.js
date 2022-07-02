const express = require('express');
const router = express.Router();

const {
  getShop,
  getProductList,
  getProductDetails,
  getCart,
  getCheckout
} = require('../controllers/shop-controller');

router.get('/', getShop);

router.get('/products', getProductList);

router.get('/products/:id', getProductDetails);

router.get('/cart', getCart);

router.get('/checkout', getCheckout);

module.exports = router;
