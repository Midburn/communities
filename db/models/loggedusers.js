'use strict';
const constants = require('../../models/constants');
module.exports = (sequelize, DataTypes) => {
    const LoggedUsers = sequelize.define('LoggedUsers', {
        user_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        logged: DataTypes.BOOLEAN,
        email: {
            type: DataTypes.STRING
        },
        record_status: {
            type: DataTypes.ENUM,
            values: [constants.DB_RECORD_STATUS_TYPES.ACTIVE, constants.DB_RECORD_STATUS_TYPES.DELETED],
            defaultValue: constants.DB_RECORD_STATUS_TYPES.ACTIVE
        },
    }, {});
    LoggedUsers.associate = function (models) {
        // associations can be defined here
    };
    return LoggedUsers;
};