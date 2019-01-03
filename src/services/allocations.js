import axios from 'axios';
import { state } from '../models/state';
import * as constants from '../../models/constants';

export class AllocationService {

    async allocate(type, allocated_to, related_group, groupType, eventId) {
        try {
            return (await axios.post(`/api/v1/allocations`,
                this.buildAllocation(type, allocated_to, related_group, groupType, eventId),
                {withCredentials: true})).data.body;
        } catch (e) {
            console.warn(`Error fetching camps ${e.stack}`);
        }
    }

    async removeAllocation(allocationId) {
        try {
            return (await axios.delete(`/api/v1/allocations/${allocationId}`, {withCredentials: true})).data.body;
        } catch (e) {
            console.warn(`Error fetching camps ${e.stack}`);
        }
    }

    async getGroupsAllocations(ids) {
        try {
            return (await axios.post(`/api/v1/allocations/groups`, {ids}, {withCredentials: true})).data.body.allocations;
        } catch (e) {
            console.warn(`Error fetching camps ${e.stack}`);
        }
    }

    async getMembersAllocations(ids) {
        try {
            return (await axios.post(`/api/v1/allocations/members`, {ids}, {withCredentials: true})).data.body.allocations;
        } catch (e) {
            console.warn(`Error fetching camps ${e.stack}`);
        }
    }

    buildAllocation(type, allocated_to, related_group, groupType, eventId) {
        return {
            allocation_type: type,
            allocated_by: state.loggedUser.user_id,
            allocated_to,
            related_group,
            active_for_event: eventId || state.currentEventId,
            allocation_group: constants.GROUP_TYPES_TO_ALLOCATIPN_GROUP[groupType]
        }
    }

}
