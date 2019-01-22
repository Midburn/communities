const services = require('../services');
const GenericResponse = require('../../models/generic-response');
const constants = require('../../models/constants');

module.exports = class NewGroupRequestsController {

    constructor() {
        this.config = services.config;
        this.getNewGroupRequests = this.getNewGroupRequests.bind(this);
    }

    async getNewGroupRequests(req, res, next) {
        try {
            const requests = await services.db.NewGroupRequests.findAll();
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, { requests }));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error(`Failed fetching requests- ${e.stack}`)));
        }
    }

};
