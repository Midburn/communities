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
    this.addGroupRole = this.addGroupRole.bind (this);
    this.removeGroupRole = this.removeGroupRole.bind (this);
    this.metaParams = ['noMembers'];
  }

  addQueryParamsToWhere (query, where) {
    const updatedWhere = {...where};
    for (const paramName in query) {
      let param;
      if (!this.metaParams.includes (paramName)) {
        param = query[paramName];
        updatedWhere[paramName] = param;
      }
    }
    return updatedWhere;
  }

  async getGroups (req, res, next) {
    try {
      const where = this.addQueryParamsToWhere (
        req.query,
        this.DEFAULT_WHERE_OPTIONS
      );
      const {noMembers} = req.query;
      const groups = await services.db.Groups.findAll ({
        where,
        include: noMembers
          ? undefined
          : [
              {
                model: services.db.GroupMembers,
                as: 'members',
                where: this.DEFAULT_WHERE_OPTIONS,
                required: false,
              },
            ],
      });

      const allRoles = await services.db.MemberRoles.findAll ({
        where: {
          group_id: {$in: groups.map (g => g.toJSON ().id)},
        },
      });
      const allRolesDict = allRoles.reduce ((result, value) => {
        if (result[value.group_id]) {
          result[value.group_id] = [...result[value.group_id], value];
        } else {
          result[value.group_id] = [value];
        }
        return result;
      }, {});
      const parsedGroups = [];
      for (let group of groups) {
        const parsedGroup = group.toJSON ();
        parsedGroup.roles = allRolesDict[parsedGroup.id] || [];
        parsedGroups.push (parsedGroup);
      }
      next (
        new GenericResponse (constants.RESPONSE_TYPES.JSON, {
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
          {
            model: services.db.MemberRoles,
            as: 'roles',
            where: this.DEFAULT_WHERE_OPTIONS,
            required: false,
          },
        ],
      });
      next (
        new GenericResponse (constants.RESPONSE_TYPES.JSON, {
          group,
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
          const existing = await services.db.Groups.findOne ({
            where: {
              group_name_en: group.group_name_en,
              group_name_he: group.group_name_he,
              event_id: group.event_id,
            },
          });
          let dbGroup;
          if (existing) {
            results.existing.push (
              `${group.group_name_he} - ${group.group_name_en}`
            );
          } else {
            const contacts = await this.getMembersForNewGroup (group, req);
            group.main_contact = contacts[constants.GROUP_STATIC_ROLES.LEADER];
            group.contact_person_id =
              contacts[constants.GROUP_STATIC_ROLES.CONTACT];
            group.safety_contact =
              contacts[constants.GROUP_STATIC_ROLES.SAFETY];
            group.moop_contact = contacts[constants.GROUP_STATIC_ROLES.MOOP];
            group.sound_contact = contacts[constants.GROUP_STATIC_ROLES.SOUND];
            dbGroup = await services.db.Groups.create (group, {
              returning: true,
            });
            await this.createMembersForNewGroup (dbGroup.toJSON (), contacts);
            results.success.push (dbGroup);
          }
        } catch (e) {
          results.failures.push (
            `${group.group_name_he} - ${group.group_name_en}`
          );
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

  async getMemberIdByMail (email, req) {
    try {
      return (await services.spark.get (`users/email/${email}`, req)).data
        .user_id;
    } catch (e) {
      return null;
    }
  }

  async getMembersForNewGroup (group, req) {
    try {
      const contacts = {
        [constants.GROUP_STATIC_ROLES.LEADER]: await this.getMemberIdByMail (
          group.contact_person_midburn_email,
          req
        ),
        [constants.GROUP_STATIC_ROLES.CONTACT]: await this.getMemberIdByMail (
          group.contact_person_midburn_email,
          req
        ),
        [constants.GROUP_STATIC_ROLES.MOOP]: await this.getMemberIdByMail (
          group.group_moop_leader_email,
          req
        ),
        [constants.GROUP_STATIC_ROLES.SAFETY]: await this.getMemberIdByMail (
          group.group_security_leader_email,
          req
        ),
        [constants.GROUP_STATIC_ROLES.SOUND]: await this.getMemberIdByMail (
          group.group_sound_leader_email,
          req
        ),
        [constants.GROUP_STATIC_ROLES.CONTENT]: await this.getMemberIdByMail (
          group.group_content_leader_email,
          req
        ),
      };
      return contacts;
    } catch (e) {
      return {};
    }
  }

  async createMembersForNewGroup (group, contacts) {
    for (const role of Object.keys (contacts)) {
      try {
        if (role && contacts[role]) {
          const member = await services.db.GroupMembers.findOne ({
            where: {user_id: contacts[role], group_id: group.id},
          });
          if (!member) {
            await services.db.GroupMembers.create ({
              group_id: group.id,
              user_id: contacts[role],
            });
          }
          await services.db.MemberRoles.create ({
            group_id: group.id,
            role: role,
            user_id: contacts[role],
          });
        }
      } catch (e) {
        console.warn (e.stack);
      }
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

  // GROUP ROLES

  async addGroupRole (req, res, next) {
    try {
      const {user_id, group_id, role} = req.body;
      if (!user_id || !group_id || !role) {
        throw new Error ('Must state user_id, user_id, and role and body');
      }
      const result = await services.db.MemberRoles.create (req.body);
      next (new GenericResponse (constants.RESPONSE_TYPES.JSON, {result}));
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error (`Failed adding member role - ${e.stack}`)
        )
      );
    }
  }

  async removeGroupRole (req, res, next) {
    try {
      const {user_id, group_id, role} = req.body;
      if (!user_id || !group_id || !role) {
        throw new Error ('Must state user_id, user_id, and role and body');
      }
      const result = await services.db.MemberRoles.update (
        {record_status: constants.DB_RECORD_STATUS_TYPES.DELETED},
        {
          where: {
            user_id,
            group_id,
            role,
          },
        }
      );
      next (new GenericResponse (constants.RESPONSE_TYPES.JSON, {result}));
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error (`Failed adding member role - ${e.stack}`)
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
        include: [
          {
            model: services.db.MemberRoles,
            as: 'roles',
            where,
            required: false,
          },
        ],
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
        where: {group_id: req.params.groupId, ...this.DEFAULT_WHERE_OPTIONS},
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
            group_id: req.params.groupId,
            role: member.roles,
          });
          if (member.roles) {
            for (const role of member.roles) {
              try {
                await services.db.MemberRoles.create ({
                  role,
                  user_id: member.id,
                  group_id: req.params.groupId,
                });
              } catch (e) {
                console.warn (e.stack);
              }
            }
          }
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
        where: {group_id: req.params.groupId, ...this.DEFAULT_WHERE_OPTIONS},
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
            {where: {user_id: id, group_id: req.params.groupId}}
          );
          await services.db.MemberRoles.update (
            {
              record_status: constants.DB_RECORD_STATUS_TYPES.DELETED,
            },
            {where: {user_id: id, group_id: req.params.groupId}}
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
