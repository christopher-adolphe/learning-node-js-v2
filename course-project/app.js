const express = require('express');
const path = require('path');
const sequelize = require('./utils/database');

const app = express();
const port = process.env.PORT || 3000;

const shopRouter = require('./routes/shop-router');
const adminRouter = require('./routes/admin-router');
const errorRouter = require('./routes/error-router');

const Product = require('./models/product');
const User = require('./models/user');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(shopRouter);
app.use('/admin', adminRouter);
app.use(errorRouter);

/**
 * Registering a middleware function to store the user
 * model in the request so that it is accessible everywhere
 * in the Node.js app
*/
app.use(async (request, response, next) => {
  try {
    const user = await User.findByPk(1);

    request.user = user;

    next();
  } catch (error) {
    console.log(`Sorry, an error occurred when fetching user: ${error.message}`);
  }
});

/**
 * Using assosications methods of the models
 * to add a foreign key constraint to the
 * attributes
*/
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

/**
 * Using the `sync()` method from the sequelize
 * instance to synchronise all defined models to
 * the database; i.e it will create the tables for
 * all the models we have defined
*/
sequelize
  .sync()
  .then(result => {
    return User.findByPk(1);
  })
  .then(user => {
    if (!user) {
      return User.create({
        name: 'Christopher',
        email: 'christopher@onlineshop.com',
      });
    }

    return user;
  })
  .then(user => {
    app.listen(port, () => {
      console.log(`Server listening... http://localhost:${port}`);
    });
  })
  .catch (error => {
    console.log(error);
  });

