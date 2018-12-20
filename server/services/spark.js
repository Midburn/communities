const configService = require('./config');
const axios = require('axios');

class SparkService {

    constructor() {
        this.BASE_URL = configService.SPARK_HOST;
    }

    get(url, headers) {
        return axios.get(this.createFullUrl(url), { withCredentials: true, headers });
    }

    post(url, body, headers) {
        return axios.post(this.createFullUrl(url), body, { withCredentials: true, headers });
    }

    put(url, body, headers) {
        return axios.get(this.createFullUrl(url), body, { withCredentials: true, headers });
    }

    createFullUrl(url) {
        return `${this.BASE_URL}/${url}`;
    }

}

module.exports = new SparkService();
