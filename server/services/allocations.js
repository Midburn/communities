const configService = require('./config');
const axios = require('axios');

class AllocationsService {

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
        const HOST = ['production', 'staging'].includes(process.env.NODE_ENV) ? 'http://allocations:3000' : configService.ALLOCATIONS_SERVER_HOST;
        return `${HOST}/${url}`;
    }

    getHeadersFromRequest(req) {
        return { SECRET: configService.SECRET};
    }

}

module.exports = new AllocationsService();
