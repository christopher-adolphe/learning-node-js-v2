const fs = require('fs');
const path = require('path');
const Post = require('../models/post');
const { validationResult } = require('express-validator');

const getPosts = async (request, response, next) => {
  const currentPage = request.query.page || 1;
  const postPerPage = 2;

  try {
    const postCount = await Post.find().countDocuments();
    const posts = await Post
      .find()
      .skip((currentPage - 1) * postPerPage)
      .limit(postPerPage);

    response.status(200).json(
      {
        posts,
        totalItems: postCount,
      }
    )
  } catch (error) {
    // console.log(`Sorry, an error occurred while fetching posts: ${error.message}`);
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

const getPost = async (request, response, next) => {
  const { id } = request.params;

  try {
    const post = await Post.findById(id);

    if (!post) {
      const error = new Error(`Sorry, no post found with id: ${id}`);

      error.statusCode = 404;

      return next(error);
    }

    response.status(200).json({ post });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

const createPost = async (request, response, next) => {
  const errors = validationResult(request);
  const { title, content } = request.body;

  if (!errors.isEmpty()) {
    const error = new Error('Sorry, an error occurred while creating new post because the request is invalid.');

    error.statusCode = 422;
    
    return next(error);
  }

  if (!request.file) {
    const error = new Error('Sorry, an error occurred while creating new post because no image was uploaded.');

    error.statusCode = 422;
    
    return next(error);
  }

  try {
    const post = new Post({
      title,
      content,
      imageUrl: request.file.path,
      creator: {
        name: 'Rachel Robins',
      },
    });

    const result = await post.save();

    response.status(201).json({
      message: 'New post successfully created',
      post: result,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

const updatePost = async (request, response, next) => {
  const errors = validationResult(request);
  let { title, content, image } = request.body;
  const uploadedImage =  request.file;
  const { id } = request.params;

  if (!errors.isEmpty()) {
    const error = new Error('Sorry, an error occurred while updating post because the request is invalid.');

    error.statusCode = 422;
    
    return next(error);
  }

  if (uploadedImage) {
    image = uploadedImage.path;
  }

  if (!image) {
    const error = new Error('Sorry, an error occurred while updating post because no image was uploaded.');

    error.statusCode = 422;
    
    return next(error);
  }

  try {
    const post = await Post.findById(id);

    if (!post) {
      const error = new Error(`Sorry, no post found with id: ${id}`);

      error.statusCode = 404;

      return next(error);
    }

    post.title = title;
    post.content = content;

    if (image !== post.imageUrl) {
      const filePath = path.join(__dirname, '..', post.imageUrl);

      fs.unlink(filePath, error => {
        if (error) {
          const error = new Error('Sorry, an error occurred while updating image post.');

          error.statusCode = 500;
          
          return next(error);
        }
      });

      post.imageUrl = image;
    }

    const result = await post.save();

    response.status(200).json({
      message: 'Post successfully updated',
      post: result,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

const deletePost = async (request, response, next) => {
  const { id } = request.params;

  try {
    const post = await Post.findById(id);

    if (!post) {
      const error = new Error(`Sorry, no post found with id: ${id}`);

      error.statusCode = 404;

      return next(error);
    }

    const filePath = path.join(__dirname, '..', post.imageUrl);

    fs.unlink(filePath, error => {
      if (error) {
        const error = new Error('Sorry, an error occurred while deleting image post.');

        error.statusCode = 500;
        
        return next(error);
      }
    });

    const result = await Post.deleteOne({ _id: id });

    response.status(200).json({
      message: `Post with id: ${id} successfully deleted`,
      post: result,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
};
