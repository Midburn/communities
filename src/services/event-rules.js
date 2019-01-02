import { state } from '../models/state';
import * as constants from '../../models/constants';

export class EventRulesService {

    get currentEventJson() {
        return state.currentEvent.addinfo_json ? JSON.parse(state.currentEvent.addinfo_json)  : {};
    }

    isGroupEditingDisabled(groupType) {
        return constants.GROUP_TYPES.ART ? this.currentEventJson.edit_art_disabled : this.currentEventJson.edit_camp_disabled
    }

}