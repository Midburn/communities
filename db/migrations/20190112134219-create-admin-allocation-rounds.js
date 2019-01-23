'use strict';
const constants = require('../../models/constants');
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('AdminAllocationRounds', {
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
            group_id: {
                type: Sequelize.INTEGER
            },
            group_type: {
                type: Sequelize.ENUM,
                values: [constants.GROUP_TYPES.ART, constants.GROUP_TYPES.CAMP]
            },
            count: {
                type: Sequelize.STRING
            },
            publication_date: {
                type: Sequelize.DATE
            },
            event_id: {
                type: Sequelize.STRING
            },
            allocation_type: {
                type: Sequelize.ENUM,
                values: [constants.ALLOCATION_TYPES.EARLY_ARRIVAL, constants.ALLOCATION_TYPES.PRE_SALE]
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
        return queryInterface.dropTable('AdminAllocationRounds');
    }
};