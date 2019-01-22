'use strict';
const constants = require('../../models/constants');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('NewGroupRequests', {
      created_by_id: {
        type: Sequelize.INTEGER
      },
      related_id: {
        type: Sequelize.INTEGER
      },
      related_type: {
        type: Sequelize.ENUM,
        values: [
          constants.ENTITY_TYPE.USER,
          constants.ENTITY_TYPE.GROUP
        ],
      },
      data: {
        type: Sequelize.STRING
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('NewGroupRequests');
  }
};
