import './i18n';
import { AuthService } from './auth';


export class CookieError extends Error {}

export class InitilizationService {

    auth = new AuthService();

    async fetchInitialData() {
        /**
         * Put all requests for initial data here.
         */
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
