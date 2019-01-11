const services = require('../services');
const GenericResponse = require('../../models/generic-response');
const constants = require('../../models/constants');

module.exports = class PermissionsController {

    constructor() {
        this.config = services.config;
        this.permissions = services.permissions;
        this.addPermission = this.addPermission.bind(this);
        this.getPermissionsRelatedToEntity = this.getPermissionsRelatedToEntity.bind(this);
        this.revokePermission = this.revokePermission.bind(this);
        this.getUsersPermissions = this.getUsersPermissions.bind(this);
    }

    async getUsersPermissions(req, res, next) {
        try {
            if (!req.body.ids) {
                throw new Error('Must specify ids in request body for permissions');
            }
            const permissions = await this.permissions.getPermissionsForUsers(req.body.ids);
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, { permissions }));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error(`Failed fetching permissions- ${e.stack}`)));
        }
    }

    async addPermission(req, res, next) {
        try {
            await this.permissions.addPermissionForUser(req.body);
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, { success: true }));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error(`Failed adding permissions- ${e.stack}`)));
        }
    }

    async getPermissionsRelatedToEntity(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Must specify ids in request body for permissions');
            }
            const permissions = await this.permissions.getPermissionsRelatedToEntity(req.params.id);
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, { permissions }));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error(`Failed adding permissions- ${e.stack}`)));
        }
    }

    async revokePermission(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Must specify id permissions revoking');
            }
            await this.permissions.revokePermissionPermissionForUser(req.params.id);
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, { success: true }));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error(`Failed adding permissions- ${e.stack}`)));
        }
    }
};
