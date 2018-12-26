import axios from 'axios';

export class ConfigurationsService {

    async getConfigurations() {
        try {
            return (await axios.get('/api/v1/configurations', { withCredentials: true })).data.body;
        } catch (e) {
            console.warn(`Error fetching configurations ${e.stack}`);
        }
    }

}
