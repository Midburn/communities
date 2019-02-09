const services = require ('../services');
const GenericResponse = require ('../../models/generic-response');
const constants = require ('../../models/constants');

module.exports = class GroupsController {
  constructor () {
    this.DEFAULT_WHERE_OPTIONS = {
      record_status: constants.DB_RECORD_STATUS_TYPES.ACTIVE,
    };
    this.config = services.config;
    this.getGroups = this.getGroups.bind (this);
    this.createGroups = this.createGroups.bind (this);
    this.updateGroups = this.updateGroups.bind (this);
    this.addGroupMembers = this.addGroupMembers.bind (this);
    this.removeGroupMembers = this.removeGroupMembers.bind (this);
  }

  addQueryParamsToWhere (query, where) {
    const updatedWhere = {...where};
    for (const paramName in query) {
      const param = query[paramName];
      updatedWhere[paramName] = param;
    }
    return updatedWhere;
  }

  async getGroups (req, res, next) {
    try {
      const where = this.addQueryParamsToWhere (
        req.query,
        this.DEFAULT_WHERE_OPTIONS
      );
      const groups = await services.db.Groups.findAll ({
        where,
        include: [
          {
            model: services.db.GroupMembers,
            as: 'members',
            where: this.DEFAULT_WHERE_OPTIONS,
            required: false,
          },
        ],
      });
      next (new GenericResponse (constants.RESPONSE_TYPES.JSON, {groups}));
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error (`Failed fetching groups- ${e.stack}`)
        )
      );
    }
  }

  async createGroups (req, res, next) {
    try {
      if (!req.body.groups || !Array.isArray (req.body.groups)) {
        throw new Error (
          'Body must contain prop `group` which is an array of groups (Camps/Art installations)'
        );
      }
      const groups = await services.db.Groups.bulkCreate (req.body.groups, {
        returning: true,
      });
      next (new GenericResponse (constants.RESPONSE_TYPES.JSON, {groups}));
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error (`Failed creating groups- ${e.stack}`)
        )
      );
    }
  }

  async updateGroups (req, res, next) {
    try {
      if (!req.body.groups || !Array.isArray (req.body.groups)) {
        throw new Error (
          'Body must contain prop `group` which is an array of groups (Camps/Art installations)'
        );
      }
      const result = {
        success: [],
        failures: [],
      };
      for (const group of req.body.groups) {
        if (!group.id) {
          result.comment =
            'Some groups were sent without ids, could not update groups without id';
          continue;
        }
        await services.db.Groups.update (group, {where: {id: group.id}});
        result.success.push (group.id);
        try {
        } catch (e) {
          result.failures.push (group.id);
        }
      }
      next (new GenericResponse (constants.RESPONSE_TYPES.JSON, {result}));
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error (`Failed updating groups- ${e.stack}`)
        )
      );
    }
  }

  async addGroupMembers (req, res, next) {
    try {
      if (!req.body.members || !Array.isArray (req.body.members)) {
        throw new Error (
          'Body must contain prop `members` which is an array of members data'
        );
      }
      const result = {
        success: [],
        failures: [],
      };
      const currentMembers = await services.db.GroupMembers.findAll ({
        where: {GroupId: req.params.groupId, ...this.DEFAULT_WHERE_OPTIONS},
      });
      const currentMembersIds = currentMembers.map (m => m.user_id.toString ());
      const membersToAdd = req.body.members.filter (
        newMember =>
          newMember.id && !currentMembersIds.includes (newMember.id.toString ())
      );
      for (const member of membersToAdd) {
        try {
          await services.db.GroupMembers.create ({
            user_id: member.id,
            GroupId: req.params.groupId,
            role: member.role,
          });
          result.success.push (member.id);
        } catch (e) {
          console.warn (e.stack);
          result.failures.push (member.id);
        }
      }
      next (new GenericResponse (constants.RESPONSE_TYPES.JSON, {result}));
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error (`Failed adding group members- ${e.stack}`)
        )
      );
    }
  }

  async removeGroupMembers (req, res, next) {
    try {
      if (!req.body.members || !Array.isArray (req.body.members)) {
        throw new Error (
          'Body must contain prop `members` which is an array of member ids'
        );
      }
      const result = {
        success: [],
        failures: [],
      };
      const currentMembers = await services.db.GroupMembers.findAll ({
        where: {GroupId: req.params.groupId, ...this.DEFAULT_WHERE_OPTIONS},
      });
      const currentMembersIds = currentMembers.map (m => m.user_id.toString ());
      const membersToRemove = req.body.members.filter (newMemberId =>
        currentMembersIds.includes (newMemberId.toString ())
      );
      for (const id of membersToRemove) {
        try {
          await services.db.GroupMembers.update (
            {
              record_status: constants.DB_RECORD_STATUS_TYPES.DELETED,
            },
            {where: {user_id: id, GroupId: req.params.groupId}}
          );
          result.success.push (id);
        } catch (e) {
          console.log (e);
          result.failures.push (id);
        }
      }
      next (new GenericResponse (constants.RESPONSE_TYPES.JSON, {result}));
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error (`Failed adding group members- ${e.stack}`)
        )
      );
    }
  }
};
