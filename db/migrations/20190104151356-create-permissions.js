'use strict';
const constants = require('../../models/constants');
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Permissions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            record_status: {
                type: Sequelize.ENUM,
                values: [constants.DB_RECORD_STATUS_TYPES.ACTIVE, constants.DB_RECORD_STATUS_TYPES.DELETED],
                defaultValue: constants.DB_RECORD_STATUS_TYPES.ACTIVE
            },
            user_id: {
                type: Sequelize.INTEGER
            },
            permission_type: {
                type: Sequelize.STRING
            },
            related_entity: {
                type: Sequelize.INTEGER
            },
            permitted_by: {
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            entity_type: Sequelize.STRING
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Permissions');
    }
};