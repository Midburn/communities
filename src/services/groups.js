import i18n from './i18n';
import axios from 'axios';
import {state} from '../models/state';
import {EventsService} from './events';

export class GroupsService {
  eventService = new EventsService ();

  async getGroup (id, fromSpark) {
    try {
      let path = `/api/v1/spark/camps/${id}`;
      if (fromSpark) {
        path += '?from_spark=true';
      }
      return (await axios.get (path, {
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
      let from_spark;
      if (eventId) {
        const eventYear = eventId.replace ('MIDBURN', '');
        from_spark = parseInt (eventYear) < 2019;
      }
      return (await axios.get (
        `/api/v1/spark/camps/${campId}/members?eventId=${eventId || ''}&from_spark=${from_spark || ''}`,
        {withCredentials: true}
      )).data.body.members;
    } catch (e) {
      console.warn (`Error fetching camp members ${e.stack}`);
    }
  }

  async getCampsMembersCount (campId, eventId) {
    try {
      let from_spark;
      if (eventId) {
        const eventYear = eventId.replace ('MIDBURN', '');
        from_spark = parseInt (eventYear) < 2019;
      }
      return (await axios.get (
        `/api/v1/spark/camps/${campId}/members/count?from_spark=${from_spark || ''}`,
        {
          withCredentials: true,
        }
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
      let from_spark;
      if (eventId) {
        const eventYear = eventId.replace ('MIDBURN', '');
        from_spark = parseInt (eventYear) < 2019;
      }
      return (await axios.get (
        `/api/v1/spark/camps/all/${type}?eventId=${eventId || ''}&from_spark=${from_spark || ''}`,
        {withCredentials: true}
      )).data.body;
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
        return g.id;
      }
    }
  }

  async getPresaleAllocationGroups () {
    try {
      const groups = (await this.getUserGroups (
        this.eventService.getFormerEventId ()
      )).groups;
      return await Promise.all (
        groups.map (group => this.getGroup (group.id, group.isFromSpark))
      );
    } catch (e) {
      console.warn ('Error getting allocation data');
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

  async createGroups (groups) {
    if (!groups || !Array.isArray (groups)) {
      console.warn ('Must specify groups for creating groups');
      return;
    }
    try {
      const a = (await axios.post (
        `/api/v1/groups/`,
        {groups},
        {withCredentials: true}
      )).data.body.results;
      console.log (a);
      return a;
    } catch (e) {
      console.warn (`Error allocating quota data - ${e.stack}`);
      throw e;
    }
  }
}
