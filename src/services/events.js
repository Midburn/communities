import axios from 'axios';
import {state} from '../models/state';
import {constants} from '../../models/constants';

export class EventsService {
  async getEvent (id) {
    try {
      return (await axios.get (`/api/v1/spark/events/${id}`, {
        withCredentials: true,
      })).data.body.event;
    } catch (e) {
      console.warn (`Error fetching camps ${e.stack}`);
    }
  }

  async changeEvent (currentEventId) {
    try {
      return (await axios.post (
        `/api/v1/spark/events/change`,
        {currentEventId},
        {withCredentials: true}
      )).data.body.event;
    } catch (e) {
      console.warn (`Error fetching camps ${e.stack}`);
    }
  }

  /**
     * We should remodel Event Model in order to stop being based on string manipulations
     */
  getFormerEventId () {
    return constants.getFormerEventId (state.currentEventId);
  }
}
