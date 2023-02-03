const bcrypt = require('bcryptjs');

const User = require('../models/user');

const getLogin = (request, response) => {
  response.render('auth/login', {
    pageTitle: 'Login',
    slug: 'login',
    isAuthenticated: request.session.isLoggedIn,
  });
};

const postLogin = async (request, response) => {
  try {
    const user = await User.findById('63c3781a21b25b2215880c92');

    request.session.user = user;
    request.session.isLoggedIn = true;

    /**
     * Using the `save()` method on the
     * `session` object to make sure that
     * we don't redirect too early
    */
    request.session.save(() => {
      response.redirect('/');
    });
  } catch (error) {
    console.log(`Sorry, an error occurred when user logged in: ${error.message}`);
  }
};

const getSignup = (request, response) => {
  response.render('auth/signup', {
    pageTitle: 'Sign up',
    slug: 'signup',
    isAuthenticated: request.session.isLoggedIn,
  });
};

const postSignup = async (request, response) => {
  const { email, password, confirmPassword } = request.body;

  try {
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return response.redirect('/signup');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      email,
      password: hashedPassword,
      cart: [],
    });

    await newUser.save();

    return response.redirect('/login');
  } catch (error) {
    console.log(`Sorry, an error occurred while signing up new user: ${error.message}`);
  }
};

const postLogout = (request, response) => {
  request.session.destroy((error) => {
    console.log(`Sorry, an error occurred when user logged out: ${error}`);
    response.redirect('/');
  });
}

module.exports = {
  getLogin,
  postLogin,
  getSignup,
  postSignup,
  postLogout,
};
