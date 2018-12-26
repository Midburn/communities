const services = require('../services');
const GenericResponse = require('../models/generic-response');
const constants = require('../models/constants');

module.exports = class SparkCampsController {

    constructor() {
        this.config = services.config;
        this.spark = services.spark;
        this.getOpenCamps = this.getOpenCamps.bind(this);
        this.getCampMembers = this.getCampMembers.bind(this);
    }

    async getOpenCamps(req, res, next) {
        try {
            const campList = (await this.spark.get(`camps`, req.headers)).data;
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, campList));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error('Failed getting open camps')));
        }
    }

    async getCampMembers(req, res, next) {
        try {
            const members = (await this.spark.get(`camps/${req.params.id}/members`, req.headers)).data;
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, members));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error('Failed getting camp members')));
        }
    }
};
