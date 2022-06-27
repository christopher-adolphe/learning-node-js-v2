const express = require('express');

const homeRouter = require('./routes/home');
const usersRouter = require('./routes/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));

app.use(homeRouter);
app.use('/v1/users', usersRouter);

app.listen(3000, () => {
  console.log('Server listening... http://localhost:3000');
});
