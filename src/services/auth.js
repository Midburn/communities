import * as axios from 'axios';
import { state } from '../models/state';

export class AuthService {


    async auth() {
        try {
            const response = await axios.get(`/api/v1/user`, { withCredentials: true });
            const { user, currentEventId } = response.data.body;
            return {
                loggedUser: user,
                currentEventId
            };
        } catch (e) {
            throw e;
        }
    }

    async logOut() {
        window.location.href = `${state.configurations.SPARK_HOST}/en/logout`;
    }
}
