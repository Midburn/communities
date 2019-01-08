const Sequelize = require('sequelize');
const path = require('path');
const Models = require('../../db/models');
const DBConfig = require('../../db/config');
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
        const db_name = process.env.MYSQL_DB_NAME || 'theme_and_arts';
        const envConfig = process.env.NODE_ENV === 'production' ? DBConfig.production : DBConfig.development;
        this.sequelize = new Sequelize(envConfig);
    }

    async initModels() {
        this.Audits = await Models.Audits(this.sequelize, Sequelize);
        this.Allocations = await Models.Allocations(this.sequelize, Sequelize);
        this.Permissions = await Models.Permissions(this.sequelize, Sequelize);
        this.LoggedUsers = await Models.LoggedUsers(this.sequelize, Sequelize);
        // DO NOT USE FORCE TRUE - this will recreate the data base
        await this.sequelize.sync({ force: false });
    }

}

module.exports = new DatabaseService();
