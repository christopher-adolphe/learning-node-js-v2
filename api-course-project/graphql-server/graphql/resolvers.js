const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const removeFile = require('../utils/removeFile');

const User = require('../models/user');
const Post = require('../models/post');

module.exports = {
  createUser: async function({ userInputData }, request) {
    const { name, email, password } = userInputData;
    const errors = [];

    if (!validator.isEmail(email)) {
      errors.push({ message: 'Please enter a valid email!' });
    }

    if (!validator.isEmpty(password) || !validator.isLength(password, { min: 5 })) {
      errors.push({ message: 'Please enter a password of minimum 5 characters!' });
    }

    if (errors.isLength > 0) {
      const error = new Error(('Invalid input'));

      error.data = errors;
      error.code = 422;

      throw error;
    }

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      const error = new Error(`Sorry, a user with email ${email} already exists`);

      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    const result = await user.save();

    return {
      ...result._doc,
      _id: result._id.toString(),
    };
  },
  login: async function({ email, password }) {
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error(`Sorry, no user found with email: ${email}`);

      error.code = 401;

      throw error;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      const error = new Error('Sorry, password is incorrect');

      error.code = 401;

      throw error;
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      'myJwtSecretPrivateKey',
      {
        expiresIn: '1h',
      }
    );

    return { token, userId: user._id.toString() };
  },
  createPost: async function({ postInputData }, request) {
    const { userId, isAuth } = request;
    const { title, content, imageUrl } = postInputData;
    const errors = [];

    if (!isAuth) {
      const error = new Error(('Sorry, you cannot create a post while not being authenticated'));

      error.code = 401;

      throw error;
    }

    if (!validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
      errors.push({ message: 'Sorry title is compulsory and must be at least 5 characters long!' });
    }

    if (!validator.isEmpty(content) || !validator.isLength(content, { min: 5 })) {
      errors.push({ message: 'Sorry content is compulsory and must be at least 5 characters long!' });
    }

    if (errors.isLength > 0) {
      const error = new Error(('Invalid input'));

      error.data = errors;
      error.code = 422;

      throw error;
    }

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error((`Sorry, you cannot find user with userId: ${userId}`));

      error.code = 401;

      throw error;
    }

    const post = new Post({
      title,
      content,
      imageUrl,
      creator: user,
    });

    const createdPost = await post.save();

    user.posts.push(createdPost);

    await user.save();

    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString(),
    }
  },
  allposts: async function({ page }, request) {
    const { isAuth } = request;
    const currentPage = page || 1;
    const postPerPage = 2;

    if (!isAuth) {
      const error = new Error(('Sorry, cannot get posts while not being authenticated'));

      error.code = 401;

      throw error;
    }

    const posts = await Post.find()
      .populate('creator')
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * postPerPage)
      .limit(postPerPage);

    const totalItems = await Post.find().countDocuments();

    const formattedPosts = posts.map(post => ({
      ...post._doc,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }));

    return { posts: formattedPosts, totalItems };
  },
  post: async function({ postId }, request) {
    const { isAuth } = request;

    if (!isAuth) {
      const error = new Error(('Sorry, cannot get post while not being authenticated'));

      error.code = 401;

      throw error;
    }

    const post = await Post.findById(postId).populate('creator');

    if (!post) {
      const error = new Error(`Sorry, no post found with id: ${postId}`);

      error.statusCode = 404;

      throw error;
    }

    const formattedPost = {
      ...post._doc,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
    

    return formattedPost;
  },
  updatePost: async function({ postId, postInputData }, request) {
    const { isAuth, userId } = request;
    const { title, content, imageUrl } = postInputData;
    const errors = [];

    if (!isAuth) {
      const error = new Error(('Sorry, cannot update post while not being authenticated'));

      error.code = 401;

      throw error;
    }

    const post = await Post.findById(postId).populate('creator');

    if (!post) {
      const error = new Error(`Sorry, no post found with id: ${postId}`);

      error.statusCode = 404;

      throw error;
    }

    if (post.creator._id.toString() !== userId.toString()) {
      const error = new Error(`Sorry, you are not authorized to update post with id: ${postId}.`);

      error.statusCode = 403;

      throw error;
    }

    if (!validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
      errors.push({ message: 'Sorry title is compulsory and must be at least 5 characters long!' });
    }

    if (!validator.isEmpty(content) || !validator.isLength(content, { min: 5 })) {
      errors.push({ message: 'Sorry content is compulsory and must be at least 5 characters long!' });
    }

    if (errors.isLength > 0) {
      const error = new Error(('Invalid input'));

      error.data = errors;
      error.code = 422;

      throw error;
    }

    post.title = title;
    post.content = content;

    if (imageUrl !== 'undefined') {
      post.imageUrl = imageUrl;
    }

    const updatedPost = await post.save();

    return {
      ...updatedPost._doc,
      _id: updatedPost._id.toString(),
      createdAt: updatedPost.createdAt.toISOString(),
      updatedAt: updatedPost.updatedAt.toISOString(),
    };
  },
  deletePost: async function({ postId }, request) {
    const { isAuth, userId } = request;

    if (!isAuth) {
      const error = new Error(('Sorry, cannot delete post while not being authenticated'));

      error.code = 401;

      throw error;
    }

    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error(`Sorry, no post found with id: ${postId}`);

      error.statusCode = 404;

      throw error;
    }

    if (post.creator.toString() !== userId.toString()) {
      const error = new Error(`Sorry, you are not authorized to delete post with id: ${postId}.`);

      error.statusCode = 403;

      throw error;
    }

    const deletedPost = await Post.deleteOne({ _id: postId });

    removeFile(post.imageUrl);

    const user = await User.findById(userId);

    user.posts.pull(postId);

    await user.save();

    return deletedPost.deletedCount;
  },
  user: async function(args, request) {
    const { isAuth, userId } = request;

    if (!isAuth) {
      const error = new Error(('Sorry, cannot get user details while not being authenticated'));

      error.code = 401;

      throw error;
    }

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error((`Sorry, could not find user with id: ${userId}`));

      error.code = 404;

      throw error;
    }

    return {
      ...user._doc,
      _id: user._id.toString(),
    };
  },
  updateStatus: async function({ status }, request) {
    const { isAuth, userId } = request;
    const errors = [];

    if (!isAuth) {
      const error = new Error(('Sorry, cannot update status while not being authenticated'));

      error.code = 401;

      throw error;
    }

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error((`Sorry, could not find user with id: ${userId}`));

      error.code = 404;

      throw error;
    }

    if (!validator.isEmpty(status) || !validator.isLength(status, { min: 5 })) {
      errors.push({ message: 'Sorry status is compulsory and must be at least 5 characters long!' });
    }

    user.status = status;

    const updatedUser = await user.save();

    return {
      ...updatedUser._doc,
      _id: updatedUser._id.toString(),
    };
  },
};
