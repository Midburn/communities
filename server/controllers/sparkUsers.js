const services = require('../services');
const GenericResponse = require('../../models/generic-response');
const constants = require('../../models/constants');

module.exports = class SparkUsersController {

    constructor() {
        this.config = services.config;
        this.spark = services.spark;
        this.getUserNameById = this.getUserNameById.bind(this);
    }

    async getUserNameById(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Must specify event id when fetching user');
            }
            const user = (await this.spark.get(`users/${req.params.id}?nameOnly=true`, req)).data;
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, {user}));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error(`Failed getting event id - ${req.params.id} ${e.stack}`)));
        }
    };
};
