const Sequelize = require('sequelize');
const path = require('path');
const Models = require('../../db/models');
const config = require('../../db/config')

// Load environment variables default values
require('dotenv').config();

class DatabaseService {

    constructor() {
        this.init();
    }

    init() {
        this.initsequelize();
        try {
            this.initModels();
        } catch (e) {
            console.error('Error syncing db models - have you ran all migration?');
            console.error(e.stack);
        }
    }

    initsequelize() {
        const db_name = process.env.MYSQL_DB_NAME || 'dev_camps_arts';
        this.sequelize = new Sequelize({
            dialect: 'mysql',
            host: process.env.MYSQL_DB_HOST || 'localhost',
            port: process.env.MYSQL_DB_PORT || '3306',
            username: process.env.MYSQL_DB_USERNAME || 'root',
            password: process.env.MYSQL_DB_PASSWORD || 'admin',
            database: db_name,
            modelPaths: [path.join(__dirname + "../../db/models")]
        });
    }

    async initModels() {
        this.Audits = await Models.Audits(this.sequelize, Sequelize);
        this.Groups = await Models.Groups(this.sequelize, Sequelize);
        this.GroupMembers = await Models.GroupMembers(this.sequelize, Sequelize);
        // DO NOT USE FORCE TRUE - this will recreate the data base
        await this.sequelize.sync({ force: false });
    }

}

module.exports = new DatabaseService();
