const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

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
    })
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

const signIn = (request, response, next) => {};

const signOut = (request, response, next) => {};

module.exports = {
  signUp,
  signIn,
  signOut,
};
