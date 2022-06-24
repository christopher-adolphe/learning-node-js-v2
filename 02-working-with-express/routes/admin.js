// Importing the `express` module
const express = require('express');

const path = require('path');
/**
 * Using the `path` module to create a custom
 * utility function that resolves to the root
 * directory
*/
const rootDir = require('../utils/path');

const { pageStart, pageEnd, products } = require('../constants');

/**
 * Using the `Router()` method to create a
 * new instance of the router object which
 * an isolated instance of middleware and
 * routes that can be plugged into the main
 * `Express` app to perform routing functions
 */
const router = express.Router();


/**
 * The `Express` app would match this route as:
 * /admin/add-product for HTTP GET requests only
*/
router.get('/add-product', (request, response, next) => {
  console.log('Add Product Middleware');

  // bodyContent = `
  //   <h1>Add Product</h1>

  //   <form class="form" action="/admin/add-product" method="POST">
  //     <div class="form__group">
  //       <label for="title">Product title:</label>
  //       <input type="text" id="title" name="title" />
  //     </div>

  //     <button type="submit">Add</button>
  //   </form>
  // `;

  // const htmlPage = `
  //   ${pageStart}

  //   ${bodyContent}

  //   ${pageEnd}
  // `;

  // response.send(htmlPage);
  // response.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
  // response.sendFile(path.join(rootDir, 'views', 'add-product.html'));

  response.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    isCurrentPage: true,
    hasFormCSS: true,
  });
});


/**
 * Using the `post()` method to mount a middleware
 * function for HTTP POST requests only
 * The `Express` app would match this route as:
 * /admin/add-product for HTTP POST requests only
*/
router.post('/add-product', (request, response, next) => {
  console.log('request body: ', request.body);
  const { title } = request.body;

  if (title !== '') {
    products.push({ title });

    console.log('products: ', products);
  }
  /**
   * Using the `redirect()` method of the `response` object to
   * terminate the request-response cycle and redirect the client
   * to different url
  */
  response.redirect('/');
});

/**
 * Exporting the `router` object to make it
 * available to the `Express` app
*/
module.exports = router;
