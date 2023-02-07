const express = require('express');
const router = express.Router();

const {
  getLogin, 
  postLogin,
  getSignup,
  postSignup,
  postLogout,
  getResetPassword,
  postResetPassword,
} = require('../controllers/auth-controller');

router.get('/login', getLogin);

router.post('/login', postLogin);

router.get('/signup', getSignup);

router.post('/signup', postSignup);

router.post('/logout', postLogout);

router.get('/reset-password', getResetPassword);

router.post('/reset-password', postResetPassword);

module.exports = router;
