const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed-routes');

const app = express();
const port = process.env.PORT || 8080;

/**
 * Adding the `bodyParser` middleware to our
 * express application so that it parse json
 * data from incoming requests
*/
app.use(bodyParser.json());

/**
 * Addding a middleware to our express application
 * to enable Cross-Origin-Resource-Sharing (CORS)
 * to that clients hosted on other servers can still
 * accept responses from our express application
*/
app.use((request, response, next) => {
  /**
   * Specifying which origins can accept responses from
   * our express application
   * NOTE: With `*` as value, this means that the responses
   * from the express application can accepted by client
  */
  response.setHeader('Access-Control-Allow-Origin', '*');

  /**
   * Specifying which http methods the client can use
   * our express application
  */
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

  /**
   * Specifying some extra headers that the client can send
   * with their requests to our express application
  */
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  next();
});

app.use('/feed', feedRoutes);

app.listen(port, () => {
  console.log(`Server listening... http://localhost:${port}`);
});
