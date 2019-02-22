const constants = require ('../../models/constants');

'use strict';
module.exports = (sequelize, DataTypes) => {
  const MemberRoles = sequelize.define('MemberRoles', {
    user_id: DataTypes.INTEGER,
      group_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
              model: 'Groups',
              key: 'id',
          },
      },
    record_status: {
        type: DataTypes.ENUM,
        values: [
            constants.DB_RECORD_STATUS_TYPES.ACTIVE,
            constants.DB_RECORD_STATUS_TYPES.DELETED,
        ],
        defaultValue: constants.DB_RECORD_STATUS_TYPES.ACTIVE,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
    },
  }, {});
  MemberRoles.associate = function(models) {
    // associations can be defined here
      models.MemberRoles.belongsTo (models.GroupMembers, {
          foreignKey: {
              allowNull: false,
              fieldName: 'user_id',
          },
      });
  };
  return MemberRoles;
};