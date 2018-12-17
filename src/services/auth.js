import * as axios from 'axios';

export class AuthService {

    BASE_URL = 'http://localhost:3333';
    /**
     * @param data ( {email, password} )
     * @returns {Promise<void>}
     */
    async login(data) {
        return axios.post(`${this.BASE_URL}/api/apilogin`, data, { withCredentials: true });
    }
}