const express = require('express');
const { check } = require('express-validator/check');

const router = express.Router();

const {
  getLogin, 
  postLogin,
  getSignup,
  postSignup,
  postLogout,
  getResetPassword,
  postResetPassword,
  getChangePassword,
  postChangePassword,
} = require('../controllers/auth-controller');

router.get('/login', getLogin);

router.post('/login', postLogin);

router.get('/signup', getSignup);

/**
 * Using the `check()` middleware function from
 * `express-validator` to enforce a validation
 * on the email property in the request body
 * The `check()` middleware will add the errors
 * resulting from the validation to the request.
 * These errors can then be extracted at the controller
 * level using the `validationResult`
*/
router.post('/signup', check('email').isEmail().withMessage('Please enter a valid email!'), postSignup);

router.post('/logout', postLogout);

router.get('/reset-password', getResetPassword);

router.post('/reset-password', postResetPassword);

router.get('/reset-password/:token', getChangePassword);

router.post('/change-password', postChangePassword);

module.exports = router;
