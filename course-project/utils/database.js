const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'online_shop',
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

module.exports = pool.promise();
