const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const { signUp, signIn, signOut } = require('../controllers/auth-controller');

const User = require('../models/user');

router.put(
  '/signup', 
  [
    body('name').trim().notEmpty(),
    body('email')
      .isEmail()
      .withMessage('Please, enter a valid email!')
      .custom(async (value, { req}) => {
        const user = await User.findOne({ email: value });

        if (user) {
          return Promise.reject('Sorry, this email is already in use!');
        }

        return true;
      })
      .normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
  ], 
  signUp
);

router.post('/signin', signIn);

module.exports = router;
