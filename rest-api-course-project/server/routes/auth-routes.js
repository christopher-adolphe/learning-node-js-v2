const express = require('express');
const router = express.Router();

const { signUp, signIn, signOut } = require('../controllers/auth-controller');

router.put('/signup', signUp);

module.exports = router;
