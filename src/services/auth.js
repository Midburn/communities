import * as axios from 'axios';
import { state } from '../models/state';

export class AuthService {

    BASE_URL = 'http://localhost:3000';
    /**
     * @param data ( {email, password} )
     * @returns {Promise<void>}
     */
    async login(data) {
        return axios.post(`${this.BASE_URL}/api/apilogin`, data, { withCredentials: true });
    }

    async auth() {
        try {
            const response = await axios.get(`/api/v1/user`, { withCredentials: true });
            state._loggedUser = response.data.body.user
            return true;
        } catch (e) {
            throw e;
        }
    }

    async logOut() {
        window.location.href = `${this.BASE_URL}/en/logout`;
    }
}
