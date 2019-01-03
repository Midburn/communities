import axios from 'axios';

export class UsersService {

    async getUserNameById(id) {
        try {
            return (await axios.get(`/api/v1/spark/users/${id}/name`, {withCredentials: true})).data.body.user;
        } catch (e) {
            console.warn(`Error fetching camps ${e.stack}`);
        }
    }

}
