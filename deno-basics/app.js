// const fs = require('fs').promises;

// const text = 'This text will be stored in a file using Node';

// fs.writeFile('node-message.txt', text).then(() => {
//   console.log('Text written to file with Node');
// });

const http = require('http');

const server = http.createServer((request, response) => {
  response.end('Hello world');
});

server.listen(3000);
