const express = require('express');
const router = express.Router();
const authentication = require('../middleware/authentication');

const {
  getProducts,
  getProduct,
  addProduct,
  createProduct,
  editProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/admin-controller');

router.get('/products', authentication, getProducts);

router.get('/products/:id', authentication, getProduct);

router.get('/add-product', authentication, addProduct);

router.post('/add-product', authentication, createProduct);

router.get('/edit-product/:id', authentication, editProduct);

router.post('/edit-product/', authentication, updateProduct);

router.post('/delete-product', authentication, deleteProduct);

module.exports = router;
