const services = require('../services');
const GenericResponse = require('../../models/generic-response');
const constants = require('../../models/constants');

module.exports = class RequestsController {

    constructor() {
        this.config = services.config;
        this.getRequests = this.getRequests.bind(this);
    }

    async getRequests(req, res, next) {
        try {
            const requests = await services.db.Requests.findAll();
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, { requests }));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error(`Failed fetching requests- ${e.stack}`)));
        }
    }

};
