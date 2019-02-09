const services = require ('../services');
const GenericResponse = require ('../../models/generic-response');
const constants = require ('../../models/constants');

module.exports = class GroupsController {
  constructor () {
    this.config = services.config;
    this.getGroups = this.getGroups.bind (this);
    this.createGroups = this.createGroups.bind (this);
    this.updateGroups = this.updateGroups.bind (this);
  }

  async getGroups (req, res, next) {
    try {
      const groups = await services.db.Groups.findAll ();
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
        await services.db.Groups.update (group);
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

  async changeMemberStatus()
};
