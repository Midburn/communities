const Router = require('express').Router;
const controllers = require('../controllers');

module.exports = class AuthRouter {

    constructor() {
        this.router = new Router();
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
        this.router.get('/user', controllers.auth.getUser);
    }
};
