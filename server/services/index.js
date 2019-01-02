/**
 * Export dictionery for services singletons.
 * @type {{}}
 */
const configService = require('./config'),
    sparkService = require('./spark'),
    dbService = require('./database');

module.exports = {
    config: configService,
    spark: sparkService,
    db: dbService
};
