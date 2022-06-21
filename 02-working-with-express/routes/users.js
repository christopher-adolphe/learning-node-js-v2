const express = require('express');
const path = require('path');
const rootDir = require('../utils/path');

const router = express.Router();

router.get('/', (request, response, next) => {
  response.sendFile(path.join(rootDir, 'views', 'users.html'));
});

module.exports = router;
