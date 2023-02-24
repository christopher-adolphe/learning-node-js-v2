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

const signOut = (request, response, next) => {};

module.exports = {
  signUp,
  signIn,
  signOut,
};
