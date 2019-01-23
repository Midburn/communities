const services = require('../services');
const GenericResponse = require('../../models/generic-response');
const constants = require('../../models/constants');

module.exports = class GroupsController {

    constructor() {
        this.config = services.config;
        this.getGroups = this.getGroups.bind(this);
    }

    async getGroups(req, res, next) {
        try {
            const groups = await services.db.Groups.findAll();
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, { groups }));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error(`Failed fetching groups- ${e.stack}`)));
        }
    }

};
