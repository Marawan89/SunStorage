const mysql = require('mysql2');

const connection = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: '',
   database: 'sunstorage'
 });

 module.exports = connection.promise(); // non ho ben capito a cosa serve ma ho visto che serve ovunque chiedi a luca