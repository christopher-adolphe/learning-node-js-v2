const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

const Post = require('../models/post');
const User = require('../models/user');

// Importing the shared websocket connection
const { getIO } = require('../socket');

const getPosts = async (request, response, next) => {
  const currentPage = request.query.page || 1;
  const postPerPage = 2;

  try {
    const postCount = await Post.find().countDocuments();
    const posts = await Post
      .find()
      .populate('creator')
      .sort({ createdAt: -1 })
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

      throw error;
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

  try {
    if (!errors.isEmpty()) {
      const error = new Error('Sorry, an error occurred while creating new post because the request is invalid.');
  
      error.statusCode = 422;
      
      throw error;
    }
  
    if (!request.file) {
      const error = new Error('Sorry, an error occurred while creating new post because no image was uploaded.');
  
      error.statusCode = 422;
      
      throw error;
    }

    const post = new Post({
      title,
      content,
      imageUrl: request.file.path,
      creator: request.userId,
    });

    const user = await User.findById(request.userId);

    /**
     * Using the `push()` operator to append the
     * `id` of the new post in the user before
     * saving the new post to the database
     * NOTE: We are passing the entire new `post`
     * object to the `push()` operator but behind
     * the scenes mongoose will take only the `_id`
     * field as per the schema defined for the `User`
     * model
    */
    user.posts.push(post);
    await user.save();

    const result = await post.save();

    /**
     * Using the `emit()` method from socket.io to
     * send a message to all connected clients to 
     * inform them that a new post was created. The
     * `emit()` method takes a 1st parameter a name
     * for the event being emitted
     * and an object as 2nd parameter which we can use
     * to send data to the connected clients
     * NOTE: The name of the action being emit from
     * the server should be the same that the socket
     * listens on the client; meanning:
     * Server => getIO.emit('someName', { someData })
     * Client => socket.on('someName' , () => { // Frontend logic });
    */
    getIO().emit('posts', {
      action: 'create',
      post: {
        ...post._doc,
        creator: {
          _id: user._id,
          name: user.name,
        },
      },
    });

    response.status(201).json({
      message: 'New post successfully created',
      post: result,
      creator: {
        _id: user._id,
        name: user.name,
      },
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

  try {
    if (!errors.isEmpty()) {
      const error = new Error('Sorry, an error occurred while updating post because the request is invalid.');
  
      error.statusCode = 422;
      
      throw error;
    }
  
    if (uploadedImage) {
      image = uploadedImage.path;
    }
  
    if (!image) {
      const error = new Error('Sorry, an error occurred while updating post because no image was uploaded.');
  
      error.statusCode = 422;
      
      throw error;
    }

    const post = await Post.findById(id).populate('creator');

    if (!post) {
      const error = new Error(`Sorry, no post found with id: ${id}`);

      error.statusCode = 404;

      throw error;
    }

    if (post.creator._id.toString() !== request.userId) {
      const error = new Error(`Sorry, you are not authorized to update post with id: ${id}.`);

      error.statusCode = 403;

      throw error;
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

    getIO().emit('posts', {
      action: 'update',
      post: result,
    });

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
  const { userId } = request;

  try {
    const post = await Post.findById(id);

    if (!post) {
      const error = new Error(`Sorry, no post found with id: ${id}`);

      error.statusCode = 404;

      throw error;
    }

    if (post.creator.toString() !== userId) {
      const error = new Error(`Sorry, you are not authorized to delete post with id: ${id}.`);

      error.statusCode = 403;

      throw error;
    }

    const filePath = path.join(__dirname, '..', post.imageUrl);

    fs.unlink(filePath, error => {
      if (error) {
        const error = new Error('Sorry, an error occurred while deleting image post.');

        error.statusCode = 500;
        
        throw error;
      }
    });

    const result = await Post.deleteOne({ _id: id });
    const user = await User.findById(userId);

    /**
     * Using the `pull()` operator to remove postIds from
     * the user after the post is deleted. This is an
     * important step to clear any relationship between
     * the post being deleted and the user who created it
    */
    user.posts.pull(id);

    await user.save();

    getIO().emit('posts', {
      action: 'delete',
      post: id,
    });

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
