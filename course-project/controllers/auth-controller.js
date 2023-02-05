const bcrypt = require('bcryptjs');

const User = require('../models/user');

const getLogin = (request, response) => {
  let errorMessage = request.flash('error');

  if (errorMessage.length > 0) {
    /**
     * Using the `flash()` method added to the request object
     * by the `flash` middleware to pull the error message in
     * the session by passing only the key as parameter
    */
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }

  response.render('auth/login', {
    pageTitle: 'Login',
    slug: 'login',
    errorMessage,
  });
};

const postLogin = async (request, response) => {
  const { email, password } = request.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      /**
       * Using the `flash()` method added to the request object
       * by the `flash` middleware to flash an error message in
       * our session. It takes 2 parameters; the 1st one is a key
       * and the 2nd is the value of that key
      */
      request.flash('error', 'Invalid email or password! Please try again.');
      return response.redirect('/login');
    }

    /**
     * Using the `compare()` method from bcrypt to
     * check if the password entered in the login
     * form matches with the encrypted password in
     * the database
    */
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      request.flash('error', 'Invalid password! Please try again.');
      return response.redirect('/login');
    }

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
  let errorMessage = request.flash('error');

  if (errorMessage.length > 0) {
    /**
     * Using the `flash()` method added to the request object
     * by the `flash` middleware to pull the error message in
     * the session by passing only the key as parameter
    */
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }

  response.render('auth/signup', {
    pageTitle: 'Sign up',
    slug: 'signup',
    errorMessage,
  });
};

const postSignup = async (request, response) => {
  const { email, password, confirmPassword } = request.body;

  try {
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      request.flash('error', 'This email already exist! Please use a different one.')
      return response.redirect('/signup');
    }

    /**
     * Using the `hash()` method from bcrypt to
     * encrypt the password with a salt value
    */
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
    // console.log(`Sorry, an error occurred when user logged out: ${error}`);
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
