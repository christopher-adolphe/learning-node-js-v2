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
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

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
  try {
    const user = await User.findByPk(1);

    request.user = user;

    next();
  } catch (error) {
    console.log(`Sorry, an error occurred when fetching user: ${error.message}`);
  }
});

app.use(shopRouter);
app.use('/admin', adminRouter);
app.use(errorRouter);

/**
 * Using assosications methods of the models
 * to add a foreign key constraint to the
 * attributes
*/
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

/**
 * Establishing a one-to-one relationship
 * between the `Cart` and `User` models
*/
Cart.belongsTo(User);
User.hasOne(Cart);

/**
 * Establishing a many-to-many relationship
 * between the `Product` and `Cart` models
 * We use `CartItem` model as a lookup table
 * to connect them. So we pass it via the
 * `through` option to the `belongsToMany()`
 * method to indicate Sequelize where these
 * connections should be stored
*/
Product.belongsToMany(Cart, { through: CartItem });
Cart.belongsToMany(Product, { through: CartItem });

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
  // .then(user => {
  //   // Using the `createCart()` association method
  //   // to create a cart related to the user
  //   return user.createCart();
  // })
  .then(user => {
    app.listen(port, () => {
      console.log(`Server listening... http://localhost:${port}`);
    });
  })
  .catch (error => {
    console.log(error);
  });

