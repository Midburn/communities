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
        let baseData, user, userWithAxios, userWithAxiosLocalSpark, sparkios, userWithSparkios;
        try {
             baseData = jwt.verify(req.cookies[this.config.JWT_KEY].token, this.config.SECRET);
             user = (await this.spark.get(`users/email/${baseData.email}`, req.headers)).data;
             userWithAxios = (await axios.get(`${this.config.SPARK_HOST}/users/email/${baseData.email}`, { withCredentials: true, headers: req.headers})).data;
             userWithAxiosLocalSpark = (await axios.get(`http://spark:3000/users/email/${baseData.email}`, { withCredentials: true, headers: req.headers})).data;
             sparkios = axios.create({baseURL: this.config.SPARK_HOST});
             userWithSparkios = (await sparkios.get(`${this.config.SPARK_HOST}/users/email/${baseData.email}`, { withCredentials: true, headers: req.headers})).data;
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, {error: e.stack}));
        }
       try {
            await this.initialLogin.initUser(user, req.headers);
            user.permissions = await services.permissions.getPermissionsForUsers([user.user_id]);
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, { user, currentEventId: req.cookies[this.config.JWT_KEY].currentEventId}));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, {error: e.stack, userWithAxiosLocalSpark, baseData, user, userWithSparkios, userWithAxios}));
        }
    }
};
