import { observable, computed } from 'mobx';
import * as constants from '../../models/constants';
import i18n from '../services/i18n';
import { ParsingService } from '../services/parsing';

class State {

    parsingService = new ParsingService();

    @observable
    loggedUser = {};

    @observable
    currentEventId = '';

    @observable
    currentEvent = {};

    @observable
    allocationGroups = [];

    _data = {};

    set camps(val) {
        this._data[constants.GROUP_TYPES.CAMP] = val || [];
        if (val) {
            this.setNameDictionary(constants.GROUP_TYPES.CAMP, val);
        }
    }

    set artInstallations(val) {
        this._data[constants.GROUP_TYPES.ART] = val || [];
        if (val) {
            this.setNameDictionary(constants.GROUP_TYPES.ART, val);
        }
    }

    @computed
    get camps() {
        return this._data[constants.GROUP_TYPES.CAMP];
    }

    @computed
    get artInstallations() {
        return this._data[constants.GROUP_TYPES.ART];
    }

    getSelectedGroup(type, id) {
        const dataSet = this._data[type];
        return dataSet.find(item => item.id === id);
    }

    @observable
    configurations = {};

    /**
     * @type {{ [groupType: string]: {[groupId: number]: { he: string, en: string }}[] }}
     */
    @observable
    namesDictionary = {};

    setNameDictionary(type, groups) {
        this.namesDictionary[type] = {};
        for (const group of groups) {
            this.namesDictionary[type][group.id] = { he: group.camp_name_he, en: group.camp_name_en};
        }
    }

    getGroupName(id, type) {
        type = this.parsingService.getGroupTypeFromString(type);
        if (!this.namesDictionary[type] || !this.namesDictionary[type][id]) {
            return id;
        }
        return this.namesDictionary[type][id][i18n.language];
    }

    get isUserGroups() {
        return this.loggedUser && this.loggedUser.groups && this.loggedUser.groups.length
    }

}

export const state = new State();

window.state = state;