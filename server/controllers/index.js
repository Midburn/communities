/**
 * Export dictionery for controller singletons.
 * @type {{}}
 */
const AuthController = require('./auth');

module.exports = {
    auth: new AuthController()
};
