import './i18n';
import {AuthService} from './auth';
import {GroupsService} from './groups';
import {state} from '../models/state';
import {ConfigurationsService} from './configurations';
import {EventsService} from './events';
import * as constants from '../../models/constants';

export class CookieError extends Error {}

export class InitilizationService {
  auth = new AuthService ();
  groups = new GroupsService ();
  configurations = new ConfigurationsService ();
  events = new EventsService ();

  async fetchAppInitialData () {
    /**
         * Put all requests for App (configurations etc...) initial data here.
         */
    state.configurations = (await this.configurations.getConfigurations ()) || {};
  }

  async fetchInitialData () {
    /**
         * Put all requests for initial business logic data here (logged user, event rules etc...).
         */
    state.camps = await this.groups.getAllOpenGroups (
      constants.GROUP_TYPES.CAMP
    );
    state.artInstallations = await this.groups.getAllOpenGroups (
      constants.GROUP_TYPES.ART
    );
    state.currentEvent = await this.events.getEvent (state.currentEventId);
    state.allocationGroups = (await this.groups.getUserGroups (
      this.events.getFormerEventId ()
    )) || [];
  }

  async init () {
    /**
         * We have cookie - we may init all required data from API.
         */
    try {
      await this.fetchAppInitialData ();
      const loginDetails = await this.auth.auth ();
      state.loggedUser = loginDetails.loggedUser;
      console.log(loginDetails.loggedUser);
      state.currentEventId = loginDetails.currentEventId;
      try {
        await this.fetchInitialData ();
      } catch (e) {
        console.warn (`Error fetching initial data - ${e.stack}`);
      }
      return true;
    } catch (e) {
      /**
             * Something is wrong with auth/configurations - we should redirect to login.
             */
      throw new CookieError ();
    }
  }
}
