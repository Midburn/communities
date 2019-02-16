import i18n from './i18n';
import axios from 'axios';
import {state} from '../models/state';
import {EventsService} from './events';
import * as constants from '../../models/constants';

export class GroupsService {
  eventService = new EventsService ();
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
      const memberships = (await this.getGroupMembers ({
        user_id: state.loggedUser.user_id,
      })).members;
      const groupResponses = await Promise.all (
        memberships.map (m => this.getGroup (m.group_id))
      );
      return groupResponses.filter (
        res => res && res.event_id === (eventId || state.currentEventId)
      );
    } catch (e) {
      console.warn ('Error getting users groups');
    }
  }

  async getAllOpenGroups (type, eventId) {
    try {
      if (!type) {
        throw new Error ('You must specify type when fetching all camps/arts');
      }
      const params = {
        group_type: type,
        event_id: eventId || state.currentEventId,
        group_status: constants.GROUP_STATUS.OPEN,
      };
      return this.getGroups (params);
    } catch (e) {
      console.warn (`Error fetching all ${type}s ${e.stack}`);
    }
  }

  async getAllGroups (type, eventId) {
    try {
      if (!type) {
        throw new Error ('You must specify type when fetching all camps/arts');
      }
      const params = {
        group_type: type,
        event_id: eventId,
      };
      return this.getGroups (params);
    } catch (e) {
      console.warn (`Error fetching all ${type}s ${e.stack}`);
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
        propName = isHeb ? 'group_name_he' : 'group_name_en';
        break;
      case 'description':
        propName = isHeb ? 'group_desc_he' : 'group_desc_en';
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

  async updatePresaleQuota (groups, group_type, eventId) {
    if (!groups || !Array.isArray (groups)) {
      console.warn ('Must specify groups for allocating presale tickets');
      return;
    }
    try {
      await axios.post (
        `/api/v1/spark/camps/updatePresaleQuota/${group_type}`,
        {groups, event_id: eventId || state.currentEventId},
        {withCredentials: true}
      ).data;
    } catch (e) {
      console.warn (`Error allocating quota data - ${e.stack}`);
    }
  }

  /**
     * GROUPS CRUD
     */
  async getGroup (id) {
    try {
      return (await axios.get (`/api/v1/groups/${id}`, {
        withCredentials: true,
      })).data.body.group;
    } catch (e) {
      console.warn (`Error fetching camps ${e.stack}`);
    }
  }

  async getGroups (params) {
    try {
      return (await axios.get (
        `/api/v1/groups/`,
        {params},
        {withCredentials: true}
      )).data.body.groups;
    } catch (e) {
      console.warn (`Error getting groups data - ${e.stack}`);
      throw e;
    }
  }

  async createGroups (groups) {
    if (!groups || !Array.isArray (groups)) {
      console.warn ('Must specify groups for creating groups');
      return;
    }
    try {
      return (await axios.post (
        `/api/v1/groups/`,
        {groups},
        {withCredentials: true}
      )).data.body.results;
    } catch (e) {
      console.warn (`Error getting groups data - ${e.stack}`);
      throw e;
    }
  }

  async updateGroups (groups) {
    if (!groups || !Array.isArray (groups)) {
      console.warn ('Must specify groups for updating groups');
      return;
    }
    try {
      return (await axios.post (
        `/api/v1/groups/`,
        {groups},
        {withCredentials: true}
      )).data.body.results;
    } catch (e) {
      console.warn (`Error getting groups data - ${e.stack}`);
      throw e;
    }
  }

  // Group members

  async getGroupMembers (params) {
    try {
      return (await axios.get (
        `/api/v1/groups/members`,
        {params},
        {withCredentials: true}
      )).data.body;
    } catch (e) {
      console.warn (`Error getting groups data - ${e.stack}`);
      throw e;
    }
  }

  async addGroupMembers (groupId, members) {
    if (!groupId) {
      console.warn ('Must specify groupId!');
      return;
    }
    try {
      return (await axios.post (
        `/api/v1/groups/${groupId}/members`,
        {members},
        {withCredentials: true}
      )).data.body;
    } catch (e) {
      console.warn (`Error getting groups data - ${e.stack}`);
      throw e;
    }
  }

  async deleteGroupMembers (groupId, members) {
    if (!groupId) {
      console.warn ('Must specify groupId!');
      return;
    }
    try {
      return (await axios.delete (
        `/api/v1/groups/${groupId}/members`,
        {members},
        {withCredentials: true}
      )).data.body;
    } catch (e) {
      console.warn (`Error getting groups data - ${e.stack}`);
      throw e;
    }
  }
}
