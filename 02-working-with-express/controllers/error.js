const get404 = (request, response, next) => {
  response
    .status(404)
    .render('not-found', { pageTitle: 'Page not found', path: null });
};

module.exports = get404;
