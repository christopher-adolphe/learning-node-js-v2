const getError404 = (request, response) => {
  response
    .status(404)
    .render('error-404', {
      pageTitle: 'Page not found',
      slug: 'not-found',
      isAuthenticated: request.session.isLoggedIn,
    });
};

const getError500 = (request, response) => {
  response
    .status(500)
    .render('error-500', {
      pageTitle: 'An Error occurred',
      slug: 'server-error',
      isAuthenticated: request.session.isLoggedIn,
    });
};

module.exports = {
  getError404,
  getError500,
};
