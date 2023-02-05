const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const addLocals = require('./middleware/addLocals');

const path = require('path');
const mongooseConnect = require('./utils/database');
const User = require('./models/user');

const app = express();
const store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/online_shop',
  collection: 'sessions',
});
/**
 * Using the `csrf()` function to get a middleware
 * that will handle the Cross Site Request Forgery
 * protection
*/
const csrfProtection = csrf();
const port = process.env.PORT || 3000;

const shopRouter = require('./routes/shop-router');
const authRouter = require('./routes/auth-router');
const adminRouter = require('./routes/admin-router');
const errorRouter = require('./routes/error-router');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'my session secret',
  resave: false,
  saveUninitialized: false,
  store,
}));
/**
 * Instructing our node.js application to use
 * the `csrfProtection` middleware after we
 * initialize the session
*/
app.use(csrfProtection);
/**
 * Instructing our node.js application to use
 * the `flash` middleware after we
 * initialize the session. The flash middleware
 * allows us to store information temporarily
 * in the user's sesssion
*/
app.use(flash());

/**
 * Registering a middleware function to store the user
 * model in the request so that it is accessible everywhere
 * in the Node.js app
*/
app.use( async (request, response, next) => {
  if (!request.session.user) {
    return next();
  }

  try {
    const user = await User.findById(request.session.user._id);

    request.user = user;

    next();
  } catch (error) {
    console.log(`Sorry, an error occurred when fetching user: ${error.message}`);
  }
});

/**
 * Instructing our node.js application to use
 * the `addLocals` middleware to add session
 * and csrf token details to each view being
 * rendered
*/
app.use(addLocals);

app.use(shopRouter);
app.use('/admin', adminRouter);
app.use(authRouter);
app.use(errorRouter);

const server = mongooseConnect(app, port);
