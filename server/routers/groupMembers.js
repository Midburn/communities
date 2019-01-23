const Router = require('express').Router;
const controllers = require('../controllers');

module.exports = class GroupMemberRouter {

    constructor() {
        this.router = new Router();
        this.controller = controllers.groupMembers;
        this.initMiddleware();
        this.initRoutes();
    }

    initMiddleware() {
        // Version Router level middlewares
    }

    initRoutes() {
        /**
         * Get group members by grou ID
         * E.G - /api/VERSION/group_member/425
         */
        this.router.route('/group_member/:group_id')
            .get(this.controller.getGroupMembers);

    }
};
