const Router = require('express').Router;
const constants = require('../../models/constants');
const controllers = require('../controllers');
const services = require('../services');

module.exports = class PermissionsRouter {

    constructor() {
        this.router = new Router();
        this.controller = controllers.permissions;
        this.initMiddleware();
        this.initRoutes();
    }

    initMiddleware() {
        // Version Router level middlewares
    }

    initRoutes() {
        /**
         * create new permission
         * E.G - POST /api/VERSION/permissions
         */
        this.router.route('/permissions')
            .post(services.permissions.checkUserPermission(
                constants.PERMISSION_TYPES.GIVE_PERMISSION,
                (req) => req.body.entity_type,
                (req) => req.body.related_entity), this.controller.addPermission);
        /**
         * remove allocation
         * E.G - DELETE /api/VERSION/permissions
         */
        this.router.route('/permissions/:id/:entityType/:entityId')
            .delete(services.permissions.checkUserPermission(
                constants.PERMISSION_TYPES.GIVE_PERMISSION,
                (req) => req.params.entityType,
                (req) => req.params.entityId), this.controller.revokePermission);
        /**
         * get allocations for certain groups
         * E.G - POST /api/VERSION/permissions/users
         */
        this.router.route('/permissions/users')
            .post(this.controller.getUsersPermissions);
        /**
         * get allocations for certain members
         * E.G - POST /api/VERSION/permissions/:id
         */
        this.router.route('/permissions/:id')
            .get(this.controller.getPermissionsRelatedToEntity);
    }
};
