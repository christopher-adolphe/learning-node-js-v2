const express = require('express');
const { check, body } = require('express-validator/check');

const User = require('../models/user');

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

router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email!')
      .custom(async (value, { req }) => {
        const user = await User.findOne({ email: value });

        if (!user) {
          return Promise.reject('Sorry, invalid email or password! Please try again.')
        }

        return true;
      }),
    body('password')
      .isLength({ min: 5 })
      .withMessage('Password should be at least 5 characters long!')
  ],
  postLogin
);

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
router.post(
  '/signup',
  [
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email!')
    /**
     * Using the `custom()` method to implement
     * custom validation logics via the `check()`
     * middleware. The `custom()` method takes a
     * function as parameter. This function will
     * contain our custom validation logic. The
     * function itself receieves a `value` argument
     * and a `req` object containing the request body
     * so thatwe can extract information from the request
     * if our validation logic depends on those
     * The custom validator function can return true
     * for valid cases, throw an error invalid cases
     * or wait for a promise to be fulfilled for async
     * validations. If the promise resolves, it is a
     * valid case but if it is rejected, then it is
     * considered as an invalid case
    */
    .custom(async (value, { req }) => {
      // if (value === 'test@test.com') {
      //   throw new Error('Sorry, use a different email other than test');
      // }

      // return true;

      const existingUser = await User.findOne({ email: value });

      if (existingUser) {
        return Promise.reject('This email already exist! Please use a different one.')
      }
    }),
    body('password', 'Password should be at least 5 characters long!')
      .isLength({ min: 5 }),
    body('confirmPassword')
      .custom((value, { req }) => {
        const { password } = req.body;

        if (value !== password) {
          throw new Error('Sorry, confirmed password did not match password!');
        }

        return true
      })
  ],
  postSignup);

router.post('/logout', postLogout);

router.get('/reset-password', getResetPassword);

router.post('/reset-password', postResetPassword);

router.get('/reset-password/:token', getChangePassword);

router.post('/change-password', postChangePassword);

module.exports = router;
