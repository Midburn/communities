import { observable, computed } from 'mobx';

class State {
    @observable
    _loggedUser = '';

    @computed
    get loggedUser() {
        return this._loggedUser;
    }

    _camps = [];

    set camps(val) {
        this._camps = val || [];
        if (val) {
            this.setCampsNameDictionary(val);
        }
    }

    @computed
    get camps() {
        return this._camps;
    }

    @observable
    configurations = {};

    @observable
    campNamesDictionary = {};

    @observable
    userGroups;

    setCampsNameDictionary(camps) {
        for (const camp of camps) {
            this.campNamesDictionary[camp.id] = { he: camp.camp_name_he, en: camp.camp_name_en};
        }
    }

    get isUserGroups() {
        return this.userGroups && this.userGroups.groups && this.userGroups.groups.length
    }

}

export const state = new State();

window.state = state;