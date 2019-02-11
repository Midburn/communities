'use strict';
const constants = require ('../../models/constants');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn ('Allocations', 'allocations_service_id', {
      type: Sequelize.STRING,
    });
  },
  down: (queryInterface, Sequelize) => {},
};
