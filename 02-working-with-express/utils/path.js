const path = require('path');

/**
 * Using the `path` module to create a custom
 * utility function that resolves to the root
 * directory. The `dirname()` method returns
 * the directory of a the path that it is
 * supplied as parameter. Here `require.main.filename`
 * outputs the path of the `app.js` file which
 * is the file responsible for the application
 * to run
*/
module.exports = path.dirname(require.main.filename);
