/**
 * Export dictionery for controller singletons.
 * @type {{}}
 */
const AuthController = require('./auth');
const SparkCampsController = require('./sparkCamps');
const ConfigurationsController = require('./configurations');

module.exports = {
    auth: new AuthController(),
    sparkCamps: new SparkCampsController(),
    configurations: new ConfigurationsController()
};
