'use strict';
const constants = require('../../models/constants');
module.exports = (sequelize, DataTypes) => {
    const Audits = sequelize.define('Audits', {
        record_status: {
            type: DataTypes.ENUM,
            values: [constants.DB_RECORD_STATUS_TYPES.ACTIVE, constants.DB_RECORD_STATUS_TYPES.DELETED],
            defaultValue: constants.DB_RECORD_STATUS_TYPES.ACTIVE
        },
        data_type: DataTypes.STRING,
        updated_by: DataTypes.STRING,
        related_entity: DataTypes.INTEGER
    }, {});
    Audits.associate = function (models) {
        // associations can be defined here
    };
    return Audits;
};