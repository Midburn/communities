import './i18n';
import { AuthService } from './auth';
import { CampsService } from './camps';
import { state } from '../models/state';

export class CookieError extends Error {}

export class InitilizationService {

    auth = new AuthService();
    camps = new CampsService();

    async fetchInitialData() {
        /**
         * Put all requests for initial data here.
         */
        state.camps = await this.camps.getOpenCamps();
    }

    async init() {
        /**
         * We have cookie - we may init all required data from API.
         */
        try {
           await this.auth.auth();
           await this.fetchInitialData();
           return true;
        } catch (e) {
            /**
             * Something is wrong with the cookie - we should redirect to login.
             */
            throw new CookieError();
        }
    }

}
