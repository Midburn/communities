import axios from 'axios';

export class UsersService {

    async getUserById(id) {
        try {
            return (await axios.get(`/api/v1/spark/users/${id}`, {withCredentials: true})).data.body.user;
        } catch (e) {
            console.warn(`Error fetching camps ${e.stack}`);
        }
    }

}
