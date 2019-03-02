const services = require('../services');
const GenericResponse = require('../../models/generic-response');
const constants = require('../../models/constants');

module.exports = class RequestsController {

    constructor() {
        this.DEFAULT_WHERE_OPTIONS = {
            record_status: constants.DB_RECORD_STATUS_TYPES.ACTIVE,
        };
        this.config = services.config;
        this.getRequests = this.getRequests.bind(this);
        this.addRequest = this.addRequest.bind(this);
    }

    addQueryParamsToWhere (query, where) {
        const updatedWhere = {...where};
        for (const paramName in query) {
            let param;
            if (!this.metaParams.includes (paramName)) {
                param = query[paramName];
                updatedWhere[paramName] = param;
            }
        }
        return updatedWhere;
    }

    async getRequests(req, res, next) {
        const where = this.addQueryParamsToWhere (
            req.query,
            this.DEFAULT_WHERE_OPTIONS
        );
        try {
            const requests = await services.db.Requests.findAll({where});
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, { requests }));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error(`Failed fetching requests- ${e.stack}`)));
        }
    }


    async addRequest(req, res, next) {
        try {
            const result = await services.db.Requests.create(req.body);
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, { result }));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error(`Failed adding request- ${e.stack}`)));
        }
    }

};
