import i18n from './i18n';
import axios from 'axios';
import {state} from '../models/state';
import {EventsService} from './events';

export class GroupsService {
  eventService = new EventsService ();

  async getGroup (id) {
    try {
      return (await axios.get (`/api/v1/spark/camps/${id}`, {
        withCredentials: true,
      })).data.body.camp;
    } catch (e) {
      console.warn (`Error fetching camps ${e.stack}`);
    }
  }

  async getOpenCamps () {
    try {
      return (await axios.get ('/api/v1/spark/camps/open', {
        withCredentials: true,
      })).data.body.camps;
    } catch (e) {
      console.warn (`Error fetching camps ${e.stack}`);
    }
  }

  async getOpenArts () {
    try {
      return (await axios.get ('/api/v1/spark/camps/arts/open', {
        withCredentials: true,
      })).data.body.artInstallations;
    } catch (e) {
      console.warn (`Error fetching camps ${e.stack}`);
    }
  }

  async getCampsMembers (campId, eventId) {
    try {
      return (await axios.get (
        `/api/v1/spark/camps/${campId}/members?eventId=${eventId || ''}`,
        {withCredentials: true}
      )).data.body.members;
    } catch (e) {
      console.warn (`Error fetching camp members ${e.stack}`);
    }
  }

  async getCampsMembersCount (campId) {
    try {
      return (await axios.get (`/api/v1/spark/camps/${campId}/members/count`, {
        withCredentials: true,
      })).data.body.members;
    } catch (e) {
      console.warn (`Error fetching camp members ${e.stack}`);
    }
  }

  async getCampsMembersTickets (campId, eventId) {
    try {
      return (await axios.get (
        `/api/v1/spark/camps/${campId}/members/tickets?eventId=${eventId || ''}`,
        {withCredentials: true}
      )).data.body.tickets;
    } catch (e) {
      console.warn (`Error fetching camp members ${e.stack}`);
    }
  }

  async getAllCampsMembersTickets (ids, eventId) {
    try {
      return (await axios.post (
        `/api/v1/spark/camps/members/tickets?eventId=${eventId || ''}`,
        {ids},
        {withCredentials: true}
      )).data.body.tickets;
    } catch (e) {
      console.warn (`Error fetching camp members ${e.stack}`);
    }
  }

  async getUserGroups (eventId) {
    try {
      return (await axios.get (
        `/api/v1/spark/usersGroups?eventId=${eventId || ''}`,
        {withCredentials: true}
      )).data.body;
    } catch (e) {
      console.warn (`Error fetching camp members ${e.stack}`);
    }
  }

  async getAllGroups (type, eventId) {
    try {
      if (!type) {
        throw new Error ('You must specify type when fetching all camps/arts');
      }
      return (await axios.get (
        `/api/v1/spark/camps/all/${type}?eventId=${eventId || ''}`,
        {withCredentials: true}
      )).data.body;
    } catch (e) {
      console.warn (`Error fetching all ${type}s ${e.stack}`);
    }
  }

  async sparkGroupMemberAction (groupId, memberId, actionType, eventId) {
    try {
      return (await axios.get (
        `/api/v1/spark/camps/${groupId}/members/${memberId}/${actionType}?eventId=${eventId || ''}`,
        {withCredentials: true}
      )).data.body;
    } catch (e) {
      console.warn (`Error performing action - ${actionType} - ${e.stack}`);
      throw e;
    }
  }

  getPropertyByLang (group, propName) {
    if (!group || !propName) {
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
    if (!group.hasOwnProperty (propName)) {
      console.warn (
        `Property ${propName} doesn't exist in Camp! maybe the model changed?`
      );
      return '';
    }
    return group[propName];
  }

  sendJoinRequest (camp) {
    return new Promise (resolve => {
      setTimeout (resolve, 10000);
    });
  }

  getUsersGroupId (type) {
    if (!state.isUserGroups) {
      return;
    }
    for (const g of state.userGroups.groups) {
      if (g.group_type.toLowerCase ().includes (type)) {
        return g.group_id;
      }
    }
  }

  async getPresaleAllocationGroups () {
    try {
      const groups = (await this.getUserGroups (
        this.eventService.getFormerEventId ()
      )).groups;
      return await Promise.all (
        groups.map (group => this.getGroup (group.group_id))
      );
    } catch (e) {
      console.warn ('Error getting allocation data');
    }
  }
}
