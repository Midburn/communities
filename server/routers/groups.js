const Router = require('express').Router;
const controllers = require('../controllers');

module.exports = class GroupRouter {

    constructor() {
        this.router = new Router();
        this.controller = controllers.groups;
        this.initMiddleware();
        this.initRoutes();
    }

    initMiddleware() {
        // Version Router level middlewares
    }

    initRoutes() {
        /**
         * Get all groups
         * E.G - /api/VERSION/group/
         */
        this.router.route('/group')
            .get(this.controller.getGroups);

    }
};
