const express = require('express');
const { check, body } = require('express-validator/check');

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

router.post(
  '/add-product',
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .withMessage('Sorry, product title should be at least 3 charactors long!')
      .trim(),
    body('imgUrl')
      .isURL()
      .withMessage('Sorry, please provide a valid url for the prodoct image!')
      .trim(),
    body('price')
      .isFloat()
      .withMessage('Sorry, please provide a valid price for the prodoct!')
      .trim(),
    body('description')
      .isAlphanumeric()
      .isLength({ min: 5, max: 200 })
      .withMessage('Sorry, product description should be at least 5 charactors long!')
      .trim(),
  ],
  authentication,
  createProduct
);

router.get('/edit-product/:id', authentication, editProduct);

router.post(
  '/edit-product/',
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .withMessage('Sorry, product title should be at least 3 charactors long!')
      .trim(),
    body('imgUrl')
      .isURL()
      .withMessage('Sorry, please provide a valid url for the prodoct image!')
      .trim(),
    body('price')
      .isFloat()
      .withMessage('Sorry, please provide a valid price for the prodoct!')
      .trim(),
    body('description')
      .isAlphanumeric()
      .isLength({ min: 5, max: 200 })
      .withMessage('Sorry, product description should be at least 5 charactors long!')
      .trim(),
  ],
  authentication,
  updateProduct
);

router.post('/delete-product', authentication, deleteProduct);

module.exports = router;
