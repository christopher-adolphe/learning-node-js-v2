const express = require('express');

const users = require('../constant');

const router = express.Router();

router.get('/', (request, response, next) => {
  response.render('home', {
    pageTitle: 'Add user',
    slug: 'home'
  });
});

router.post('/', (request, response, next) => {
  const username = request.body.username;

  if (!username) {
    response
      .status(404)
      .redirect('/');
  }

  users.push(username);

  response
    .status(201)
    .redirect('/users');
});

module.exports = router;
