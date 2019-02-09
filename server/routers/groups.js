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
         * all groups actions
         * E.G - POST/GET/PUT /api/VERSION/group/
         */
        this.router.route('/group')
            .get(this.controller.getGroups)
            .post(this.controller.createGroups)
            .put(this.controller.updateGroups);
        /**
         * groups members actions
         * E.G - POST/DELETE /api/VERSION/group/1/members
         */
        this.router.route('/group/:groupId/members')
            .post(this.controller.addGroupMembers)
            .delete(this.controller.removeGroupMembers)
    }
};
