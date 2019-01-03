'use strict';
const constants = require('../../models/constants');
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Audits', {
            record_status: {
                type: Sequelize.ENUM,
                values: [constants.DB_RECORD_STATUS_TYPES.ACTIVE, constants.DB_RECORD_STATUS_TYPES.DELETED],
                defaultValue: constants.DB_RECORD_STATUS_TYPES.ACTIVE,
                allowNull: false,
            },
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            data_type: {
                type: Sequelize.STRING
            },
            updated_by: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            related_entity: Sequelize.INTEGER
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('DataUpdates');
    }
};