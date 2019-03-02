'use strict';
const constants = require('../../models/constants');

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('Requests', 'record_status', {
            type: Sequelize.ENUM,
            values: [constants.DB_RECORD_STATUS_TYPES.ACTIVE, constants.DB_RECORD_STATUS_TYPES.DELETED],
            defaultValue: constants.DB_RECORD_STATUS_TYPES.ACTIVE
        });
    },
    down:
        (queryInterface, Sequelize) => {
        }
};