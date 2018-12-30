import axios from 'axios';
import { state } from '../models/state';

export class EventsService {

    async getEvent(id) {
        try {
            return (await axios.get(`/api/v1/spark/events/${id}`, {withCredentials: true})).data.body.event;
        } catch (e) {
            console.warn(`Error fetching camps ${e.stack}`);
        }
    }

    /**
     * We should remodel Event Model in order to stop being based on string manipulations
     */
    getFormerEventId() {
        let eventYear = parseInt(state.currentEventId.replace('MIDBURN', ''));
        eventYear--;
        return `MIDBURN${eventYear}`;
    }

}
