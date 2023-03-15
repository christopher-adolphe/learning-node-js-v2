// const fs = require('fs');
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const responseHandler = (req, res, next) => {
  // fs.readFile('my-page.html', 'utf8', (err, data) => {
  //   res.send(data);
  // });

  // res.sendFile(path.join(__dirname, 'my-page.html'));

  fs.readFile('my-page.html', 'utf8')
    .then(data => res.send(data))
    .catch(error => console.log(error));
};

// module.exports = responseHandler;
export default responseHandler;
