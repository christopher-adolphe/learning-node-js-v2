// Importing the `express` module
const express = require('express');

/**
 * Executing `express()` as a function creates
 * a new instance of an `express` app which then
 * exposes the various functionalities that the
 * Express.js framework offers
 */
const app = express();

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
   * then it need to execute the `next()` function to pass
   * control to the next middleware function in the request
   * processing pipeline
  */
  next();
});

app.use((request, response, next) => {
  console.log('Middleware 2');

  next();
});

app.use((request, response, next) => {
  console.log('Middleware 3');

  /**
   * Using the `send()` method of the `response` object to
   * terminate the request-response cycle and send a response
   * to the client
  */
  response.send('<h1>Hello from Express.js</h1>');
});

app.listen(3000);
