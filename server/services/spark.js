const configService = require('./config');
const axios = require('axios');

class SparkService {

    get(url, headers) {
        return axios.get(this.createFullUrl(url), { withCredentials: true, headers: {cookie: headers.cookie} });
    }

    post(url, body, headers) {
        return axios.post(this.createFullUrl(url), body, { withCredentials: true, headers: {cookie: headers.cookie} });
    }

    put(url, body, headers) {
        return axios.get(this.createFullUrl(url), body, { withCredentials: true, headers: {cookie: headers.cookie} });
    }

    createFullUrl(url) {
        const HOST = ['production', 'staging'].includes(process.env.NODE_ENV) ? 'http;//spark:3000' : configService.SPARK_HOST;
        return `${HOST}/${url}`;
    }

}

module.exports = new SparkService();
