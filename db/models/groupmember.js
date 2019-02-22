const constants = require ('../../models/constants');

module.exports = (sequelize, DataTypes) => {
  const GroupMember = sequelize.define (
    'GroupMember',
    {
      record_status: {
        type: DataTypes.ENUM,
        values: [
          constants.DB_RECORD_STATUS_TYPES.ACTIVE,
          constants.DB_RECORD_STATUS_TYPES.DELETED,
        ],
        defaultValue: constants.DB_RECORD_STATUS_TYPES.ACTIVE,
        allowNull: false,
      },
      user_id: DataTypes.INTEGER,
        email: DataTypes.STRING,
        cell_phone: DataTypes.STRING,
        name: DataTypes.STRING,
      group_id: {
        type: DataTypes.INTEGER,
        onDelete: 'CASCADE',
        allowNull: false,
        references: {
          model: 'Groups',
          key: 'id',
        },
      },
    },
    {}
  );
  GroupMember.associate = function (models) {
    models.GroupMember.belongsTo (models.Group, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
        fieldName: 'group_id',
      },
    });
  };
  return GroupMember;
};
