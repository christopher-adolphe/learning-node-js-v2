// const mysql = require('mysql2');

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: 'root',
//   database: 'online_shop',
//   socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
// });

// module.exports = pool.promise();

const { Sequelize } = require('sequelize');

/**
 * Creating an instance of Sequelize and
 * initializing it with the database name,
 * user and password
 */
const sequelize = new Sequelize('online_shop', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  dialectOptions: {
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
  },
});

module.exports = sequelize;
