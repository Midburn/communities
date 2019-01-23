'use strict';
const constants = require('../../models/constants');

module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    // User ID of the user who created the request
    created_by_id: DataTypes.INTEGER,

    // ID of the related entity. For example - request for adding a user will include the user's ID
    related_id: DataTypes.INTEGER,

    // Type of the related entity, which is linked to the related_id property
    related_type: {
      type: DataTypes.ENUM,
      values: [
        constants.ENTITY_TYPE.USER,
        constants.ENTITY_TYPE.GROUP
      ],
    },

    // Data for the request. Could be anything; Depending on the request type; This is extra-robust on purpose
    // Should be JSON, but currently unsupported. Should user JSON parse / stringify in the controller
    data: DataTypes.STRING,

  }, {});
  Request.associate = function(models) {
    // associations can be defined here
  };
  return Request;
};