'use strict';
const constants = require('../../models/constants');
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('LoggedUsers', {
            user_id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            record_status: {
                type: Sequelize.ENUM,
                values: [constants.DB_RECORD_STATUS_TYPES.ACTIVE, constants.DB_RECORD_STATUS_TYPES.DELETED],
                defaultValue: constants.DB_RECORD_STATUS_TYPES.ACTIVE
            },
            logged: {
                type: Sequelize.BOOLEAN
            },
            email: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('LoggedUsers');
    }
};