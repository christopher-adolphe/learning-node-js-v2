const express = require('express');
const { getPosts, getPost, createPost, deletePost } = require('../controllers/feed-controller');

const router = express.Router();

router.get('/posts', getPosts);

router.get('/posts/:id', getPost);

router.post('/posts', createPost);

router.delete('/posts/:id', deletePost);

module.exports = router;
