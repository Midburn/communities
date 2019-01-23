const Router = require('express').Router;
const controllers = require('../controllers');

module.exports = class RequestRouter {

    constructor() {
        this.router = new Router();
        this.controller = controllers.requests;
        this.initMiddleware();
        this.initRoutes();
    }

    initMiddleware() {
        // Version Router level middlewares
    }

    initRoutes() {
        /**
         * Get all groups
         * E.G - /api/VERSION/request/
         */
        this.router.route('/request')
            .get(this.controller.getRequests);

    }
};
