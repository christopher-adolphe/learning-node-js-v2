const express = require('express');

const { pageStart, pageEnd, products } = require('../constants');

const router = express.Router();

router.get('/', (request, response, next) => {
  console.log('Middleware 3');
  bodyContent = `
    <h1>Hello from Express.js 👋</h1>

    <h2>Product list:</h2>
    ${products.length ? `
    <ul>
      ${products.map(product => `<li>${product}</li>`).join('')}
    </ul>` : `
    <p>Sorry, there are no products.</p>
    <p>Click <a href="/admin/add-product">here</a> add a new product.</p>`}
  `;

  const htmlPage = `
    ${pageStart}

    ${bodyContent}
    
    ${pageEnd}
  `;

  /**
   * Using the `send()` method of the `response` object to
   * terminate the request-response cycle and send a response
   * to the client
  */
  response.send(htmlPage);
});

module.exports = router;
