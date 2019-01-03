require('dotenv').config();

module.exports = {
    development: {
        username: 'root',
        password: '',
        database: 'dev_camps_arts',
        host: 'localhost',
        dialect: 'mysql'
    },
    production: {
        username: process.env.MYSQL_DB_USERNAME,
        port: process.env.MYSQL_DB_PORT,
        password: process.env.MYSQL_DB_PASSWORD,
        database: process.env.MYSQL_DB_NAME,
        host: process.env.MYSQL_DB_NAME,
        dialect: 'mysql'
    }
};