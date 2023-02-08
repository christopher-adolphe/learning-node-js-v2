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
  getChangePassword,
  postChangePassword,
} = require('../controllers/auth-controller');

router.get('/login', getLogin);

router.post('/login', postLogin);

router.get('/signup', getSignup);

router.post('/signup', postSignup);

router.post('/logout', postLogout);

router.get('/reset-password', getResetPassword);

router.post('/reset-password', postResetPassword);

router.get('/reset-password/:token', getChangePassword);

router.post('/change-password', postChangePassword);

module.exports = router;
