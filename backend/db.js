const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'asset_borrowing',
    port:3306,
});

module.exports = connection;