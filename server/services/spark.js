const configService = require('./config');
const axios = require('axios');

class SparkService {

    get(url, req) {
        return axios.get(this.createFullUrl(url), { withCredentials: true, headers: this.getHeadersFromRequest(req)});
    }

    post(url, body, req) {
        return axios.post(this.createFullUrl(url), body, { withCredentials: true, headers: this.getHeadersFromRequest(req) });
    }

    put(url, body, req) {
        return axios.get(this.createFullUrl(url), body, { withCredentials: true, headers: this.getHeadersFromRequest(req) });
    }

    createFullUrl(url) {
        const HOST = ['production', 'staging'].includes(process.env.NODE_ENV) ? 'http://spark:3000' : configService.SPARK_HOST;
        return `${HOST}/${url}`;
    }

    getHeadersFromRequest(req) {
        const headers = {
            cookie: req.headers.cookie,
            SECRET: configService.SECRET,
        };
        if (req.cookies[configService.JWT_KEY]) {
            headers.token = req.cookies[configService.JWT_KEY].token
        }
        return headers;
    }

}

module.exports = new SparkService();
