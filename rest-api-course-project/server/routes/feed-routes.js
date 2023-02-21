const express = require('express');
const { body } = require('express-validator');

const { getPosts, getPost, createPost, deletePost } = require('../controllers/feed-controller');

const router = express.Router();

router.get('/posts', getPosts);

router.get('/posts/:id', getPost);

router.post(
  '/posts',
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5}),
  ],
  createPost
);

router.delete('/posts/:id', deletePost);

module.exports = router;
