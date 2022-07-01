const express = require('express');
const router = express.Router();

const {
  getShop,
  getProductList,
  getProductDetails,
  getCart,
  getCheckout
} = require('../controllers/shop-controller');

router.get(getShop);

router.get(getProductList);

router.get(getProductDetails);

router.get(getCart);

router.get(getCheckout);

module.exports = router;
