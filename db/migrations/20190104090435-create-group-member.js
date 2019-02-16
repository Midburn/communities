const constants = require ('../../models/constants');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable ('GroupMembers', {
      record_status: {
        type: Sequelize.ENUM,
        values: [
          constants.DB_RECORD_STATUS_TYPES.ACTIVE,
          constants.DB_RECORD_STATUS_TYPES.DELETED,
        ],
        defaultValue: constants.DB_RECORD_STATUS_TYPES.ACTIVE,
        allowNull: false,
      },
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
      role: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      group_id: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        allowNull: false,
        references: {
          model: 'Groups',
          key: 'id',
        },
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable ('GroupMembers');
  },
};
