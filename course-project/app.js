const express = require('express');
const path = require('path');
const sequelize = require('./utils/database');

const app = express();
const port = process.env.PORT || 3000;

const shopRouter = require('./routes/shop-router');
const adminRouter = require('./routes/admin-router');
const errorRouter = require('./routes/error-router');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(shopRouter);
app.use('/admin', adminRouter);
app.use(errorRouter);


/**
 * Using the `sync()` method from the sequelize
 * instance to synchronise all defined models to
 * the database; i.e it will create the tables for
 * all the models we have defined
*/
sequelize
  .sync()
  .then(result => {
    app.listen(port, () => {
      console.log(`Server listening... http://localhost:${port}`);
    });
  })
  .catch (error => {
    console.log(error);
  });

