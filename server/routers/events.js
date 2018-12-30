const Router = require('express').Router;
const controllers = require('../controllers');

module.exports = class CampsRouter {

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
         * E.G - /api/VERSION/spark/camps/open
         */
        this.router.get('/spark/events/:id', controllers.sparkEvents.getEvent);
    }
};
