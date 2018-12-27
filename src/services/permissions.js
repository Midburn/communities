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
        return state.userGroups.groups.some(g => g.group_id === groupId);
    }

    isGroupManager(groupType) {
        if (!state.isUserGroups) {
            return false;
        }
        return state.userGroups.groups.some(g => g.group_type.toLowerCase().includes(groupType) && g.can_edit);
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

}
