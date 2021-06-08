const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'yourPassword',
  database: 'yourDBName',
})

module.exports = connection;
