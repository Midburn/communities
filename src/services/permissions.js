import { state } from '../models/state';

export class PermissionService {

    hasGroup(groupType) {
        if (!state.isUserGroups) {
            return false;
        }
        return state.userGroups.groups.some(g => g.group_type.toLowerCase().includes(groupType) && g.member_status.includes('approved'));
    }

    isGroupMember(groupId) {
        if (!state.isUserGroups) {
            return false;
        }
        return this.isAdmin() || state.userGroups.groups.some(g => g.group_id === groupId);
    }

    // Does the logged user has a group he manages
    isAGroupManager(groupType) {
        if (!state.isUserGroups) {
            return false;
        }
        return state.userGroups.groups.some(g => g.group_type.toLowerCase().includes(groupType) && g.can_edit);
    }

    isFormerGroupManager(groupId) {
        if (!state.allocationGroups) {
            return false;
        }
        return state.allocationGroups.some(g => g.id === +groupId && g.main_contact === state.loggedUser.user_id);
    }

    // Does the logged user manage this specific group
    isGroupManager(groupId) {
        if (!state.isUserGroups) {
            return false;
        }
        return state.userGroups.groups.some(g => g.group_id === +groupId && g.is_manager_i18n === 'yes') || this.isFormerGroupManager(groupId);
    }

    isAdmin() {
        return state.loggedUser.isAdmin;
    }

    canEditThisGroup(group) {
        if (!state.isUserGroups) {
            return false;
        }
        const currentGroup = state.userGroups.groups.find(g => g.group_id === group.id);
        return !!currentGroup && currentGroup.can_edit;
    }

    get allowedToAllocateQuota() {
        // Add logic when there will be more roles for this;
        return this.isAdmin();
    }

    isAllowedToAllocateTickets(groupId) {
        // Add logic for more permissions here
        return this.isAdmin() || this.isGroupManager(groupId)
    }

    isAllowedToManageGroups(groupType) {
        // Add logic when there will be more roles for this;
        return this.isAdmin();
    }

    redirectToSpark() {
        window.location.href = state.configurations.SPARK_HOST ||
        process.env.NODE_ENV === 'production' ? 'https://spark.midburn.org' : 'http://localhost:3000';
    }

}
