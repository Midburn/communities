// Load environment variables default values
require('dotenv').config();

module.exports = class ConfigService {
    get isDevMode() {
        return process.env.ENVIRONMENT === 'debug';
    }

    get SPARK_HOST() {
        return process.env.SPARK_HOST;
    }

    get JWT_KEY() {
        return process.env.JWT_KEY;
    }

    get SECRET() {
        return process.env.SECRET;
    }

    get LOCAL_SPARK() {
        return process.env.LOCAL_SPARK === 'true';
    }

    get PORT() {
        return process.env.PORT;
    }
};
