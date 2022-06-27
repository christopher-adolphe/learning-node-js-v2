const express = require('express');

const users = require('../constant');

const router = express.Router();

router.get('/', (request, response, next) => {
  response.render('users', {
    pageTitle: 'Users list',
    slug: 'users',
    users,
    hasUsers: users.length
  });
});

module.exports = router;
