'use strict';
const constants = require('../../models/constants');
const GroupMembersFactory = require('../models/groupmember');
module.exports = {
  up: (queryInterface, Sequelize) => {
    return new Promise(async (resolve, reject) => {
        try {
            await queryInterface.addColumn ('GroupMembers', 'unique_id', {
                type: Sequelize.STRING,
                unique: true,
            });
            await queryInterface.createTable('MemberRoles', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER
                },
                group_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'Groups',
                        key: 'id',
                    },
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
                user_id: {type: Sequelize.INTEGER},
                unique_id: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    references: {
                        model: 'GroupMembers',
                        key: 'unique_id',
                    },
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
            // Delete current data from members table
            GroupMembers.destroy({
                where: {}
            });
            queryInterface.removeColumn('GroupMembers', 'role');
            const filterDict = {};
            for (const member of members) {
                const uniqueMember = member.toJSON();
                const uniqueKey = `${uniqueMember.user_id}-${uniqueMember.group_id}`;
                uniqueMember.unique_id = uniqueKey;
                if (filterDict[uniqueKey]) {
                    continue;
                }
                delete uniqueMember.id;
                delete uniqueMember.role;
                await GroupMembers.create(uniqueMember);
                filterDict[uniqueKey] = true;
            }
            // Copy all data to roles table
            await queryInterface.bulkInsert('MemberRoles', members.map(member => {
                member = member.toJSON();
                if (!member.role) {
                    member.role = 'MEMBER';
                }
                member.unique_id = `${member.user_id}-${member.group_id}`;
                delete member.id;
                return member;
            }));
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