const Router = require('express').Router;
const AuthRouter = require('./auth');
const CampsRouter = require('./camps');

module.exports = class V1Router {

    constructor() {
        this.router = new Router();
        this.auth = new AuthRouter();
        this.camps = new CampsRouter();
        this.initMiddleware();
        this.initRoutes();
    }

    initMiddleware() {
        // Version Router level middlewares
    }

    initRoutes() {
        this.router.use('/v1', this.auth.router);
        this.router.use('/v1', this.camps.router);
    }
};
