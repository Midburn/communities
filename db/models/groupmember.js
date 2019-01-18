'use strict';
module.exports = (sequelize, DataTypes) => {
  const GroupMember = sequelize.define('GroupMember', {
    user_id: DataTypes.INTEGER,
    role: DataTypes.STRING
  }, {});
  GroupMember.associate = function(models) {
    models.GroupMember.belongsTo(models.Group, {
      onDelete: 'CASCADE',
      foreignKey: { 
        allowNull: false,
        fieldName: 'GroupId',
       }
    });
  };
  return GroupMember;
};