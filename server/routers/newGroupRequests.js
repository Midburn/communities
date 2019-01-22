const Router = require('express').Router;
const controllers = require('../controllers');

module.exports = class NewGroupRequestRouter {

    constructor() {
        this.router = new Router();
        this.controller = controllers.newGroupRequests;
        this.initMiddleware();
        this.initRoutes();
    }

    initMiddleware() {
        // Version Router level middlewares
    }

    initRoutes() {
        /**
         * Get all groups
         * E.G - /api/VERSION/new_group_request/
         */
        this.router.route('/new_group_request')
            .get(this.controller.getNewGroupRequests);

    }
};
