const getLogin = (request, response) => {
  response.render('auth/login', {
    pageTitle: 'Login',
    slug: 'login',
  });
};

const postLogin = (request, response) => {
  response.redirect('/');
};

module.exports = {
  getLogin,
  postLogin,
};
