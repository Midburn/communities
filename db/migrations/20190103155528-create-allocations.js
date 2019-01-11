'use strict';
const constants = require('../../models/constants');
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Allocations', {
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
            allocation_type: {
                type: Sequelize.ENUM,
                values: [constants.ALLOCATION_TYPES.EARLY_ARRIVAL, constants.ALLOCATION_TYPES.PRE_SALE]
            },
            allocated_by: {
                type: Sequelize.INTEGER
            },
            allocated_to: {
                type: Sequelize.INTEGER
            },
            related_group: {
                type: Sequelize.INTEGER
            },
            active_for_event: {
                type: Sequelize.STRING
            },
            allocation_group: {
                type: Sequelize.ENUM,
                values: [
                    constants.ALLOCATION_GROUPS.THEME_CAMPS,
                    constants.ALLOCATION_GROUPS.ART_INSTALLATIONS,
                    constants.ALLOCATION_GROUPS.VOLUNTEER_DEPARTMENT,
                    constants.ALLOCATION_GROUPS.PRODUCTION,
                ]
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
        return queryInterface.dropTable('Allocations');
    }
};