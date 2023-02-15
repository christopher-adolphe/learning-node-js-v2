const express = require('express');
const router = express.Router();

const { getError404, getError500 } = require('../controllers/error-controller');

router.get('/500', getError500);
router.use(getError404);

module.exports = router;
