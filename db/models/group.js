'use strict';
const constants = require('../../models/constants');

module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    group_name: DataTypes.STRING,
    group_type: {
      type: DataTypes.ENUM,
      values: [constants.GROUP_TYPES.CAMP,
                constants.GROUP_TYPES.ART
              ],
    },
    record_status: {
      type: DataTypes.ENUM,
      values: [constants.DB_RECORD_STATUS_TYPES.ACTIVE, constants.DB_RECORD_STATUS_TYPES.DELETED],
      defaultValue: constants.DB_RECORD_STATUS_TYPES.ACTIVE
    },
    group_status: {
      type: DataTypes.ENUM,
      values: [constants.GROUP_STATUS.OPEN,
                constants.GROUP_STATUS.ACTIVE,
                constants.GROUP_STATUS.CLOSED,
                constants.GROUP_STATUS.DELETED
              ],
      defaultValue: constants.GROUP_STATUS.OPEN
    },
    noise_level: {
      type: DataTypes.ENUM,
      values: [constants.NOISE_LEVEL.QUIET,
                constants.NOISE_LEVEL.MEDIUM,
                constants.NOISE_LEVEL.NOISY,
                constants.NOISE_LEVEL.VERY_NOISY
              ],
      defaultValue: constants.NOISE_LEVEL.MEDIUM
    },
    contact_person_name: DataTypes.STRING,
    contact_person_email: DataTypes.STRING,
    contact_person_phone: DataTypes.STRING
  }, {});
  Group.associate = function(models) {
    // associations can be defined here
    
    // This will add to 'Group' the getMembers and setMembers accessors, and add groupId attribute to 'GroupMember' model.
    models.Group.hasMany(models.GroupMember, {as: 'Members'});
  };
  return Group;
};