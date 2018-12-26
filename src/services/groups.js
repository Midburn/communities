import i18n from './i18n';
import axios from 'axios';
import { state } from '../models/state';

export class GroupsService {

    async getOpenCamps() {
        try {
            return (await axios.get('/api/v1/spark/camps/open', {withCredentials: true})).data.body.camps;
        } catch (e) {
            console.warn(`Error fetching camps ${e.stack}`);
        }
    }

    async getCampsMembers(campId) {
        try {
            return (await axios.get(`/api/v1/spark/camps/${campId}/members`, {withCredentials: true})).data.body;
        } catch (e) {
            console.warn(`Error fetching camp members ${e.stack}`);
        }
    }

    async getUserGroups() {
        try {
            return (await axios.get(`/api/v1/spark/usersGroups`, {withCredentials: true})).data.body;
        } catch (e) {
            console.warn(`Error fetching camp members ${e.stack}`);
        }
    }

    getPropertyByLang(camp, propName) {
        if (!camp || !propName) {
            return '';
        }
        const {lng} = i18n.language;
        const isHeb = lng === 'he';
        switch (propName) {
            case 'name':
                propName = isHeb ? 'camp_name_he' : 'camp_name_en';
                break;
            case 'description':
                propName = isHeb ? 'camp_desc_he' : 'camp_desc_en';
                break;
            default:
                break;
        }
        if (!camp.hasOwnProperty(propName)) {
            console.warn(`Property ${propName} doesn't exist in Camp! maybe the model changed?`);
            return '';
        }
        return camp[propName];
    }

    sendJoinRequest(camp) {
        return new Promise(resolve => {
            setTimeout(resolve, 10000);
        });
    }

    getUsersGroupId(type) {
        if (!state.isUserGroups) {
            return;
        }
        for (const g of state.userGroups.groups) {
            if (g.group_type.toLowerCase().includes(type)) {
                return g.group_id;
            }
        }
    }
}
