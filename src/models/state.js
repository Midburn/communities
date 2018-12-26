import { observable, computed } from 'mobx';

class State {
    @observable
    _loggedUser = '';

    @computed
    get loggedUser() {
        return this._loggedUser;
    }

    @observable
    camps = [];

}

export const state = new State();