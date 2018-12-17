import './i18n';


export class CookieError extends Error {}

export class InitilizationService {

    async fetchInitialData() {
        /**
         * Put all requests for initial data here.
         */
    }

    async init() {
        if (!document.cookie || !document.cookie.includes('authToken')) {
            /**
             * We don't have cookie - we need to redirect to login.
             */
            throw new CookieError();
        }
        /**
         * We have cookie - we may init all required data from API.
         */
        try {
            await this.fetchInitialData();
        } catch (e) {
            /**
             * Something is wrong with the cookie - we should redirect to login.
             */
            throw new CookieError();
        }
    }

}
