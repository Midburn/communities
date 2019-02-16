const services = require ('../services');
const GenericResponse = require ('../../models/generic-response');
const constants = require ('../../models/constants');

module.exports = class AllocationsController {
  constructor () {
    this.config = services.config;
    this.allocate = this.allocate.bind (this);
    this.publishGroupAllocations = this.publishGroupAllocations.bind (this);
    this.getGroupsAllocation = this.getGroupsAllocation.bind (this);
    this.getMembersAllocations = this.getMembersAllocations.bind (this);
    this.removeAllocation = this.removeAllocation.bind (this);
    this.adminAllocationToGroup = this.adminAllocationToGroup.bind (this);
    this.getAdminsAllocations = this.getAdminsAllocations.bind (this);
  }

  async publishGroupAllocations (req, res, next) {
    try {
      if (
        !req.params.group_type ||
        !req.params.event_id ||
        !req.params.allocation_type
      ) {
        throw new Error ('Must specify all parameters for publishing');
      }
      await services.db.AdminAllocationRounds.update (
        {publication_date: new Date ()},
        {
          where: {
            allocation_type: req.params.allocation_type,
            publication_date: {$eq: null},
            group_type: req.params.group_type,
            event_id: req.params.event_id,
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
          new Error (`Failed adding allocations- ${e.stack}`)
        )
      );
    }
  }

  async allocate (req, res, next) {
    try {
      await services.db.Allocations.create (req.body);
      next (
        new GenericResponse (constants.RESPONSE_TYPES.JSON, {success: true})
      );
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error (`Failed adding allocations- ${e.stack}`)
        )
      );
    }
  }

  async adminAllocationToGroup (req, res, next) {
    try {
      const where = {
        group_id: req.body.group_id,
        publication_date: {$eq: null},
        allocation_type: req.body.allocation_type,
        event_id: req.body.event_id,
      };
      const record = await services.db.AdminAllocationRounds.findOne ({where});
      if (!record) {
        await services.db.AdminAllocationRounds.create (req.body);
      } else {
        Object.keys (req.body).forEach (key => {
          record[key] = req.body[key];
        });
        await record.save ();
      }
      next (
        new GenericResponse (constants.RESPONSE_TYPES.JSON, {success: true})
      );
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error (`Failed adding allocations- ${e.stack}`)
        )
      );
    }
  }

  async getAdminsAllocations (req, res, next) {
    try {
      const groupAllocations = await services.db.AdminAllocationRounds.findAll (
        {
          where: {
            event_id: req.params.event_id,
            group_type: req.params.group_type,
            allocation_type: req.params.allocation_type,
          },
        }
      );
      const dictionary = {};
      for (let group of groupAllocations) {
        group = group.toJSON ();
        let key;
        if (group.publication_date) {
          key = group.group_id;
        } else {
          key = constants.UNPUBLISHED_ALLOCATION_KEY;
        }
        dictionary[key] = dictionary[key]
          ? [...dictionary[key], group]
          : [group];
      }
      next (
        new GenericResponse (constants.RESPONSE_TYPES.JSON, {
          allocations: dictionary,
        })
      );
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error (`Failed adding allocations- ${e.stack}`)
        )
      );
    }
  }

  async removeAllocation (req, res, next) {
    try {
      const allocation = await services.db.Allocations.findByPk (req.params.id);
      if (!allocation) {
        throw new Error ('No allocation found');
      }
      allocation.record_status = constants.DB_RECORD_STATUS_TYPES.DELETED;
      await allocation.save ();
      next (
        new GenericResponse (constants.RESPONSE_TYPES.JSON, {success: true})
      );
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error (`Failed adding allocations- ${e.stack}`)
        )
      );
    }
  }

  async getGroupsAllocation (req, res, next) {
    try {
      const related_group = req.body.ids;
      const allocations = await services.db.Allocations.findAll ({
        where: {
          related_group: {$in: related_group},
          record_status: constants.DB_RECORD_STATUS_TYPES.ACTIVE,
        },
      });
      const buckets = await services.db.AdminAllocationRounds.findAll ({
        where: {
          group_id: {$in: related_group},
          publication_date: {$ne: null},
          record_status: constants.DB_RECORD_STATUS_TYPES.ACTIVE,
        },
      });
      next (
        new GenericResponse (constants.RESPONSE_TYPES.JSON, {
          allocations,
          buckets,
        })
      );
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error (`Failed getting group allocations - ${e.stack}`)
        )
      );
    }
  }

  async getMembersAllocations (req, res, next) {
    try {
      const allocated_to = req.body.ids;
      const allocations = await services.db.Allocations.findAll ({
        where: {
          allocated_to: {$in: allocated_to},
          record_status: constants.DB_RECORD_STATUS_TYPES.ACTIVE,
        },
      });
      next (new GenericResponse (constants.RESPONSE_TYPES.JSON, {allocations}));
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error (`Failed getting member's allocations - ${e.stack}`)
        )
      );
    }
  }
};
