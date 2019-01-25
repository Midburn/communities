const jwt = require('jsonwebtoken');
const services = require('../services');
const GenericResponse = require('../../models/generic-response');
const constants = require('../../models/constants');
const axios = require('axios');
module.exports = class AuthController {

    constructor() {
        this.config = services.config;
        this.spark = services.spark;
        this.initialLogin = services.initialLogin;
        this.getUser = this.getUser.bind(this);
    }

    async getUser(req, res, next) {
        const baseData = jwt.verify(req.cookies[this.config.JWT_KEY].token, this.config.SECRET);
        const user = (await this.spark.get(`users/email/${baseData.email}`, req.headers)).data;
        const userWithAxios = (await axios.get(`${this.config.SPARK_HOST}/users/email/${baseData.email}`, req.headers)).data;
        const sparkios = axios.create({baseURL: this.config.SPARK_HOST});
        const userWithSparkios = (await sparkios.get(`${this.config.SPARK_HOST}/users/email/${baseData.email}`, req.headers)).data;
        try {
            await this.initialLogin.initUser(user, req.headers);
            user.permissions = await services.permissions.getPermissionsForUsers([user.user_id]);
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, { user, currentEventId: req.cookies[this.config.JWT_KEY].currentEventId}));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, {error: e.stack, baseData, user, userWithSparkios, userWithAxios}));
        }
    }
};
