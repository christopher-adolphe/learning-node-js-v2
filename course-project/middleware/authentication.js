const authentication = (request, response, next) => {
  if (!request.session.isLoggedIn) {
    response.redirect('/login');
  }

  next();
};

module.exports = authentication;
