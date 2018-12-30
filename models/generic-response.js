const constants = require('./constants');



if (!('toJSON' in Error.prototype)) {
    Object.defineProperty(Error.prototype, 'toJSON', {
        value: function () {
            var alt = {};

            Object.getOwnPropertyNames(this).forEach(function (key) {
                alt[key] = this[key];
            }, this);

            return alt;
        },
        configurable: true,
        writable: true
    });
}

module.exports = class GenericResponse {
    constructor(type, body, status) {
        if (!type) {
            throw new Error('Generic Response must have type');
        }
        this.type = type;
        this.body = body || {};
        this.status = status || this.getDefaultStatus();
    }

    getDefaultStatus() {
        switch (this.type) {
            case constants.RESPONSE_TYPES.ERROR:
                return 500;
            case constants.RESPONSE_TYPES.JSON:
                return !!this.body ? 200 : 204;
            case constants.RESPONSE_TYPES.STATIC:
                return 200;
            default:
                return 500;
        }
    }
};
