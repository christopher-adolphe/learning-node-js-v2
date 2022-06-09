// Importing the `http` core module from NodeJS
const http = require('http');

const requestHandler = require('./routes');

/*
 * Using the `createServer()` method to create a new
 * instance of the Server object
*/
// const app = http.createServer((request, response) => {
//   console.log('Incoming request: ', {
//     url: request.url,
//     method: request.method,
//     headers: request.headers
//   });
//   process.exit();
// });
const app = http.createServer(requestHandler);

/*
 * Using the `listen()` method to start the server
 * created. Then `listen()` method takes a port number
 * as parameter to listen to incoming requests
*/
app.listen(3000);
