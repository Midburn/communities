'use strict';
const constants = require('../../models/constants');
module.exports = (sequelize, DataTypes) => {
    const Permissions = sequelize.define('Permissions', {
        user_id: DataTypes.INTEGER,
        record_status: {
            type: DataTypes.ENUM,
            values: [constants.DB_RECORD_STATUS_TYPES.ACTIVE, constants.DB_RECORD_STATUS_TYPES.DELETED],
            defaultValue: constants.DB_RECORD_STATUS_TYPES.ACTIVE
        },
        permission_type: DataTypes.STRING,
        entity_type: DataTypes.STRING,
        related_entity: DataTypes.INTEGER,
        permitted_by: DataTypes.INTEGER
    }, {});
    Permissions.associate = function (models) {
        // associations can be defined here
    };
    return Permissions;
};