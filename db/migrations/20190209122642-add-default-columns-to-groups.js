'use strict';
const constants = require('../../models/constants');
module.exports = {
  up: (queryInterface, Sequelize) => {
      // logic for transforming into the new state
      const recordStatus = {
          type: Sequelize.ENUM,
          values: [constants.DB_RECORD_STATUS_TYPES.ACTIVE, constants.DB_RECORD_STATUS_TYPES.DELETED],
          defaultValue: constants.DB_RECORD_STATUS_TYPES.ACTIVE
      };
      return Promise.all([
          queryInterface.addColumn(
              'GroupMembers',
              'record_status',
              recordStatus
          ),
          queryInterface.addColumn(
              'Groups',
              'event_id',
              {type: Sequelize.STRING}
          ),
      ])
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
