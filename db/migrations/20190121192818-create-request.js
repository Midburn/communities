'use strict';
const constants = require('../../models/constants');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Requests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
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
    return queryInterface.dropTable('Requests');
  }
};
