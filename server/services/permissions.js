const db = require ('./database'),
  constants = require ('../../models/constants'),
  GenericResponse = require ('../../models/generic-response');

/**
 * Returns permission from DB
 * And will hold permission check middleware
 */
class PermissionsService {
  async addPermissionForGroup (permissionType, userId, groupId, givenBy) {
    return this.addPermissionForUser ({
      user_id: userId,
      permission_type: permissionType,
      entity_type: constants.ENTITY_TYPE.GROUP,
      related_entity: groupId,
      permitted_by: givenBy || constants.GIVEN_BY_SYSTEM_CODE,
    });
  }

  addLeaderPermissionsForGroup (userId, groupId, givenBy) {
    const leaderPermissions = [
      constants.PERMISSION_TYPES.VIEW,
      constants.PERMISSION_TYPES.EDIT,
      constants.PERMISSION_TYPES.ALLOCATE_PRESALE_TICKET,
      constants.PERMISSION_TYPES.GIVE_PERMISSION,
      constants.PERMISSION_TYPES.MANAGE,
    ];
    return Promise.all (
      leaderPermissions.map (permission =>
        this.addPermissionForGroup (permission, userId, groupId, givenBy)
      )
    );
  }

  addMemberPermissionsForGroup (userId, groupId, givenBy) {
    const leaderPermissions = [constants.PERMISSION_TYPES.VIEW];
    return Promise.all (
      leaderPermissions.map (permission =>
        this.addPermissionForGroup (permission, userId, groupId, givenBy)
      )
    );
  }

  addEditorPermissionsForGroup (userId, groupId, givenBy) {
    const leaderPermissions = [
      constants.PERMISSION_TYPES.VIEW,
      constants.PERMISSION_TYPES.EDIT,
    ];
    return Promise.all (
      leaderPermissions.map (permission =>
        this.addPermissionForGroup (permission, userId, groupId, givenBy)
      )
    );
  }

  addManagerPermissionsForGroup (userId, groupId, givenBy) {
    const leaderPermissions = [
      constants.PERMISSION_TYPES.VIEW,
      constants.PERMISSION_TYPES.EDIT,
      constants.PERMISSION_TYPES.MANAGE,
    ];
    return Promise.all (
      leaderPermissions.map (permission =>
        this.addPermissionForGroup (permission, userId, groupId, givenBy)
      )
    );
  }

  async getPermissionsForUsers (ids) {
    return db.Permissions.findAll ({
      where: {
        user_id: {$in: ids},
        record_status: constants.DB_RECORD_STATUS_TYPES.ACTIVE,
      },
    });
  }

  async addPermissionForUser (permission) {
    return db.Permissions.create (permission);
  }

  async getPermissionsRelatedToEntity (related_entity) {
    return db.Permissions.findAll ({
      where: {
        related_entity,
        record_status: constants.DB_RECORD_STATUS_TYPES.ACTIVE,
      },
    });
  }

  async revokePermissionPermissionForUser (permissionId) {
    const permission = await db.Permissions.findByPk (permissionId);
    if (
      !permission ||
      permission.permitted_by === constants.GIVEN_BY_SYSTEM_CODE
    ) {
      throw new Error ('Cant revoke permission');
    }
    permission.record_status = constants.DB_RECORD_STATUS_TYPES.DELETED;
    return permission.save ();
  }

  checkUserPermission (
    permission_type,
    getEntityTypeFromReq,
    getRelatedEntityFromReq
  ) {
    function isFunction (functionToCheck) {
      return (
        functionToCheck &&
        {}.toString.call (functionToCheck) === '[object Function]'
      );
    }
    return async (req, res, next) => {
      const entity_type = isFunction (getEntityTypeFromReq)
        ? getEntityTypeFromReq (req)
        : getEntityTypeFromReq;
      const related_entity = isFunction (getRelatedEntityFromReq)
        ? getRelatedEntityFromReq (req)
        : getRelatedEntityFromReq;
      const user = await db.LoggedUsers.findOne ({
        where: {email: req.userDetails.email},
      });
      this.getPermissionsForUsers ([user.user_id])
        .then (permissions => {
          if (
            permissions.some (permission => {
              if (
                permission.permission_type === constants.PERMISSION_TYPES.ADMIN
              ) {
                return true;
              }
              return (
                permission.permission_type === permission_type &&
                permission.related_entity === +related_entity &&
                entity_type === permission.entity_type
              );
            })
          ) {
            return next ();
          }
          next (
            new GenericResponse (
              constants.RESPONSE_TYPES.ERROR,
              new Error ('Unauthorized'),
              403
            )
          );
        })
        .catch (e => {
          return next (new GenericResponse (constants.RESPONSE_TYPES.ERROR, e));
        });
    };
  }
}

module.exports = new PermissionsService ();
