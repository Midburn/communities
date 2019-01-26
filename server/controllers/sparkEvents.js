const services = require('../services');
const GenericResponse = require('../../models/generic-response');
const constants = require('../../models/constants');

module.exports = class SparkEventsController {

    constructor() {
        this.config = services.config;
        this.spark = services.spark;
        this.getEvent = this.getEvent.bind(this);
        this.changeEvent = this.changeEvent.bind(this);
    }

    async getEvent(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Must specify event id when fetching event');
            }
            const event = (await this.spark.get(`events/${req.params.id}`, req)).data;
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, event));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error(`Failed getting event id - ${req.params.id} ${e.stack}`)));
        }
    };

    async changeEvent(req, res, next) {
        try {
            if (!req.body.currentEventId) {
                throw new Error('Must specify event id when changing event');
            }
            await this.spark.post(`events/change`, { currentEventId: req.body.currentEventId }, req);
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, {}));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error(`Failed changing event id - ${req.params.id} ${e.stack}`)));
        }
    };
};
