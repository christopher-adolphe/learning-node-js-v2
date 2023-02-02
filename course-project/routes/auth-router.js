const express = require('express');
const router = express.Router();

const { getLogin, postLogin, getSignup, postSignup, postLogout } = require('../controllers/auth-controller');

router.get('/login', getLogin);

router.post('/login', postLogin);

router.get('/signup', getSignup);

router.get('/signup', postSignup);

router.post('/logout', postLogout);

module.exports = router;
