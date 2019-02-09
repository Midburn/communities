const jwt = require('jsonwebtoken');
const services = require('../services');
const GenericResponse = require('../../models/generic-response');
const constants = require('../../models/constants');

module.exports = class AuthController {
    constructor() {
        this.config = services.config;
        this.spark = services.spark;
        this.initialLogin = services.initialLogin;
        this.getUser = this.getUser.bind(this);
    }

    async getUser(req, res, next) {
        let baseData, user;
       try {
            const token = req.cookies[this.config.JWT_KEY].token;
            baseData = jwt.verify(token, this.config.SECRET);
            if (!baseData.email) {
                throw new Error('Np mail specified');
            }
            user = (await this.spark.get(`users/email/${baseData.email}`, req)).data;
            await this.initialLogin.initUser(user, req);
            user.permissions = await services.permissions.getPermissionsForUsers([user.user_id]);
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, { user, currentEventId: req.cookies[this.config.JWT_KEY].currentEventId}));
        } catch (e) {
            console.log(e.stack)
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, {error: e.stack, baseData, user}));
        }
    }
};
