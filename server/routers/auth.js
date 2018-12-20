const Router = require('express').Router();
const controllers = require('../controllers');

export class AuthRouter {

    constructor() {
        this.router = Router();
        this.initMiddleware();
        this.initRoutes();
    }

    initMiddleware() {
        // Version Router level middlewares
    }

    initRoutes() {
        /**
         * E.G - /api/VERSION/login
         */
        this.router.use('/login', controllers.auth.login);
    }
}