const services = require('../services');
const GenericResponse = require('../../models/generic-response');
const constants = require('../../models/constants');

module.exports = class AllocationsController {

    constructor() {
        this.config = services.config;
        this.allocate = this.allocate.bind(this);
        this.getGroupsAllocation = this.getGroupsAllocation.bind(this);
        this.getMembersAllocations = this.getMembersAllocations.bind(this);
        this.removeAllocation = this.removeAllocation.bind(this);
    }

    async allocate(req, res, next) {
        try {
            await services.db.Allocations.create(req.body);
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, { success: true }));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error(`Failed adding allocations- ${e.stack}`)));
        }
    }

    async removeAllocation(req, res, next) {
        try {
            const allocation = await services.db.Allocations.findByPk(req.params.id);
            if (!allocation) {
                throw new Error('No allocation found');
            }
            allocation.record_status = constants.DB_RECORD_STATUS_TYPES.DELETED;
            await allocation.save();
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, { success: true }));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error(`Failed adding allocations- ${e.stack}`)));
        }
    }

    async getGroupsAllocation(req, res, next) {
        try {
            const related_group = req.body.ids;
            const allocations = await services.db.Allocations.findAll({
                where: { related_group: { $in: related_group }, record_status: constants.DB_RECORD_STATUS_TYPES.ACTIVE }
            });
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, { allocations }));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error(`Failed getting group allocations - ${e.stack}`)));
        }
    }

    async getMembersAllocations(req, res, next) {
        try {
            const allocated_to = req.body.ids;
            const allocations = await services.db.Allocations.findAll({
                where: { allocated_to: { $in : allocated_to }, record_status: constants.DB_RECORD_STATUS_TYPES.ACTIVE }
            });
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, { allocations }));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error(`Failed getting member's allocations - ${e.stack}`)));
        }
    }
};
