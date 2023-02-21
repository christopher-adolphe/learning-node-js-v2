const express = require('express');
const { body } = require('express-validator');

const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/feed-controller');

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

router.put(
  '/posts/:id',
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5}),
  ],
  updatePost
);

router.delete('/posts/:id', deletePost);

module.exports = router;
