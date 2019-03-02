import axios from 'axios';

export class RequestsService {
  async getRequests () {
    try {
      return (await axios.get (
        `/api/v1/requests`,
        {withCredentials: true}
      )).data.body.members;
    } catch (e) {
      console.warn (`Error fetching camp members ${e.stack}`);
    }
  }

  async addRequest (request) {
    try {
      return (await axios.post (
          `/api/v1/requests`,
          request,
          {withCredentials: true}
      )).data.body.members;
    } catch (e) {
      console.warn (`Error fetching camp members ${e.stack}`);
    }
  }

}
