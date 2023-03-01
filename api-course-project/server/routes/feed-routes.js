const express = require('express');
const { body } = require('express-validator');

const authenticate = require('../middleware/auth');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/feed-controller');

const router = express.Router();

router.get('/posts', authenticate, getPosts);

router.get('/posts/:id', authenticate, getPost);

router.post(
  '/posts',
  authenticate,
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5}),
  ],
  createPost
);

router.put(
  '/posts/:id',
  authenticate,
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5}),
  ],
  updatePost
);

router.delete('/posts/:id', authenticate, deletePost);

module.exports = router;
