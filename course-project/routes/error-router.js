const express = require('express');
const router = express.Router();

const getError = require('../controllers/error-controller');

router.use(getError);

module.exports = router;
