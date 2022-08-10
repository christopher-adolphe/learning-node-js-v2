const express = require('express');
const path = require('path');
const { mongoConnect } = require('./utils/database');

const app = express();
const port = process.env.PORT || 3000;

const shopRouter = require('./routes/shop-router');
const adminRouter = require('./routes/admin-router');
const errorRouter = require('./routes/error-router');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Registering a middleware function to store the user
 * model in the request so that it is accessible everywhere
 * in the Node.js app
*/
app.use( async (request, response, next) => {
  // try {
  //   const user = await User.findByPk(1);

  //   request.user = user;

  //   next();
  // } catch (error) {
  //   console.log(`Sorry, an error occurred when fetching user: ${error.message}`);
  // }
  next();
});

app.use(shopRouter);
app.use('/admin', adminRouter);
app.use(errorRouter);

mongoConnect(() => {
  app.listen(port, () => {
    console.log(`Server listening... http://localhost:${port}`);
  });
});
