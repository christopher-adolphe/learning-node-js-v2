const addLocals = (request, response, next) => {
  /**
   * Using the `locals` property on the `response` object
   * to add custom properties to the response so that we
   * don't have to do it manually on each and every render
   * of our views
  */
  response.locals.isAuthenticated = request.session.isLoggedIn;
  response.locals.csrfToken = request.csrfToken();

  next();
};

module.exports = addLocals;
