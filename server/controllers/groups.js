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
    this.getGroup = this.getGroup.bind (this);
    this.createGroups = this.createGroups.bind (this);
    this.updateGroups = this.updateGroups.bind (this);
    this.getGroupMembers = this.getGroupMembers.bind (this);
    this.addGroupMembers = this.addGroupMembers.bind (this);
    this.removeGroupMembers = this.removeGroupMembers.bind (this);
    this.metaParams = ['noMembers'];
  }

  addQueryParamsToWhere (query, where) {
    const updatedWhere = {...where};
    for (const paramName in query) {
      let param;
      if (!this.metaParams.includes(paramName)) {
          param = query[paramName];
          updatedWhere[paramName] = param;
      }
    }
    return updatedWhere;
  }

  async getMembersInfo (members, req) {
    try {
        const allMembers = [];
        const sparkMembers = (await services.spark.post (
            `users/ids`,
            {ids: members.map(member => member.user_id)},
            req)).data.users;
        for (const member of members) {
          const parsedMember = member.toJSON();
          const sparkMember = sparkMembers.find(user => user.user_id === member.user_id);
          if (sparkMember){
              parsedMember.info = sparkMember;
          }
          allMembers.push(parsedMember);
        }
        return allMembers;
    } catch (e) {
        console.warn(e.stack);
    }
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
      const allDbMembers = groups.reduce((result, value) => {
        return [...result, ...value.members];
      }, []);
      const allMembers = await await this.getMembersInfo(allDbMembers, req);
      const parsedGroups = [];
      for (const group of groups) {
        const parsedGroup = group.toJSON();
        if (!req.query.noMembers) {
            parsedGroup.members = allMembers.filter(member => member.group_id === group.id);
        }
        parsedGroups.push(parsedGroup);
      }
      next (
        new GenericResponse  (constants.RESPONSE_TYPES.JSON, {
          groups: parsedGroups,
        })
      );
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error (`Failed fetching groups- ${e.stack}`)
        )
      );
    }
  }

  async getGroup (req, res, next) {
    try {
      if (!req.params.groupId) {
        throw new Error ('Must send groupId param!');
      }
      const group = await services.db.Groups.findByPk (req.params.groupId, {
        include: [
          {
            model: services.db.GroupMembers,
            as: 'members',
            where: this.DEFAULT_WHERE_OPTIONS,
            required: false,
          },
        ],
      });
      const parsedGroup = group.toJSON ();
      parsedGroup.members = await this.getMembersInfo (group.members, req);
      next (
        new GenericResponse (constants.RESPONSE_TYPES.JSON, {
          group: parsedGroup,
        })
      );
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
      const results = {
        success: [],
        failures: [],
        failedEmails: [],
        existing: [],
      };
      for (const group of req.body.groups) {
        try {
          let main_contact;
          try {
            main_contact = (await services.spark.get (
              `users/email/${group.contact_person_email}`,
              req
            )).data;
          } catch (e) {
            results.failedEmails.push (group.contact_person_email);
          }
          if (main_contact) {
            try {
              await this.createMemberForNewGroup (group, main_contact);
            } catch (e) {
              results.failedEmails.push (group.contact_person_email);
            }
          }
          const existing = await services.db.Groups.findOne ({
            where: {group_name: group.group_name},
          });
          let dbGroup;
          if (existing) {
            results.existing.push (group.group_name);
          } else {
            dbGroup = await services.db.Groups.create (group, {
              returning: true,
            });
            results.success.push (dbGroup);
          }
        } catch (e) {
          results.failures.push (group.group_name);
        }
      }

      next (new GenericResponse (constants.RESPONSE_TYPES.JSON, {results}));
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error (`Failed creating groups- ${e.stack}`)
        )
      );
    }
  }

  async createMemberForNewGroup (group, main_contact) {
    try {
      await services.db.GroupMembers.create ({
        GroupId: group.id,
        role: constants.GROUP_STATIC_ROLES.LEADER,
        user_id: main_contact.user_id,
      });
      console.log (main_contact);
    } catch (e) {
      console.warn (
        'Could not create main member for group',
        main_contact,
        group.group_name
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

  // GROUP MEMBERS

  async getGroupMembers (req, res, next) {
    try {
      const where = this.addQueryParamsToWhere (req.query, {
        ...this.DEFAULT_WHERE_OPTIONS,
      });
      const members = await services.db.GroupMembers.findAll ({
        where,
      });
      next (new GenericResponse (constants.RESPONSE_TYPES.JSON, {members}));
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error (`Failed fetching members- ${e.stack}`)
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
