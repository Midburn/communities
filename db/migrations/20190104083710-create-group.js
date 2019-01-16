'use strict';
const constants = require('../../models/constants');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Groups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      group_name: {
        type: Sequelize.STRING
      },
      group_type: {
        type: Sequelize.ENUM,
        values: [constants.GROUP_TYPES.CAMP,
                  constants.GROUP_TYPES.ART
                ],
        allowNull: false,        
      },
      record_status: {
        type: Sequelize.ENUM,
        values: [constants.DB_RECORD_STATUS_TYPES.ACTIVE, constants.DB_RECORD_STATUS_TYPES.DELETED],
        defaultValue: constants.DB_RECORD_STATUS_TYPES.ACTIVE,
        allowNull: false,
      },
      group_status: {
        type: Sequelize.ENUM,
        values: [constants.GROUP_STATUS.OPEN,
                  constants.GROUP_STATUS.ACTIVE,
                  constants.GROUP_STATUS.CLOSED,
                  constants.GROUP_STATUS.DELETED
                ],
        defaultValue: constants.GROUP_STATUS.OPEN,
        allowNull: false,
      },
      noise_level: {
        type: Sequelize.ENUM,
        values: [constants.NOISE_LEVEL.QUIET,
                  constants.NOISE_LEVEL.MEDIUM,
                  constants.NOISE_LEVEL.NOISY,
                  constants.NOISE_LEVEL.VERY_NOISY
                ],
        defaultValue: constants.NOISE_LEVEL.MEDIUM,
        allowNull: true,
      },
      contact_person_name: {
        type: Sequelize.STRING
      },
      contact_person_email: {
        type: Sequelize.STRING
      },
      contact_person_phone: {
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
    return queryInterface.dropTable('Groups');
  }
};