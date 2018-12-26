import { state } from '../models/state';

export class PermissionService {

    hasGroup(groupType) {
        if (!state.isUserGroups) {
            return false;
        }
        return state.userGroups.groups.some(g => g.group_type.toLowerCase().includes(groupType) && g.member_status.includes('approved'));
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

}
