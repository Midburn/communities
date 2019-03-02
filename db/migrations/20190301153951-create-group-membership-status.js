'use strict';
const constants = require('../../models/constants');

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn('Groups', 'group_membership_status',
                {
                    type: Sequelize.ENUM,
                    values: [
                        constants.GROUP_MEMBERSHIP_STATUS.OPEN,
                        constants.GROUP_MEMBERSHIP_STATUS.CLOSED,
                        constants.GROUP_MEMBERSHIP_STATUS.UNKNOWN,
                    ],
                    defaultValue: constants.GROUP_MEMBERSHIP_STATUS.CLOSED
                }
            ),
            queryInterface.removeColumn('Groups', 'group_is_new_members_open')
        ]);

    },
    down: (queryInterface, Sequelize) => {
    }
};