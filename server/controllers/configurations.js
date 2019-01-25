const services = require('../services');
const GenericResponse = require('../../models/generic-response');
const constants = require('../../models/constants');

module.exports = class ConfigurationsController {

    constructor() {
        this.config = services.config;
        this.getConfigurations = this.getConfigurations.bind(this);
    }

    /**
     * Get client side configurations (Spark Host etc...)
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async getConfigurations(req, res, next) {
        try {
            const SPARK_HOST = this.config.SPARK_HOST;
            return next(new GenericResponse(constants.RESPONSE_TYPES.JSON, { SPARK_HOST }));
        } catch (e) {
            return next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error(`Failed getting configurations ${e.stack}`)));
        }
    }
};
