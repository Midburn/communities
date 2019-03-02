import {state} from '../models/state';
import * as constants from '../../models/constants';

/**
 * General permissions service - tests logged user permissions and roles
 */
export class PermissionService {
  hasGroup (groupType) {
    if (!state.isUserGroups) {
      return false;
    }
    return state.loggedUser.groups.some (
      g => g.event_id === state.currentEventId && g.group_type === groupType
    );
  }

  isGroupMember (groupId) {
    if (!state.isUserGroups) {
      return false;
    }
    return (
      this.isAdmin () ||
      state.loggedUser.groups.some (
        g => g.event_id === state.currentEventId && g.id === groupId
      )
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
    return (
      state.loggedUser.groups.some (
        g => g.id === +groupId && g.main_contact === state.loggedUser.user_id
      ) || this.isFormerGroupManager (groupId)
    );
  }

  isAdmin () {
    return state.loggedUser.isAdmin;
  }

  canManageGroups(type) {
    if (this.isAdmin()) {
      return true;
    }
    return type === constants.GROUP_TYPES.CAMP ? state.loggedUser.isCampsAdmin : state.loggedUser.isArtInstallationsAdmin;

  }

  canEditThisGroup (group) {
    if (!state.isUserGroups) {
      return false;
    }
    const currentGroup = state.loggedUser.groups.find (g => g.id === group.id);
    return (
      !!currentGroup && currentGroup.main_contact === state.loggedUser.user_id
    );
  }

  hasRole (groupId, role) {
    if (
      !state.loggedUser.groups ||
      !state.loggedUser.groups.find (g => g.id === groupId)
    ) {
      return false;
    }
    return !!state.loggedUser.roles.find (
      r => r.role === role && r.group_id === groupId
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
      this.hasRole (groupId, constants.GROUP_STATIC_ROLES.LEADER) ||
      this.hasRole (groupId, constants.GROUP_STATIC_ROLES.PRE_SALE_ALLOCATOR)
    );
  }

  isAllowedToManageGroups (groupType) {
    // Add logic when there will be more roles for this;
    return this.canManageGroups (groupType);
  }

  redirectToSpark () {
    if (state.configurations && state.configurations.SPARK_HOST) {
      return (window.location.href = state.configurations.SPARK_HOST);
    }
    return (window.location.href =
      process.env.SPARK_HOST || 'https://spark.midburn.org');
  }
}
