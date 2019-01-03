const Router = require('express').Router;
const controllers = require('../controllers');

module.exports = class AllocationsRouter {

    constructor() {
        this.router = new Router();
        this.controller = controllers.allocations;
        this.initMiddleware();
        this.initRoutes();
    }

    initMiddleware() {
        // Version Router level middlewares
    }

    initRoutes() {
        /**
         * create new allocation
         * E.G - POST /api/VERSION/allocations
         */
        this.router.route('/allocations')
            .post(this.controller.allocate);
        /**
         * remove allocation
         * E.G - DELETE /api/VERSION/allocations
         */
        this.router.route('/allocations/:id')
            .delete(this.controller.removeAllocation);
        /**
         * get allocations for certain groups
         * E.G - POST /api/VERSION/allocations/groups/:id
         */
        this.router.route('/allocations/groups')
            .post(this.controller.getGroupsAllocation);
        /**
         * get allocations for certain members
         * E.G - POST /api/VERSION/allocations/members/:id
         */
        this.router.route('/allocations/members')
            .post(this.controller.getMembersAllocations);
    }
};
