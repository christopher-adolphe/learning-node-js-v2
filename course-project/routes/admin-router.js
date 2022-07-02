const express = require('express');
const router = express.Router();

const {
  getProducts,
  getProduct,
  addProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/admin-controller');

router.get('/products', getProducts);

router.get('/products/:id', getProduct);

router.get('/add-product', addProduct);

router.post('/add-product', createProduct);

router.put('/products/:id', updateProduct);

router.delete('/products/:id', deleteProduct);

module.exports = router;
