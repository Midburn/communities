/**
 * Export dictionery for controller singletons.
 * @type {{}}
 */
const AuthController = require ('./auth');
const SparkCampsController = require ('./sparkCamps');
const ConfigurationsController = require ('./configurations');
const SparkEventsController = require ('./sparkEvents');
const AuditController = require ('./audit');
const SparkUsersController = require ('./sparkUsers');
const AllocationsController = require ('./allocations');
const PermissionsController = require ('./permissions');
const GroupsController = require ('./groups');
const RequestsController = require ('./requests');

module.exports = {
  auth: new AuthController (),
  sparkCamps: new SparkCampsController (),
  configurations: new ConfigurationsController (),
  sparkEvents: new SparkEventsController (),
  audit: new AuditController (),
  users: new SparkUsersController (),
  allocations: new AllocationsController (),
  permissions: new PermissionsController (),
  groups: new GroupsController (),
  requests: new RequestsController (),
};
