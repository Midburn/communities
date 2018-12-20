const constants = require('./constants');

module.exports = class GenericResponse {
    constructor(type, data, status) {
        if (!type) {
            throw new Error('Generic Response must have type');
        }
        this.type = type;
        this.data = data || {};
        this.status = status || this.getDefaultStatus();
    }

    getDefaultStatus() {
        switch (this.type) {
            case constants.RESPONSE_TYPES.ERROR:
                return 500;
            case constants.RESPONSE_TYPES.JSON:
                return !!this.data ? 200 : 204;
            case constants.RESPONSE_TYPES.STATIC:
                return 200;
            default:
                return 500;
        }
    }
};
