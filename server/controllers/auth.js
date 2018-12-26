const jwt = require('jsonwebtoken');
const services = require('../services');
const GenericResponse = require('../../models/generic-response');
const constants = require('../../models/constants');

module.exports = class AuthController {

    constructor() {
        this.config = services.config;
        this.spark = services.spark;
        this.getUser = this.getUser.bind(this);
    }

    async getUser(req, res, next) {
        try {
            const baseData = jwt.verify(req.cookies[this.config.JWT_KEY].token, this.config.SECRET);
            const user = (await this.spark.get(`users/email/${baseData.email}`, req.headers)).data;
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, { user, currentEventId: req.cookies[this.config.JWT_KEY].currentEventId}));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error('Failed getting logged user')));
        }
    }
};
