const express = require('express');

const path = require('path');
/**
 * Using the `path` module to create a custom
 * utility function that resolves to the root
 * directory
*/
const rootDir = require('../utils/path');

const { pageStart, pageEnd, products } = require('../constants');

const router = express.Router();

router.get('/', (request, response, next) => {
  console.log('Middleware 3');
  // bodyContent = `
  //   <h1>Hello from Express.js 👋</h1>

  //   <h2>Product list:</h2>
  //   ${products.length ? `
  //   <ul>
  //     ${products.map(product => `<li>${product}</li>`).join('')}
  //   </ul>` : `
  //   <p>Sorry, there are no products.</p>
  //   <p>Click <a href="/admin/add-product">here</a> add a new product.</p>`}
  // `;

  // const htmlPage = `
  //   ${pageStart}

  //   ${bodyContent}
    
  //   ${pageEnd}
  // `;

  /**
   * Using the `send()` method of the `response` object to
   * terminate the request-response cycle and send a response
   * to the client
  */
  // response.send(htmlPage);

  /**
   * Using the `sendFile()` method of the `response` object to
   * terminate the request-response cycle and send an HTML file
   * to the client. We used the `path` module provided by Node JS
   * to contruct the path of the HTML file we want to serve. The
   * `join()` method takes the different segment of the path to be
   * contructed where `__dirname` resolves to the absolute path of
   * the file where it was called
  */
  // response.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
  response.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;
