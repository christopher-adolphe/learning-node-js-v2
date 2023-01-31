const express = require('express');
const router = express.Router();

const { getLogin, postLogin, postLogout } = require('../controllers/auth-controller');

router.get('/login', getLogin);

router.post('/login', postLogin);

router.post('/logout', postLogout);

module.exports = router;