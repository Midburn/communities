const Sequelize = require('sequelize');
const path = require('path');

// Load environment variables default values
require('dotenv').config();
class DatabaseService {
    initDatabase() {
        const db_name = process.env.MYSQL_DB_NAME || 'dev_camps_arts';
        const sequelize = new Sequelize({
            dialect:    "mysql",
            host:       process.env.MYSQL_DB_HOST || 'localhost',
            port:       process.env.MYSQL_DB_PORT || '3306',
            username:   process.env.MYSQL_DB_USERNAME || 'root',
            password:   process.env.MYSQL_DB_PASSWORD || 'admin',
            database:   db_name,
            modelPaths: [path.join(__dirname + "/models")]
        });
        console.log('Attempting to connect to MYSQL DB: ', db_name)
        sequelize.authenticate()
        .then(() => {
            console.log('Sequelize MYSQL connection has been established successfully.');
        })
        .catch(err => {
            console.error('Sequelize error: unable to connect to the MYSQL database:', err);
        });
        return sequelize;
    }

}

module.exports = new DatabaseService();
