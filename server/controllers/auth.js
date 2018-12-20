const jwt = require('jsonwebtoken');
const services = require('../services');
const GenericResponse = require('../models/generic-response');
const constants = require('../models/constants');

module.exports = class AuthController {

    constructor() {
        this.config = services.config;
    }

    login = (req, res, next) => {
        let token = req.query.token;
        if (!token && this.config.isDevMode && this.config.LOCAL_SPARK) {
            token = jwt.sign({
                "id": 1,
                "email": "user@midburn.org",
                "iat": (new Date() / 1000) + 24 * 60 * 60,
                "exp": (new Date() / 1000) + 24 * 60 * 60
            }, this.config.SECRET);
        }

        if (!token) {
            return next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error('No token was given'), 401));
        }

        res.clearCookie(this.config.JWT_KEY);

        try {
            jwt.verify(token, this.config.SECRET);
            res.cookie(this.config.JWT_KEY, {token});
            return next(new GenericResponse(constants.RESPONSE_TYPES.STATIC));
        }
        catch (err) {
            console.log(err);
            return next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error('Invalid token')));
        }
    };
};
