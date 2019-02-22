const db = require('./database'),
    Sequelize = require('sequelize'),
 schedule = require('node-schedule');
class SparkSync {

    async getSparkDb () {
        const sparkConfig = {
            username: process.env.SPARK_DB_USER || 'spark',
            password: process.env.SPARK_DB_PASSWORD || 'spark',
            database: process.env.SPARK_DB_DBNAME || 'spark',
            host: process.env.SPARK_DB_HOSTNAME || process.env.SPARK_DB_HOSTNAME || ['staging', 'production'].includes(process.env.NODE_ENV)
                ? 'sparkdb'
                : 'localhost',
            dialect: 'mysql',
            logging: false
        };
        console.log (
            `Connecting to spark db with config - ${JSON.stringify (sparkConfig)}`
        );
        const db = {};
        db.sequelize = new Sequelize (sparkConfig);
        return db;
    }

    async getSparkData (sparkDb, tables) {
        const results = {};
        for (const tableName of tables) {
            results[
                tableName
                ] = await sparkDb.sequelize.query (`SELECT * FROM \`${tableName}\``, {
                type: sparkDb.sequelize.QueryTypes.SELECT,
            });
        }
        return results;
    }

    getUserName (user) {
        let name;
        if (user.first_name && user.last_name) {
            name = `${user.first_name} ${user.last_name}`;
            return name;
        }
        try {
            const drupalData = JSON.parse (user.addinfo_json).drupal_data.address;
            const {first_name, last_name} = drupalData;
            name = `${first_name} ${last_name}`;
            return name;
        } catch (e) {
            name = ' ';
            return name;
        }
    }

    initSync() {
        this.schedule = schedule.scheduleJob('*/30 * * * *', this.syncUsersCommonData.bind(this));
    }

    async syncUsersCommonData() {
        console.log('Starting users sync...');
        try {
            const sparkDb = await this.getSparkDb();
            const sparkData = await this.getSparkData (sparkDb, ['users']);
            for (const user of sparkData.users) {
                try {

                    await db.GroupMembers.update({
                        cell_phone: user.cell_phone,
                        name: this.getUserName(user),
                        email: user.email
                    }, {where: { user_id: user.user_id }})
                } catch (e) {
                }
            }
        } catch (e) {
            console.warn(`Error syncing spark data - ${e.stack}`);
        }
    }

}

module.exports = new SparkSync();
