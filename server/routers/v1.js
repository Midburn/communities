const Router = require('express').Router();
const AuthRouter = require('./auth');

export class V1Router {

    constructor() {
        this.router = Router();
        this.auth = new AuthRouter();
        this.initMiddleware();
        this.initRoutes();
    }

    initMiddleware() {
        // Version Router level middlewares
    }

    initRoutes() {
        this.router.use('/v1');
        this.router.use(this.auth.router);
    }
}