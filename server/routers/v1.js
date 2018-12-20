const Router = require('express').Router;
const AuthRouter = require('./auth');

module.exports = class V1Router {

    constructor() {
        this.router = new Router();
        this.auth = new AuthRouter();
        this.initMiddleware();
        this.initRoutes();
    }

    initMiddleware() {
        // Version Router level middlewares
    }

    initRoutes() {
        this.router.use('/v1', this.auth.router);
    }
};
