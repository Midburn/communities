const db = require ('./database'),
  permissions = require ('./permissions'),
  spark = require ('./spark'),
  constants = require ('../../models/constants');

/**
 * Used to create permissions on first login.
 */
class InitialLoginService {
  async initUser (sparkUser, req) {
    const wasLogged = !!await db.LoggedUsers.findByPk (sparkUser.user_id);
    if (wasLogged) {
      return;
    }
    if (sparkUser.isAdmin) {
      // User is admin - add it to permissions table and he has all permissions.
      await permissions.addPermissionForUser ({
        user_id: sparkUser.user_id,
        permission_type: constants.PERMISSION_TYPES.ADMIN,
        entity_type: null,
        related_entity: null,
        permitted_by: -1,
      });
      await db.LoggedUsers.create ({
        email: sparkUser.email,
        user_id: sparkUser.user_id,
        logged: true,
      });
    }
    await this.initPermissions (sparkUser, req);
    await db.LoggedUsers.upsert ({
      email: sparkUser.email,
      user_id: sparkUser.user_id,
      logged: true,
    });
  }

  initPermissions (sparkUser, req) {
    const sparkEvents = [];
    for (let i = 0; i <= 6; i++) {
      sparkEvents.push (`MIDBURN${new Date ().getFullYear () - i}`);
    }
    return Promise.all (
      sparkEvents.map (sparkEvents =>
        this.setPermissionsForEvent (sparkUser, sparkEvents, req)
      )
    );
  }

  async setPermissionsForEvent (sparkUser, eventId, req) {
    try {
      const groups = (await spark.get (`my_groups?eventId=${eventId}`, req))
        .data.groups;
      if (groups && groups.length) {
        const groupData = await Promise.all (
          groups.map (
            async g =>
              (await spark.get (`camps/${g.group_id}/get`, req)).data.camp
          )
        );
        for (const group of groupData) {
          if (+group.main_contact === +sparkUser.user_id) {
            // User is leader - add all permissions
            return await permissions.addLeaderPermissionsForGroup (
              sparkUser.user_id,
              group.id
            );
          }
          if (groups.find (g => +g.group_id === +group.id)) {
            if (group.can_edit) {
              // User is editor of group
              return await permissions.addEditorPermissionsForGroup (
                sparkUser.user_id,
                group.id
              );
            } else {
              // User is a member only of this group
              return await permissions.addMemberPermissionsForGroup (
                sparkUser.user_id,
                group.id
              );
            }
          }
        }
      }
    } catch (e) {
      console.warn (e.stack);
      return;
    }
  }
}

module.exports = new InitialLoginService ();
