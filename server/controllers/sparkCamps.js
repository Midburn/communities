const services = require ('../services');
const GenericResponse = require ('../../models/generic-response');
const constants = require ('../../models/constants');
const db = require ('../services/database');

module.exports = class SparkCampsController {
  constructor () {
    this.config = services.config;
    this.spark = services.spark;
    this.getOpenCamps = this.getOpenCamps.bind (this);
    this.getCampMembers = this.getCampMembers.bind (this);
    this.getOpenArts = this.getOpenArts.bind (this);
    this.getUsersGroups = this.getUsersGroups.bind (this);
    this.getAllByType = this.getAllByType.bind (this);
    this.getCampMembersCount = this.getCampMembersCount.bind (this);
    this.getCampMembersTickets = this.getCampMembersTickets.bind (this);
    this.getCamp = this.getCamp.bind (this);
    this.updatePresaleQuota = this.updatePresaleQuota.bind (this);
    this.sparkGroupMemberAction = this.sparkGroupMemberAction.bind (this);
    this.getCampsTickets = this.getCampsTickets.bind (this);
  }

  async getCamp (req, res, next) {
    try {
      const camp = (await this.spark.get (`camps/${req.params.id}/get`, req))
        .data;
      next (new GenericResponse (constants.RESPONSE_TYPES.JSON, camp));
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error ('Failed getting open camps')
        )
      );
    }
  }

  async getOpenCamps (req, res, next) {
    try {
      const campList = (await this.spark.get (`camps_open`, req)).data;
      next (new GenericResponse (constants.RESPONSE_TYPES.JSON, campList));
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error ('Failed getting open camps')
        )
      );
    }
  }

  async getOpenArts (req, res, next) {
    try {
      const artList = (await this.spark.get (`camps/arts`, req)).data;
      next (new GenericResponse (constants.RESPONSE_TYPES.JSON, artList));
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error ('Failed getting open camps')
        )
      );
    }
  }

  async getCampMembers (req, res, next) {
    try {
      let path = `camps/${req.params.id}/members`;
      if (req.query.eventId) {
        path += `?eventId=${req.query.eventId}`;
      }
      const members = (await this.spark.get (path, req)).data;
      next (new GenericResponse (constants.RESPONSE_TYPES.JSON, members));
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error ('Failed getting camp members')
        )
      );
    }
  }

  async getCampMembersCount (req, res, next) {
    try {
      const members = (await this.spark.get (
        `camps/${req.params.id}/members/count`,
        req
      )).data;
      next (new GenericResponse (constants.RESPONSE_TYPES.JSON, members));
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error ('Failed getting camp members')
        )
      );
    }
  }

  async getCampMembersTickets (req, res, next) {
    try {
      let path = `camps/${req.params.id}/members/tickets`;
      if (req.query.eventId) {
        path += `?eventId=${req.query.eventId}`;
      }
      const members = (await this.spark.get (path, req)).data;
      next (new GenericResponse (constants.RESPONSE_TYPES.JSON, members));
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error ('Failed getting camp members')
        )
      );
    }
  }

  async getCampsTickets (req, res, next) {
    try {
      let path = `camps/members/tickets`;
      if (req.query.eventId) {
        path += `?eventId=${req.query.eventId}`;
      }
      const members = (await this.spark.post (path, {ids: req.body.ids}, req))
        .data;
      next (new GenericResponse (constants.RESPONSE_TYPES.JSON, members));
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error ('Failed getting camp members')
        )
      );
    }
  }

  async getUsersGroups (req, res, next) {
    try {
      let path = `my_groups`;
      if (req.query.eventId) {
        path += `?eventId=${req.query.eventId}`;
      }
      const groups = (await this.spark.get (path, req)).data;
      next (new GenericResponse (constants.RESPONSE_TYPES.JSON, groups));
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error ('Failed getting camp members')
        )
      );
    }
  }

  async updatePresaleQuota (req, res, next) {
    try {
      if (!req.params.group_type) {
        throw new Error ('Must specify group type');
      }
      // We expect to receive an array of groups to update
      const groups = req.body.groups;
      for (const group of groups) {
        await this.spark.post (
          `camps/${group.id}/updatePreSaleQuota`,
          {quota: group.pre_sale_tickets_quota},
          req
        );
      }
      await db.AdminAllocationRounds.update (
        {publication_date: new Date ()},
        {
          where: {
            allocation_type: constants.ALLOCATION_TYPES.PRE_SALE,
            publication_date: {$eq: null},
            group_type: req.params.group_type,
            event_id: req.body.event_id,
          },
        }
      );
      next (
        new GenericResponse (constants.RESPONSE_TYPES.JSON, {success: true})
      );
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error ('Failed getting camp members')
        )
      );
    }
  }

  async getAllByType (req, res, next) {
    try {
      let path = '';
      switch (req.params.type) {
        case constants.GROUP_TYPES.CAMP:
          path = 'camps_all';
          break;
        case constants.GROUP_TYPES.ART:
          path = 'art_all';
          break;
        default:
          throw new Error (
            'You must specify type when fetching all camps/arts'
          );
      }
      if (req.query.eventId) {
        path += `?eventId=${req.query.eventId}`;
      }
      const groups = (await this.spark.get (path, req)).data;
      next (new GenericResponse (constants.RESPONSE_TYPES.JSON, groups.camps));
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error ('Failed getting camp members')
        )
      );
    }
  }

  async sparkGroupMemberAction (req, res, next) {
    try {
      const groupId = req.params.groupId,
        memberId = req.params.memberId,
        action = req.params.actionType;
      if (!groupId || !memberId || !action) {
        throw new Error (
          'Must specify groupId, memberId and actionType when spark executing member action'
        );
      }
      if (!Object.values (constants.SPARK_ACTION_TYPES).includes (action)) {
        throw new Error (
          `Unknown action sent - currently only ${Object.values (constants.SPARK_ACTION_TYPES).join (', ')} action type are allowed`
        );
      }
      let path = `camps/${groupId}/members/${memberId}/${action}`;
      if (req.query.eventId) {
        path += `?eventId=${req.query.eventId}`;
      }
      // We expect to receive an array of groups to update
      await this.spark.get (path, req);
      next (
        new GenericResponse (constants.RESPONSE_TYPES.JSON, {success: true})
      );
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error ('Failed getting camp members')
        )
      );
    }
  }
};
