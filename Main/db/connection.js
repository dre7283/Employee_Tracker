const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Pass#0725",
    database: "employees"
});

connection.connect(function (err) {
    if (err) throw err;
});

module.exports = connection;