const db = require('./database'),
    permissions = require('./permissions'),
    spark = require('./spark'),
    constants = require('../../models/constants');

/**
 * Used to create permissions on first login.
 */
class InitialLoginService {

    async initUser(sparkUser, headers) {
        const wasLogged = !!(await db.LoggedUsers.findByPk(sparkUser.user_id));
        if (wasLogged) {
            return;
        }
        if (sparkUser.isAdmin) {
            // User is admin - add it to permissions table and he has all permissions.
            await permissions.addPermissionForUser({
                user_id: sparkUser.user_id,
                permission_type: constants.PERMISSION_TYPES.ADMIN,
                entity_type: null,
                related_entity: null,
                permitted_by: -1
            });
            await db.LoggedUsers.create({
                email: sparkUser.email,
                user_id: sparkUser.user_id,
                logged: true
            });
            return;
        }
        await this.initCampManagerPermissions(sparkUser, headers);
        await db.LoggedUsers.upsert({
            email: sparkUser.email,
            user_id: sparkUser.user_id,
            logged: true
        });
    }

    initCampManagerPermissions(sparkUser, headers) {
        const sparkEvents = [];
        for (let i = 0; i <= 6; i++) {
            sparkEvents.push(`MIDBURN${new Date().getFullYear() - i}`);
        }
        return sparkEvents.map(sparkEvents => this.setPermissionsForEvent(sparkUser, sparkEvents, headers));
    }

    async setPermissionsForEvent(sparkUser, eventId, headers) {
        try {
            const groups = (await spark.get(`my_groups?eventId=${eventId}`, headers)).data.groups;
            if (groups && groups.length) {
                for (const group of groups) {
                    if (group.is_manager_i18n === 'yes') {
                        await Promise.all([
                            permissions.addPermissionForUser({
                                user_id: sparkUser.user_id,
                                permission_type: constants.PERMISSION_TYPES.GIVE_PERMISSION,
                                entity_type: constants.ENTITY_TYPE.GROUP,
                                related_entity: group.group_id,
                                permitted_by: constants.GIVEN_BY_SYSTEM_CODE
                            }),
                            permissions.addPermissionForUser({
                                user_id: sparkUser.user_id,
                                permission_type: constants.PERMISSION_TYPES.ALLOCATE_PRESALE_TICKET,
                                entity_type: constants.ENTITY_TYPE.GROUP,
                                related_entity: group.group_id,
                                permitted_by: constants.GIVEN_BY_SYSTEM_CODE
                            })
                        ]);
                    }
                }
            }
        } catch (e) {
            return;
        }
    }
}

module.exports = new InitialLoginService();