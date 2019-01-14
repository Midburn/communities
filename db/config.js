require('dotenv').config();

const pool = {
    max: 5,
    min: 0,
    idle: 20000,
    acquire: 20000
} 
module.exports = {
    development: {
        username: 'root',
        password: 'root',
        database: 'theme_and_arts',
        host: 'localhost',
        dialect: 'mysql',
        logging: process.env.MYSQL_DB_LOGGING,
        pool
    },
    production: {
        username: process.env.MYSQL_DB_USERNAME,
        port: process.env.MYSQL_DB_PORT,
        password: process.env.MYSQL_DB_PASSWORD,
        database: process.env.MYSQL_DB_NAME,
        host: process.env.MYSQL_DB_NAME,
        dialect: 'mysql',
        logging: process.env.MYSQL_DB_LOGGING,
        pool
    }
};