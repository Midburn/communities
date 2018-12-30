const services = require('../services');
const GenericResponse = require('../../models/generic-response');
const constants = require('../../models/constants');

module.exports = class SparkEventsController {

    constructor() {
        this.config = services.config;
        this.spark = services.spark;
        this.getEvent = this.getEvent.bind(this);
    }

    async getEvent(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Must specify event id when fetching event');
            }
            const event = (await this.spark.get(`events/${req.params.id}`, req.headers)).data;
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, event));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error(`Failed getting event id - ${req.params.id} ${e.stack}`)));
        }
    }
};
