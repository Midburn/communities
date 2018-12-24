/**
 * Export dictionery for services singletons.
 * @type {{}}
 */
const configService = require('./config'),
    sparkService = require('./spark');

module.exports = {
    config: configService,
    spark: sparkService
};
