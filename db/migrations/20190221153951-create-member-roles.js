'use strict';
const constants = require('../../models/constants');
const GroupMembersFactory = require('../models/groupmember');
module.exports = {
  up: (queryInterface, Sequelize) => {
    return new Promise(async (resolve, reject) => {
        try {
            await queryInterface.createTable('MemberRoles', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER
                },
                user_id: {
                    type: Sequelize.INTEGER
                },
                group_id: {
                    type: Sequelize.INTEGER
                },
                role: {
                    type: Sequelize.STRING
                },
                record_status: {
                    type: Sequelize.ENUM,
                    values: [
                        constants.DB_RECORD_STATUS_TYPES.ACTIVE,
                        constants.DB_RECORD_STATUS_TYPES.DELETED,
                    ],
                    defaultValue: constants.DB_RECORD_STATUS_TYPES.ACTIVE,
                    allowNull: false,
                },
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE
                }
            });
            const sequelize = queryInterface.sequelize;
            const GroupMembers = GroupMembersFactory(sequelize, Sequelize);
            const members = await GroupMembers.findAll();
            // Copy all data to roles table
            queryInterface.bulkInsert('MemberRoles', members.map(member => {
                member = member.toJSON();
                if (!member.role) {
                    member.role = 'MEMBER';
                }
                delete member.id;
                return member;
            }));
            // Delete current data from members table
            GroupMembers.destroy({
                where: {},
                truncate: true
            });
            queryInterface.removeColumn('GroupMembers', 'role');
            const filterDict = {};
            for (const member of members) {
                const uniqueMember = member.toJSON();
                const uniqueKey = `${uniqueMember.user_id}-${uniqueMember.group_id}`;
                if (filterDict[uniqueKey]) {
                    continue;
                }
                delete uniqueMember.id;
                delete uniqueMember.role;
                await GroupMembers.create(uniqueMember);
                filterDict[uniqueKey] = true;
            }
            resolve();
        } catch (e) {
            reject (e)
        }
    });

  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('MemberRoles');
  }
};