const getError = (request, response) => {
  response
    .status(404)
    .render('not-found', {
      pageTitle: 'Page not found',
      slug: 'not-found',
    });
}

module.exports = getError;
