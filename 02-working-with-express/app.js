// Importing the `express` module
const express = require('express');

const path = require('path');
/**
 * Using the `path` module to create a custom
 * utility function that resolves to the root
 * directory
*/
const rootDir = require('./utils/path');

// Importing router middleware
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const usersRoutes = require('./routes/users');

const { pageStart, pageEnd } = require('./constants');
const { application } = require('express');

/**
 * Executing `express()` as a function creates
 * a new instance of an `express` app which then
 * exposes the various functionalities that the
 * Express.js framework offers
 */
const app = express();

/**
 * Using the `set()` method to configure the
 * Express app server's templating engine. Here
 * we configure `pug` as the templating engine
 * to be used
 */
app.set('view engine', 'pug');

/**
 * Using the `set()` method to configure the
 * directory from where views of the application
 * are located. The default value for the `views`
 * configuration is `/views`
 */
app.set('views', 'views');

/**
 * Using the `urlencoded()` method to parse the
 * body of incoming requests. The `urlencoded()`
 * method is a built-in middleware function which
 * is responsible to parse the body of the request
 * object. Internally it calls the `next()` function
 * to pass control to the next middleware function
 * down the request processing pipeline
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Using the `static()` method to serve static files.
 * The `static()` method is a built-in middleware
 * function responsible to serve static file; i.e files
 * directly accessed via the file system and not via
 * the router middleware
*/
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Using the `use()` method to mount a middleware
 * function. A middleware function is a request handler
 * function in Express.js and we can plug multiple of
 * them to funnel the incoming request until we send
 * the response. This allows to split the business logic
 * into dedicated files.
 * 
 * The `use()` method take two arguments:
 * 1) `path`: The path for which the middleware function
 * is invoked which is defaulted to '/'
 * 2) `callback`: A callback function or a list of callback
 * functions which are middleware functions that will
 * be executed when the base of the requested path matches `path`
*/
app.use((request, response, next) => {
  console.log('Middleware 1');

  /**
   * All middleware functions received a `next()` function as
   * parameter from Express.js. If a middleware function only
   * handles some business logic without sending a response,
   * then it needs to execute the `next()` function to pass
   * control to the next middleware function down the request
   * processing pipeline
  */
  next();
});

app.use((request, response, next) => {
  console.log('Middleware 2');

  next();
});

// app.use('/users', (request, response, next) => {
//   console.log('User Middleware');

//   const users = [
//     {
//       id: 156,
//       username: 'Josh'
//     },
//     {
//       id: 145,
//       username: 'Angela'
//     },
//     {
//       id: 136,
//       username: 'Peter'
//     }
//   ];

//   response.send(JSON.stringify(users));
// });

/**
 * Mounting the router middleware functions
 * in the main `Express` app. When mounting
 * router middleware in the `Express` app, we
 * can provide the common segment of our routes
 * i.e "/admin" to the `use()` method so that
 * we don't need to specify it of each and every
 * route that we define and it will also act as
 * a filter such that the middleware functions
 * are executed only when common segment match
*/
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use('/users', usersRoutes);

/**
 * Mounting a middleware functions as catch all
 * routes
*/
app.use((request, response, next) => {
  // bodyContent = `
  //   <h1>😵 Page not found 😵</h1>

  //   <p>Sorry, the requestd path does not exit.</p>
  //   <p>Click <a href="/">here</a> to go back to the home page.</p>
  // `;

  // const htmlPage = `
  //   ${pageStart}

  //   ${bodyContent}
    
  //   ${pageEnd}
  // `;

  // response
  //   .status(404)
  //   .send(htmlPage);

  // response
  //   .status(404)
  //   .sendFile(path.join(__dirname, 'views', 'not-found.html'));
  response
    .status(404)
    .sendFile(path.join(rootDir, 'views', 'not-found.html'));
});

app.listen(3000);
