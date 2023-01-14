const express = require('express');
const router = express.Router();

const {
  getProducts,
  getProduct,
  addProduct,
  createProduct,
  editProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/admin-controller');

router.get('/products', getProducts);

// router.get('/products/:id', getProduct);

router.get('/add-product', addProduct);

// router.post('/add-product', createProduct);

// router.get('/edit-product/:id', editProduct);

// router.post('/edit-product/', updateProduct);

// router.post('/delete-product', deleteProduct);

module.exports = router;
