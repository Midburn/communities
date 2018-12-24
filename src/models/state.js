import { observable, computed } from 'mobx';

class State {
    @observable
    _loggedUser = '';

    @computed
    get loggedUser() {
        return this._loggedUser;
    }

}

export const state = new State();