const constants = require ('../../models/constants');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable ('Groups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      spark_id: {
        type: Sequelize.INTEGER,
      },
      group_name_en: {
        type: Sequelize.STRING,
      },
      group_name_he: {type: Sequelize.STRING},
      group_desc_en: {
        type: Sequelize.TEXT,
      },
      group_desc_he: {
        type: Sequelize.TEXT,
      },
      group_character: {type: Sequelize.STRING},
      group_is_new_members_open: {type: Sequelize.BOOLEAN},
      accept_families: {type: Sequelize.BOOLEAN},
      child_friendly: {type: Sequelize.BOOLEAN},
      web_published: {type: Sequelize.BOOLEAN},
      main_contact: {
        type: Sequelize.INTEGER,
      },
      moop_contact: {
        type: Sequelize.INTEGER,
      },
      safety_contact: {
        type: Sequelize.INTEGER,
      },
      contact_person_id: {
        type: Sequelize.INTEGER,
      },
      group_type: {
        type: Sequelize.ENUM,
        values: [constants.GROUP_TYPES.CAMP, constants.GROUP_TYPES.ART],
        allowNull: false,
      },
      record_status: {
        type: Sequelize.ENUM,
        values: [
          constants.DB_RECORD_STATUS_TYPES.ACTIVE,
          constants.DB_RECORD_STATUS_TYPES.DELETED,
        ],
        defaultValue: constants.DB_RECORD_STATUS_TYPES.ACTIVE,
        allowNull: false,
      },
      event_id: {
        type: Sequelize.STRING,
      },
      group_status: {
        type: Sequelize.ENUM,
        values: [
          constants.GROUP_STATUS.OPEN,
          constants.GROUP_STATUS.CLOSED,
          constants.GROUP_STATUS.DELETED,
          constants.GROUP_STATUS.INACTIVE,
        ],
        defaultValue: constants.GROUP_STATUS.ACTIVE,
        allowNull: false,
      },
      noise_level: {
        type: Sequelize.ENUM,
        values: [
          constants.NOISE_LEVEL.QUIET,
          constants.NOISE_LEVEL.MEDIUM,
          constants.NOISE_LEVEL.NOISY,
          constants.NOISE_LEVEL.VERY_NOISY,
        ],
        defaultValue: constants.NOISE_LEVEL.MEDIUM,
        allowNull: true,
      },
      facebook_url: {
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
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable ('Groups');
  },
};
