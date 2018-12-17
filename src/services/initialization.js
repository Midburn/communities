import './i18n';
import * as axios from 'axios';

export class InitilizationService {

    async login() {
        if (!document.cookie || !document.cookie.includes('connect.sid')) {
            // perform login
            try {
                const data = await axios.post('http://localhost:3333/api/apilogin', { email: 'a', password: 'a' });
                const data2 = await axios.get('http://localhost:3333/camps', {withCredentials: true});
                console.log(data);
                console.log(data2);
                console.log(document.cookie);
            } catch (e) {
                console.log(e);
            }
        } else {
            // use cookie.
        }
        console.log(document.cookie);
    }
    async init() {
        this.login();
        // If we'll need to pre-fetch data;
        return;
    }
}
