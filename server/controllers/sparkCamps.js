const services = require('../services');
const GenericResponse = require('../../models/generic-response');
const constants = require('../../models/constants');

module.exports = class SparkCampsController {

    constructor() {
        this.config = services.config;
        this.spark = services.spark;
        this.getOpenCamps = this.getOpenCamps.bind(this);
        this.getCampMembers = this.getCampMembers.bind(this);
        this.getOpenArts = this.getOpenArts.bind(this);
        this.getUsersGroups = this.getUsersGroups.bind(this);
        this.getAllByType = this.getAllByType.bind(this);
        this.getCampMembersCount = this.getCampMembersCount.bind(this);
        this.getCampMembersTickets = this.getCampMembersTickets.bind(this);
        this.getCamp = this.getCamp.bind(this);
    }

    async getCamp(req, res, next) {
        try {
            const camp = (await this.spark.get(`camps/${req.params.id}/get`, req.headers)).data;
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, camp));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error('Failed getting open camps')));
        }
    }

    async getOpenCamps(req, res, next) {
        try {
            const campList = (await this.spark.get(`camps_open`, req.headers)).data;
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, campList));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error('Failed getting open camps')));
        }
    }

    async getOpenArts(req, res, next) {
        try {
            const artList = (await this.spark.get(`camps/arts`, req.headers)).data;
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, artList));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error('Failed getting open camps')));
        }
    }

    async getCampMembers(req, res, next) {
        try {
            let path = `camps/${req.params.id}/members`;
            if (req.query.eventId) {
                path += `?eventId=${req.query.eventId}`;
            }
            const members = (await this.spark.get(path, req.headers)).data;
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, members));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error('Failed getting camp members')));
        }
    }

    async getCampMembersCount(req, res, next) {
        try {
            const members = (await this.spark.get(`camps/${req.params.id}/members/count`, req.headers)).data;
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, members));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error('Failed getting camp members')));
        }
    }

    async getCampMembersTickets(req, res, next) {
        try {
            let path = `camps/${req.params.id}/members/tickets`;
            if (req.query.eventId) {
                path += `?eventId=${req.query.eventId}`;
            }
            const members = (await this.spark.get(path, req.headers)).data;
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, members));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error('Failed getting camp members')));
        }
    }

    async getUsersGroups(req, res, next) {
        try {
            let path = `my_groups`;
            if (req.query.eventId) {
                path += `?eventId=${req.query.eventId}`;
            }
            const groups = (await this.spark.get(path, req.headers)).data;
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, groups));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error('Failed getting camp members')));
        }
    }

    async getAllByType(req, res, next) {
        try {
            let path = '';
            switch (req.params.type) {
                case constants.GROUP_TYPES.CAMP:
                    path = 'camps_all';
                    break;
                case constants.GROUP_TYPES.ART:
                    path = 'art_all';
                    break;
                default:
                    throw new Error('You must specify type when fetching all camps/arts');
            }
            if (req.query.eventId) {
                path += `?eventId=${req.query.eventId}`;
            }
            const groups = (await this.spark.get(path, req.headers)).data;
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, groups.camps));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error('Failed getting camp members')));
        }
    }
};
