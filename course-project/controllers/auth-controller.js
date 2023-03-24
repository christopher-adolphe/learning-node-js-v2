const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator/check');
// const sendGridTransport = require('nodemailer-sendgrid-transport');
// const sendGridMail = require('@sendgrid/mail');

const User = require('../models/user');
// const transporter = nodemailer.createTransport(sendGridTransport({
//   auth: {
//     api_key: 'sendgrid-api-key',
//   },
// }));

// sendGridMail.setApiKey('sendgrid-api-key');
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "d56783be929a2f",
    pass: "cfb402f84994fd"
  }
});

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
    previousInput: {
      email: '',
      password: '',
    },
    errors: [],
  });
};

const postLogin = async (request, response) => {
  const { email, password } = request.body;

  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    return response.status(422).render('auth/login', {
      pageTitle: 'Login',
      slug: 'login',
      errorMessage: errors.array()[0].msg,
      previousInput: { email, password },
      errors: errors.array(),
    });
  }

  try {
    const user = await User.findOne({ email: email });

    /**
     * Moving the `user` to a custom async validator in
     * `auth-router`
    */
    // if (!user) {
    //   /**
    //    * Using the `flash()` method added to the request object
    //    * by the `flash` middleware to flash an error message in
    //    * our session. It takes 2 parameters; the 1st one is a key
    //    * and the 2nd is the value of that key
    //   */
    //   request.flash('error', 'Invalid email or password! Please try again.');
    //   return response.redirect('/login');
    // }

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

    const failure = new Error(error);

    failure.httpStatusCode = 500;

    return next(failure);
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
    previousInput: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    errors: [],
  });
};

const postSignup = async (request, response) => {
  const { email, password, confirmPassword } = request.body;
  /**
   * Using the `validationResult()` function to
   * extract errors registered by the `check()`
   * middleware. The `validationResult()` function
   * return a object containing a `formatter` and an
   * `errors` array. The `errors` array will contain
   * the error object like:
   * [
   *  {
   *    value: 'test',
   *    msg: 'Please enter a valid email!',
   *    param: 'email',
   *    location: 'body'
   *  }
   *]

   * We can then pass the `msg` field to our view
   * to give feedback to the user
  */
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    return response.status(422).render('auth/signup', {
      pageTitle: 'Sign up',
      slug: 'signup',
      errorMessage: errors.array()[0].msg,
      previousInput: { email, password, confirmPassword },
      errors: errors.array(),
    });
  }

  try {
    /**
     * Moving this `existingUser` check a custom
     * validator in the `auth-router
    */
    // const existingUser = await User.findOne({ email: email });

    // if (existingUser) {
    //   request.flash('error', 'This email already exist! Please use a different one.')
    //   return response.redirect('/signup');
    // }

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

    const message = {
      to: email,
      from: 'christopher.adolphe@gmail.com',
      subject: 'Signup Successful',
      html: '<h1>You successfully signed up to Online Shop!</h1>',
    };

    transporter.sendMail(message);

    // await sendGridMail.send(message, (error) => {
    //   if (error) {
    //     console.log(`Sorry, an error occurred while sending signing up mail to user: ${error.message}`);
    //   } else {
    //     console.log(`Successfully sent signing up mail to user.`);
    //   }
    // });

    return response.redirect('/login');
  } catch (error) {
    console.log(`Sorry, an error occurred while signing up new user: ${error.message}`);

    const failure = new Error(error);

    failure.httpStatusCode = 500;

    return next(failure);
  }
};

const postLogout = (request, response) => {
  request.session.destroy((error) => {
    // console.log(`Sorry, an error occurred when user logged out: ${error}`);
    response.redirect('/');
  });
};

const getResetPassword = (request, response) => {
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

  response.render('auth/reset-password', {
    pageTitle: 'Reset your password',
    slug: 'reset-password',
    errorMessage,
  });
};

const postResetPassword = (request, response) => {
  const { email } = request.body;
  /**
   * Using the `crypto` module from Node.js to
   * create a token from random bytes
  */
 crypto.randomBytes(32, async (error, buffer) => {
  if (error) {
    console.log('randomBytes error: ', error);

    return response.redirect('/reset-password');
  }

  const token = buffer.toString('hex');

  
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      request.flash('error', 'Sorry, could not find any account with that email.');

      return response.redirect('/reset-password');
    }

    user.resetToken = token;

    /**
     * Setting the `resetTokenExpiry` to the current
     * date plus one hour (converted to milliseconds 1h -> 3,600,000ms)
    */
    user.resetTokenExpiry = Date.now() + 3600000;

    await user.save();

    const message = {
      to: email,
      from: 'christopher.adolphe@gmail.com',
      subject: 'Reset Password',
      html: `
        <p>You requested a password reset.</p>
        <p>Click this <a href="http://localhost:3000/reset-password/${token}">link</a> to set a new password.</p>
        <p>Please note that the above link is only valid for one hour.</p>
      `,
    };

    transporter.sendMail(message);

    response.redirect('/login');
  } catch (error) {
    console.log(`Sorry, an error occurred while looking for user to reset password: ${error.message}`);

    const failure = new Error(error);

    failure.httpStatusCode = 500;

    return next(failure);
  }
 });
};

const getChangePassword = async (request, response) => {
  try {
    const { token } = request.params;
    const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
    let errorMessage = request.flash('error');

    if (errorMessage.length > 0) {
      errorMessage = errorMessage[0];
    } else {
      errorMessage = null;
    }

    if (!user) {
      request.flash('error', 'Sorry, the link to reset your password is no more valid.');

      return response.render('auth/change-password', {
        pageTitle: 'Change your password',
        slug: 'change-password',
        errorMessage,
        userId: null,
        resetToken: null,
      });
    }

    response.render('auth/change-password', {
      pageTitle: 'Change your password',
      slug: 'change-password',
      errorMessage,
      userId: user._id.toString(),
      resetToken: token,
    });
  } catch (error) {
    console.log(`Sorry, an error occurred while looking for user to reset password: ${error.message}`);

    const failure = new Error(error);

    failure.httpStatusCode = 500;

    return next(failure);
  }
};

const postChangePassword = async (request, response) => {
  const { password, userId, resetToken } = request.body;

  try {
    const user = await User.findOne({ _id: userId, resetToken: resetToken, resetTokenExpiry: { $gt: Date.now() } });
    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    return response.redirect('/login');
  } catch (error) {
    console.log(`Sorry, an error occurred while changing user's password: ${error.message}`);

    const failure = new Error(error);

    failure.httpStatusCode = 500;

    return next(failure);
  }
};

module.exports = {
  getLogin,
  postLogin,
  getSignup,
  postSignup,
  postLogout,
  getResetPassword,
  postResetPassword,
  getChangePassword,
  postChangePassword,
};
