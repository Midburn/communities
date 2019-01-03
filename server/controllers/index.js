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
const AllocationsController = require('./allocations');

module.exports = {
    auth: new AuthController(),
    sparkCamps: new SparkCampsController(),
    configurations: new ConfigurationsController(),
    sparkEvents: new SparkEventsController(),
    audit: new AuditController(),
    users: new SparkUsersController(),
    allocations: new AllocationsController()
};
