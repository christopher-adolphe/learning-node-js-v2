const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const sendGridMail = require('@sendgrid/mail');

const User = require('../models/user');
// const transporter = nodemailer.createTransport(sendGridTransport({
//   auth: {
//     api_key: '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',
//   },
// }));

// sendGridMail.setApiKey('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');
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
    slug: 'reset',
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
  }
 });
};

module.exports = {
  getLogin,
  postLogin,
  getSignup,
  postSignup,
  postLogout,
  getResetPassword,
  postResetPassword,
};
