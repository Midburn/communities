import {state} from '../models/state';
import axios from 'axios/index';
import * as constants from '../../models/constants';

export class PermissionService {
  async getUsersPermissions (ids) {
    try {
      return (await axios.post (
        `/api/v1/permissions/users`,
        {ids},
        {withCredentials: true}
      )).data.body.permissions;
    } catch (e) {
      console.warn (`Error getting permissions ${e.stack}`);
    }
  }
  async addPermission (permission) {
    try {
      return (await axios.post (`/api/v1/permissions`, permission, {
        withCredentials: true,
      })).data.body;
    } catch (e) {
      console.warn (`Error adding permissions ${e.stack}`);
    }
  }

  async getPermissionsRelatedToEntity (entityId) {
    try {
      return (await axios.get (`/api/v1/permissions/${entityId}`, {
        withCredentials: true,
      })).data.body.permissions;
    } catch (e) {
      console.warn (`Error getting permissions ${e.stack}`);
    }
  }

  async revokePermission (permissionId, entityType, entityId) {
    try {
      return (await axios.delete (
        `/api/v1/permissions/${permissionId}/${entityType}/${entityId}`,
        {withCredentials: true}
      )).data.body;
    } catch (e) {
      console.warn (`Error revoking permissions ${e.stack}`);
    }
  }

  hasGroup (groupType) {
    if (!state.isUserGroups) {
      return false;
    }
    return state.userGroups.groups.some (
      g => g.group_type.includes (groupType) && g.isMember
    );
  }

  isGroupMember (groupId) {
    if (!state.loggedUser.permissions) {
      return false;
    }
    return (
      this.isAdmin () ||
      state.loggedUser.permission.some (
        p =>
          p.permission_type === constants.PERMISSION_TYPES.VIEW &&
          p.entity_type === constants.ENTITY_TYPE.GROUP &&
          p.related_entity === groupId
      )
    );
  }

  // Does the logged user has a group he manages
  isAGroupManager (groupType) {
    if (!state.isUserGroups) {
      return false;
    }
    return state.userGroups.groups.some (
      g => g.group_type.toLowerCase ().includes (groupType) && g.can_edit
    );
  }

  isFormerGroupManager (groupId) {
    if (!state.allocationGroups) {
      return false;
    }
    return state.allocationGroups.some (
      g => g.id === +groupId && g.main_contact === state.loggedUser.user_id
    );
  }

  // Does the logged user manage this specific group
  isGroupManager (groupId) {
    if (!state.isUserGroups) {
      return false;
    }
    return state.loggedUser.permissions.some (
      p =>
        p.permission_type === constants.PERMISSION_TYPES.MANAGE &&
        p.entity_type === constants.ENTITY_TYPE.GROUP &&
        p.related_entity === groupId
    );
  }

  isAdmin () {
    return state.loggedUser.isAdmin;
  }

  canEditThisGroup (group) {
    if (!state.isUserGroups) {
      return false;
    }
    return state.loggedUser.permissions.some (
      p =>
        p.permission_type === constants.PERMISSION_TYPES.EDIT &&
        p.entity_type === constants.ENTITY_TYPE.GROUP &&
        p.related_entity === group.id
    );
  }

  hasPermissionFor (relatedEntity, entityType, permissionType) {
    return (
      state.loggedUser.permissions &&
      state.loggedUser.permissions.some (permission => {
        return (
          permission.entity_type === entityType &&
          permission.permission_type === permissionType &&
          permission.related_entity === +relatedEntity
        );
      })
    );
  }

  get allowedToAllocateQuota () {
    // Add logic when there will be more roles for this;
    return this.isAdmin ();
  }

  isAllowedToAllocateTickets (groupId) {
    // Add logic for more permissions here
    return (
      this.isAdmin () ||
      this.isGroupManager (groupId) ||
      this.hasPermissionFor (
        groupId,
        constants.ENTITY_TYPE.GROUP,
        constants.PERMISSION_TYPES.ALLOCATE_PRESALE_TICKET
      )
    );
  }

  isAllowedToManageGroups (groupType) {
    // Add logic when there will be more roles for this;
    return this.isAdmin ();
  }

  redirectToSpark () {
    if (state.configurations && state.configurations.SPARK_HOST) {
      return (window.location.href = state.configurations.SPARK_HOST);
    }
    return (window.location.href =
      process.env.SPARK_HOST || 'https://spark.midburn.org');
  }
}
