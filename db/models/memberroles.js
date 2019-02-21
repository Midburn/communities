const constants = require ('../../models/constants');

'use strict';
module.exports = (sequelize, DataTypes) => {
  const MemberRoles = sequelize.define('MemberRoles', {
    user_id: DataTypes.INTEGER,
    group_id: DataTypes.INTEGER,
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
      models.GroupMember.belongsTo (models.GroupMember, {
          onDelete: 'CASCADE',
          foreignKey: {
              allowNull: false,
              fieldName: 'user_id',
          },
      });
  };
  return MemberRoles;
};