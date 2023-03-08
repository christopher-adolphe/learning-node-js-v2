const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const signUp = async (request, response, next) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    const error = new Error('Sorry, signup validation failed');

    error.statusCode = 422;
    error.info = errors.array();

    throw error;
  }

  const { name, email, password } = request.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    const result = await user.save();

    return response.status(201).json({
      message: 'New user successfully signed up',
      userId: result._id,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

const signIn = async (request, response, next) => {
  const { email, password } = request.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error(`Sorry, no user found with email: ${email}`);

      error.statusCode = 401;

      throw error;
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      const error = new Error(`Sorry, wrong email or password combination`);

      error.statusCode = 401;

      throw error;
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id,
      },
      'myJwtSecretPrivateKey',
      {
        expiresIn: '1h',
      }
    );

    return response.status(200).json({
      message: 'User successfully signed in',
      userId: user._id,
      token
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

const getStatus = async (request, response, next) => {
  const { userId } = request;

  try {
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error(`Sorry, could not find user with id: ${userId}`);

      error.statusCode = 404;

      throw error;
    }

    return response.status(200).json({
      status: user.status, 
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

const updateStatus = async (request, response, next) => {
  const { userId } = request;
  const { status } = request.body;
  const errors = validationResult(request);

  try {
    if (!errors.isEmpty()) {
      const error = new Error(`Sorry, status is invalid`);

      error.statusCode = 422;
      error.info = errors.array()[0];

      throw error;
    }

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error(`Sorry, could not find user with id: ${userId}`);

      error.statusCode = 404;

      throw error;
    }

    user.status = status;

    const result = await user.save();

    return response.status(200).json({
      message: 'User status successfully updated',
      userId: user._id,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

module.exports = {
  signUp,
  signIn,
  getStatus,
  updateStatus,
};
