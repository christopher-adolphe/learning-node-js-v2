const User = require('../models/user');

const getLogin = (request, response) => {
  console.log('checking session: ', request.session.isLoggedIn);
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

    response.redirect('/');
  } catch (error) {
    console.log(`Sorry, an error occurred when user logged in: ${error.message}`);
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
  postLogout,
};
