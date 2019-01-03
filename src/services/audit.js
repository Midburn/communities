import axios from 'axios';
import { state } from '../models/state';

export class AuditService {

    async setAudit(type) {
        try {
            return (await axios.post(`/api/v1/audit/${type}`, { updated_by: state.loggedUser.user_id }, {withCredentials: true})).data.body;
        } catch (e) {
            console.warn(`Error fetching camps ${e.stack}`);
        }
    }

    async getAudits(type) {
        try {
            return (await axios.get(`/api/v1/audit/${type}`, {withCredentials: true})).data.body.audits;
        } catch (e) {
            console.warn(`Error fetching camps ${e.stack}`);
        }
    }

    async getAuditsForEntity(type, id) {
        try {
            return (await axios.get(`/api/v1/audit/${type}/${id}`, {withCredentials: true})).data.body.audits;
        } catch (e) {
            console.warn(`Error fetching camps ${e.stack}`);
        }
    }

}
