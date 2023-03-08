const fs = require('fs');
const path = require('path');

const removeFile = filePath => {
  filePath = path.join(__dirname, '..', filePath);

  fs.unlink(filePath, error => console.log('An error occurred while deleting uploaded file'));
};

module.exports = removeFile;