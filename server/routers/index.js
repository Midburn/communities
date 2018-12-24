/**
 * Export dictionery for Main (Version) Router singletons.
 * @type {{}}
 */
const V1Router = require('./v1');

module.exports = {
    v1: new V1Router()
};
