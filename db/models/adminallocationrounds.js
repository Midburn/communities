'use strict';
const constants = require('../../models/constants');
module.exports = (sequelize, DataTypes) => {
    const AdminAllocationRounds = sequelize.define('AdminAllocationRounds', {
        group_id: DataTypes.INTEGER,
        group_type: {
            type: DataTypes.ENUM,
            values: [constants.GROUP_TYPES.ART, constants.GROUP_TYPES.CAMP]
        },
        count: DataTypes.STRING,
        publication_date: DataTypes.DATE,
        event_id: DataTypes.STRING,
        record_status: {
            type: DataTypes.ENUM,
            values: [constants.DB_RECORD_STATUS_TYPES.ACTIVE, constants.DB_RECORD_STATUS_TYPES.DELETED],
            defaultValue: constants.DB_RECORD_STATUS_TYPES.ACTIVE
        },
        allocation_type: {
            type: DataTypes.ENUM,
            values: [constants.ALLOCATION_TYPES.EARLY_ARRIVAL, constants.ALLOCATION_TYPES.PRE_SALE]
        },
    }, {});
    AdminAllocationRounds.associate = function (models) {
        // associations can be defined here
    };
    return AdminAllocationRounds;
};