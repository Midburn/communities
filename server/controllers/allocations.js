const services = require ('../services');
const GenericResponse = require ('../../models/generic-response');
const constants = require ('../../models/constants');

module.exports = class AllocationsController {
  constructor () {
    this.config = services.config;
    this.allocationsService = services.allocations;
    this.allocate = this.allocate.bind (this);
    this.getGroupsAllocation = this.getGroupsAllocation.bind (this);
    this.getMembersAllocations = this.getMembersAllocations.bind (this);
    this.removeAllocation = this.removeAllocation.bind (this);
    this.adminAllocationToGroup = this.adminAllocationToGroup.bind (this);
    this.getAdminsAllocations = this.getAdminsAllocations.bind (this);
    this.getAllocationRounds = this.getAllocationRounds.bind (this);
    this.getBuckets = this.getBuckets.bind (this);
    this.updateGroupsBuckets = this.updateGroupsBuckets.bind (this);
  }

  async getAllocationRounds (req, res, next) {
    try {
      const data = await this.allocationsService.get ('rounds', req);
      next (new GenericResponse (constants.RESPONSE_TYPES.JSON, data));
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error (`Failed getting allocation rounds - ${e.stack}`)
        )
      );
    }
  }

  async getBuckets (req, res, next) {
    const {allocation_type, group_type, event_id} = req.params;
    try {
      if (!event_id || !allocation_type || !group_type) {
        throw new Error (
          'Request must contain event_id, allocation_type, group_type, event_id params'
        );
      }
      const basedOnEventId = allocation_type ===
        constants.ALLOCATION_TYPES.PRE_SALE
        ? constants.getFormerEventId (event_id)
        : event_id;
      const allocationType = constants.ALLOCATIONS_SERVICE.getAllocationType (
        allocation_type
      );
      const data = await this.allocationsService.get (
        `buckets/${event_id}/${basedOnEventId}/${allocationType}`,
        req
      );
      next (new GenericResponse (constants.RESPONSE_TYPES.JSON, data));
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error (`Failed getting allocation buckets - ${e.stack}`)
        )
      );
    }
  }

  /**
   * Bucket Model in allocation service
    active: {type: Boolean, required: true},
    event_id: {type: String, required: true},
    based_on_event_id: {type: String, required: true},
    group_id: {type: String, required: true},
    group_name: {type: String, required: true},
    amount: {type: Number, required: true},
    group_type: {
      type: String,
      required: true,
      enum: constants.ALLOCATIONS_SERVICE.GROUP_TYPES,
    },
    allocation_type: {
      type: String,
      required: true,
      enum: constants.ALLOCATIONS_SERVICE.ALLOCATION_TYPES,
    }} req 
   */
  async updateGroupsBuckets (req, res, next) {
    const {allocation_type, group_type, event_id} = req.params;
    try {
      if (!event_id || !allocation_type || !group_type || !req.body.groups) {
        throw new Error (
          'Request must contain event_id, allocation_type, group_type, event_id params and groups prop containing group array'
        );
      }
      // We expect to receive an array of groups to update
      const groups = req.body.groups;
      for (const group of groups) {
        // A group should be an object of {id, name, quota};
        await this.allocationsService.post (
          'buckets/create',
          {
            active: true,
            event_id,
            based_on_event_id: allocation_type ===
              constants.ALLOCATION_TYPES.PRE_SALE
              ? constants.getFormerEventId (event_id)
              : event_id,
            group_id: group.id,
            group_name: group.name,
            amount: group.quota,
            group_type: constants.ALLOCATIONS_SERVICE.getAllocationGroup (
              group_type
            ),
            allocation_type: constants.ALLOCATIONS_SERVICE.getAllocationType (
              allocation_type
            ),
          },
          req
        );
      }
      // Log changes locally - don't use await to not break process
      this.logPublicationLocally (allocation_type, group_type, event_id);
      next (
        new GenericResponse (constants.RESPONSE_TYPES.JSON, {success: true})
      );
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error ('Failed updating buckets')
        )
      );
    }
  }

  /**
   * Log publications (admin updated bucket for group)
   * @param {*} allocation_type (from constants)
   * @param {*} group_type (from constants)
   * @param {*} event_id 
   */
  async logPublicationLocally (allocation_type, group_type, event_id) {
    try {
      await services.db.AdminAllocationRounds.update (
        {publication_date: new Date ()},
        {
          where: {
            allocation_type: allocation_type,
            publication_date: {$eq: null},
            group_type: group_type,
            event_id: event_id,
          },
        }
      );
    } catch (e) {
      console.warn ('Could not log publications', e.stack);
    }
  }

  async allocations (req, res, next) {
    try {
      const data = await this.allocationsService.get ('allocations', req);
      next (new GenericResponse (constants.RESPONSE_TYPES.JSON, data));
    } catch (e) {
      next (
        new GenericResponse (
          constants.RESPONSE_TYPES.ERROR,
          new Error (`Failed getting allocation rounds - ${e.stack}`)
        )
      );
    }
  }

  /**
   * Allocation model in allocations service
   * profile: {type: String, required: true},
    bucket_id: {type: String, required: true},
    round_id: {type: String, required: true},
    date: {type: Number, required: true},
    allocator: {type: String, required: true},
    deleted: {type: Boolean, required: true},
    amount: {type: Number, required: true},
   */
  async allocate (req, res, next) {
    try {
      // Log allocation locally (don't use await - we don't want to kill allocation process)
      this.logAllocationLocally (req.body);

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

  async logAllocationLocally (data) {
    // Store log of allocations to local db.
    try {
      await services.db.Allocations.create (data);
    } catch (e) {
      console.warn ('Could not store allocation locally', e.stack);
    }
  }

  /**
     * Set allocations given by admin to certain group (stored locally - not a bucket)
     * @param {} req 
     * @param {*} res 
     * @param {*} next 
     */
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

  /**
     * Get allocations given by admin by certain event id (stored locally - not a bucket - used for unpublished allocations + logging) 
     * @param {} req 
     * @param {*} res 
     * @param {*} next 
     */
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
        const key =
          group.publication_date || constants.UNPUBLISHED_ALLOCATION_KEY;
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
      next (new GenericResponse (constants.RESPONSE_TYPES.JSON, {allocations}));
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
