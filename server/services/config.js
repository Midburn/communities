// Load environment variables default values
require ('dotenv').config ();
class ConfigService {
  get isDevMode () {
    return process.env.ENVIRONMENT === 'debug';
  }

  get NO_SPARK_SYNC () {
    return process.env.NO_SPARK_SYNC;
  }

  get SPARK_HOST () {
    return process.env.SPARK_HOST;
  }

  get JWT_KEY () {
    return process.env.JWT_KEY || 'authToken';
  }

  get SECRET () {
    return (
      process.env.SPARK_SECRET_TOKEN ||
      'YWxseW91bmVlZGlzbG92ZWFsbHlvdW5lZWRpc2xvdmVsb3ZlbG92ZWlzYWxseW91'
    );
  }

  get LOCAL_SPARK () {
    return process.env.LOCAL_SPARK === 'true';
  }

  get PORT () {
    return process.env.PORT;
  }
}

module.exports = new ConfigService ();
