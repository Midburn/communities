const services = require ('../services');
const GenericResponse = require ('../../models/generic-response');
const constants = require ('../../models/constants');
const db = require ('../services/database');
const GroupMembership = require ('../../models/group-translator')
  .GroupMembership;
const Group = require ('../../models/group-translator').Group;

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

  getSparkFlagFromQuery (query) {
    try {
      return JSON.parse (query.from_spark);
    } catch (e) {
      return false;
    }
  }

  async getCamp (req, res, next) {
    try {
      let group;
      const fromSpark = this.getSparkFlagFromQuery (req.query);
      if (req.MetaKeys.spark_active || fromSpark) {
        group = (await this.spark.get (`camps/${req.params.id}/get`, req)).data
          .camp;
      } else {
        group = (await services.db.Groups.findByPk (req.params.id)).toJSON ();
      }

      if (!group) {
        return next (
          new GenericResponse (constants.RESPONSE_TYPES.JSON, {camp: null}, 404)
        );
      }

      const parsedCamp = new Group (group, fromSpark);
      return next (
        new GenericResponse (constants.RESPONSE_TYPES.JSON, {camp: parsedCamp})
      );
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error ('Failed getting camp')
        )
      );
    }
  }

  async getOpenGroupsByType (type, fromSpark, req) {
    let groups;
    if (fromSpark) {
      const res = (await this.spark.get (
        type === constants.GROUP_TYPES.CAMP ? `camps_open` : 'camps/arts',
        req
      )).data;
      groups = type === constants.GROUP_TYPES.CAMP
        ? res.camps
        : res.artInstallations;
    } else {
      groups = await services.db.Groups.findAll ({
        where: {
          group_type: type,
          group_status: constants.GROUP_STATUS.OPEN,
        },
      }).map(group => group.toJSON());
    }
    return groups.map (group => new Group (group));
  }

  async getOpenCamps (req, res, next) {
    try {
      const fromSpark =
        req.MetaKeys.spark_active || this.getSparkFlagFromQuery (req.query);
      const groups = await this.getOpenGroupsByType (
        constants.GROUP_TYPES.CAMP,
        fromSpark,
        req
      );
      next (
        new GenericResponse (constants.RESPONSE_TYPES.JSON, {camps: groups})
      );
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
      const fromSpark =
        req.MetaKeys.spark_active || this.getSparkFlagFromQuery (req.query);
      const groups = await this.getOpenGroupsByType (
        constants.GROUP_TYPES.ART,
        fromSpark,
        req
      );
      next (
        new GenericResponse (constants.RESPONSE_TYPES.JSON, {
          artInstallations: groups,
        })
      );
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
    function mergeGroups (sparkGroups, localGroups) {
      localGroups = (localGroups || []).map (g => new GroupMembership (g));
      sparkGroups = (sparkGroups || [])
        .map (g => new GroupMembership (g, true));
      return [...(sparkGroups || []), ...(localGroups || [])];
    }
    try {
      let path = `my_groups`;
      if (req.query.eventId) {
        path += `?eventId=${req.query.eventId}`;
      }
      const loggedUser = await services.db.LoggedUsers.findOne ({
        where: {email: req.userDetails.email},
      });
      const sparkGroups = (await this.spark.get (path, req)).data.groups;
      const localMemberships = await services.db.GroupMembers.findAll ({
        where: {user_id: loggedUser.user_id},
      });
      let localGroups;
      if (localMemberships && localMemberships.length) {
        localGroups = await services.db.Groups.findAll ({
          where: {
            id: {$in: localMemberships.map (m => m.id)},
            event_id: req.query.eventId || req.userDetails.currentEventId,
          },
        });
      }
      const groups = mergeGroups (sparkGroups, localGroups);
      next (
        new GenericResponse (constants.RESPONSE_TYPES.JSON, {
          groups,
        })
      );
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error ('Failed getting camp members', e.stack)
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
      const fromSpark =
        req.MetaKeys.spark_active || this.getSparkFlagFromQuery (req.query);
      let groups;
      if (fromSpark) {
        groups = await this.getAllFromSpark (req);
      } else {
        groups = (await services.db.Groups.findAll ({
          where: {
            group_type: req.params.type,
            event_id: req.MetaKeys.event_id || req.query.eventId,
          },
        })).map(g => g.toJSON());
      }
      const parsed = groups.map (group => new Group (group));
      next (new GenericResponse (constants.RESPONSE_TYPES.JSON, parsed));
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error ('Failed getting camp members')
        )
      );
    }
  }

  async getAllFromSpark (req) {
    let path = '';
    switch (req.params.type) {
      case constants.GROUP_TYPES.CAMP:
        path = 'camps_all';
        break;
      case constants.GROUP_TYPES.ART:
        path = 'art_all';
        break;
      default:
        throw new Error ('You must specify type when fetching all camps/arts');
    }
    if (req.query.eventId) {
      path += `?eventId=${req.query.eventId}`;
    }
    return (await this.spark.get (path, req)).data.camps;
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
