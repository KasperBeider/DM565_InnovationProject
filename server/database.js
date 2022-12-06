const mysql = require('mysql')

module.exports = mysql.createConnection( {
    host: '35.205.45.155',
    user: 'dm565actor',
    password: 'dm565actor',
    database: 'innovation_project'
} )
