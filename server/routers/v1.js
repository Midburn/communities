const Router = require ('express').Router;
const AuthRouter = require ('./auth');
const CampsRouter = require ('./camps');
const ConfigurationsRouter = require ('./configurations');
const EventsRouter = require ('./events');
const AuditRouter = require ('./audit');
const UserRouter = require ('./users');
const AllocationsRouter = require ('./allocations');
const PermissionsRouter = require ('./permissions');
const GroupsRouter = require ('./groups');
const RequestRouter = require ('./requests');

module.exports = class V1Router {
  constructor () {
    this.router = new Router ();
    this.auth = new AuthRouter ();
    this.camps = new CampsRouter ();
    this.configurations = new ConfigurationsRouter ();
    this.events = new EventsRouter ();
    this.audit = new AuditRouter ();
    this.users = new UserRouter ();
    this.allocations = new AllocationsRouter ();
    this.permissions = new PermissionsRouter ();
    this.groups = new GroupsRouter ();
    this.requests = new RequestRouter ();
    this.VERSION = '/v1';
    this.initMiddleware ();
    this.initRoutes ();
  }

  initMiddleware () {
    // Version Router level middlewares
  }

  initRoutes () {
    this.router.use (this.VERSION, this.auth.router);
    this.router.use (this.VERSION, this.camps.router);
    this.router.use (this.VERSION, this.configurations.router);
    this.router.use (this.VERSION, this.events.router);
    this.router.use (this.VERSION, this.audit.router);
    this.router.use (this.VERSION, this.users.router);
    this.router.use (this.VERSION, this.allocations.router);
    this.router.use (this.VERSION, this.permissions.router);
    this.router.use (this.VERSION, this.groups.router);
    this.router.use (this.VERSION, this.requests.router);
  }
};
