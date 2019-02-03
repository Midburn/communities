/**
 * Export dictionery for services singletons.
 * @type {{}}
 */
const configService = require('./config'),
    sparkService = require('./spark'),
    dbService = require('./database'),
    permissionsService = require('./permissions'),
    initialLogin = require('./initial-login'),
    allocations = require('./allocations');

module.exports = {
    config: configService,
    spark: sparkService,
    db: dbService,
    permissions: permissionsService,
    initialLogin: initialLogin,
    allocations
};
