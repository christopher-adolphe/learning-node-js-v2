const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

/**
 * Using the `diskStorage()` method from the
 * `multer` instance to setup a storage engine
 * The configuration of the storage engine takes
 * an object with 2 keys; a `destination` and
 * `filename` for files which will be uploaded
*/
const fileStorage = multer.diskStorage({
  destination: (request, file, doneCallback) => {
    doneCallback(null, 'images');
  },
  filename: (request, file, doneCallback) => {
    doneCallback(null, `${new Date().toISOString()}-${file.originalname}`);
  },
});

/**
 * Configuring a file filter for `multer` to
 * apply when files are uploaded so that we
 * can accept which file type can or cannot
 * be uploaded
*/
const fileFilter = (request, file, doneCallback) => {
  const allowedFileTypes = ['image/png', 'image/jpg', 'image/jpeg'];

  if (allowedFileTypes.includes(file.mimetype)) {
    // Calling the `doneCallback` with true to accept uploaded file
    doneCallback(null, true);
  } else {
    // Calling the `doneCallback` with true to reject uploaded file
    doneCallback(null, false);
  }
};

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
/**
 * Using multer middleware to process files uploaded
 * in multipart/form-data format
 * NOTE: The field in which the image is uploaded is
 * specified in the `single()` function
*/
app.use(multer({
  storage: fileStorage,
  fileFilter,
}).single('image'));

app.use(express.static(path.join(__dirname, 'public')));

/**
 * Serving the uploaded file statically
*/
app.use('/images', express.static(path.join(__dirname, 'images')));

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

    if (!user) {
      return next();
    }

    request.user = user;

    next();
  } catch (error) {
    console.log(`Sorry, an error occurred when fetching user: ${error.message}`);

    const failure = new Error(error);

    failure.httpStatusCode = 500;

    return next(failure);
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

/**
 * Adding an Express error handling middleware
 * which will be called whenever a `next()`
 * function is called with an error passed to
 * it as argument
*/
app.use((error, request, response, next) => {
  response.redirect('/500');
});

const server = mongooseConnect(app, port);
