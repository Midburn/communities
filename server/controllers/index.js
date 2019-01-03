/**
 * Export dictionery for controller singletons.
 * @type {{}}
 */
const AuthController = require('./auth');
const SparkCampsController = require('./sparkCamps');
const ConfigurationsController = require('./configurations');
const SparkEventsController = require('./sparkEvents');
const AuditController = require('./audit');
const SparkUsersController = require('./sparkUsers');

module.exports = {
    auth: new AuthController(),
    sparkCamps: new SparkCampsController(),
    configurations: new ConfigurationsController(),
    sparkEvents: new SparkEventsController(),
    audit: new AuditController(),
    users: new SparkUsersController()
};
