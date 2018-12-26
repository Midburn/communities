/**
 * Export dictionery for controller singletons.
 * @type {{}}
 */
const AuthController = require('./auth');
const SparkCampsController = require('./sparkCamps');

module.exports = {
    auth: new AuthController(),
    sparkCamps: new SparkCampsController()
};
