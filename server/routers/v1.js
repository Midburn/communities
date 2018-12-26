const Router = require('express').Router;
const AuthRouter = require('./auth');
const CampsRouter = require('./camps');
const ConfigurationsRouter = require('./configurations');

module.exports = class V1Router {


    constructor() {
        this.router = new Router();
        this.auth = new AuthRouter();
        this.camps = new CampsRouter();
        this.configurations = new ConfigurationsRouter();
        this.VERSION = '/v1';
        this.initMiddleware();
        this.initRoutes();
    }

    initMiddleware() {
        // Version Router level middlewares
    }

    initRoutes() {
        this.router.use(this.VERSION, this.auth.router);
        this.router.use(this.VERSION, this.camps.router);
        this.router.use(this.VERSION, this.configurations.router);
    }
};
