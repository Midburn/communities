
class SparkSync {
    async getSparkDb () {
        const sparkConfig = {
            username: process.env.SPARK_DB_USER || 'spark',
            password: process.env.SPARK_DB_PASSWORD || 'spark',
            database: process.env.SPARK_DB_DBNAME || 'spark',
            host: process.env.SPARK_DB_HOSTNAME || process.env.SPARK_DB_HOSTNAME || isLocal
                ? 'localhost'
                : 'sparkdb',
            dialect: 'mysql',
        };
        console.log (
            `Connecting to spark db with config - ${JSON.stringify (sparkConfig)}`
        );
        const db = {};
        db.sequelize = new Sequelize (config);
        return db;
    }

    initSync() {

    }

    async syncUsersCommonData() {
        try {
            const sparkDb = await this.getSparkDb();
            const sparkData = await getSparkData (sparkDb, ['users']);
            await this.findOrCreate({
                where: findWhereMap,
                defaults: findWhereMap
            })
                .spread(function(newObj, created) {
                    // set:
                    for(var key in newValuesMap) {
                        newObj[key] = newValuesMap[key];
                    }

                    return newObj.save();
                });
        } catch (e) {
            console.warn(`Error syncing spark data - ${e.stack}`);
        }
    }

}

module.exports = new SparkSync();
