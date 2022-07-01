const express = require('express');
const router = express.Router();

const {
  getProducts,
  getProduct,
  editProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/admin-controller')

module.exports = router;
