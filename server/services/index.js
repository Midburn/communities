/**
 * Export dictionery for services singletons.
 * @type {{}}
 */
const ConfigService = require('./config');

module.exports = {
    config: new ConfigService()
};
