const configService = require('./config');
const axios = require('axios');

class SparkService {

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
        return `${configService.SPARK_HOST}/${url}`;
    }

}

module.exports = new SparkService();
