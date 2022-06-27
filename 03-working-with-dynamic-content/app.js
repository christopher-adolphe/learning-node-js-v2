const express = require('express');
const path = require('path');

const homeRouter = require('./routes/home');
const usersRouter = require('./routes/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(homeRouter);
app.use('/users', usersRouter);
app.use((request, response, next) => {
  response
    .status(404)
    .render('not-found', {
      pageTitle: 'Not Found',
      slug: 'not-found',
    });
});

app.listen(3000, () => {
  console.log('Server listening... http://localhost:3000');
});
