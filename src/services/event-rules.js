import { state } from '../models/state';
import * as constants from '../../models/constants';
import moment from 'moment';

export class EventRulesService {

    get currentEventJson() {
        return state.currentEvent && state.currentEvent.addinfo_json ? JSON.parse(state.currentEvent.addinfo_json)  : {};
    }

    isGroupEditingDisabled(groupType) {
        return constants.GROUP_TYPES.ART ? this.currentEventJson.edit_art_disabled : this.currentEventJson.edit_camp_disabled
    }

    get isPresaleAvailable() {
       if (!this.currentEventJson.appreciation_tickets_allocation_start || !this.currentEventJson.appreciation_tickets_allocation_end) {
           return false;
       }
       const now = moment(new Date());
       const start = moment(this.currentEventJson.appreciation_tickets_allocation_start);
       const end = moment(this.currentEventJson.appreciation_tickets_allocation_end);
       return now.isAfter(start) && now.isBefore(end);
    }

    get lastDateToAllocatePreSale() {
        if (!this.currentEventJson.appreciation_tickets_allocation_start || !this.currentEventJson.appreciation_tickets_allocation_end) {
            return null;
        }
        return this.currentEventJson.appreciation_tickets_allocation_end;
    }

}
