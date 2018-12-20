import * as axios from 'axios';

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
            const user = await axios.get(`/api/v1/user`, { withCredentials: true });
            console.log(user);
            return true;
        } catch (e) {
            throw e;
        }
    }

    async logOut() {
        window.location.href = `${this.BASE_URL}/en/logout`;
    }
}
