const Router = require('express').Router;
const controllers = require('../controllers');
const constants = require('../../models/constants');
const services = require('../services');

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
            .post(services.permissions.checkUserPermission(
                constants.PERMISSION_TYPES.ALLOCATE_PRESALE_TICKET,
                constants.ENTITY_TYPE.GROUP,
                (req) => req.body.related_group), this.controller.allocate);
        /**
         * remove allocation
         * E.G - DELETE /api/VERSION/allocations
         */
        this.router.route('/allocations/:id')
            .delete(services.permissions.checkUserPermission(
                constants.PERMISSION_TYPES.ALLOCATE_PRESALE_TICKET,
                constants.ENTITY_TYPE.GROUP,
                (req) => req.body.related_group), this.controller.removeAllocation);
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
