'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
        queryInterface.addColumn ('GroupMembers', 'email', {
            type: Sequelize.STRING,
        }),
        queryInterface.addColumn ('GroupMembers', 'cell_phone', {
            type: Sequelize.STRING,
        }),
        queryInterface.addColumn ('GroupMembers', 'name', {
            type: Sequelize.STRING,
        }),
    ]);

  },
  down: (queryInterface, Sequelize) => {
  }
};