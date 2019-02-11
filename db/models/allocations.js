'use strict';
const constants = require ('../../models/constants');
module.exports = (sequelize, DataTypes) => {
  const Allocations = sequelize.define (
    'Allocations',
    {
      record_status: {
        type: DataTypes.ENUM,
        values: [
          constants.DB_RECORD_STATUS_TYPES.ACTIVE,
          constants.DB_RECORD_STATUS_TYPES.DELETED,
        ],
        defaultValue: constants.DB_RECORD_STATUS_TYPES.ACTIVE,
      },
      allocation_type: {
        type: DataTypes.ENUM,
        values: [
          constants.ALLOCATION_TYPES.EARLY_ARRIVAL,
          constants.ALLOCATION_TYPES.PRE_SALE,
        ],
      },
      allocated_by: DataTypes.INTEGER,
      allocated_to: DataTypes.INTEGER,
      related_group: DataTypes.INTEGER,
      active_for_event: DataTypes.STRING,
      allocation_group: {
        type: DataTypes.ENUM,
        values: [
          constants.ALLOCATION_GROUPS.THEME_CAMPS,
          constants.ALLOCATION_GROUPS.ART_INSTALLATIONS,
          constants.ALLOCATION_GROUPS.VOLUNTEER_DEPARTMENT,
          constants.ALLOCATION_GROUPS.PRODUCTION,
        ],
      },
      allocations_service_id: DataTypes.STRING,
    },
    {}
  );
  Allocations.associate = function (models) {
    // associations can be defined here
  };
  return Allocations;
};
