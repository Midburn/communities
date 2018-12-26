const Router = require('express').Router;
const controllers = require('../controllers');

module.exports = class ConfigurationsRouter {

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
         * E.G - /api/VERSION/configurations
         */
        this.router.get('/configurations', controllers.configurations.getConfigurations);
    }
};
