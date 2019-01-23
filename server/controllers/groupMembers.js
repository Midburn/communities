const services = require('../services');
const GenericResponse = require('../../models/generic-response');
const constants = require('../../models/constants');

module.exports = class GroupMembersController {

    constructor() {
        this.config = services.config;
        this.getGroupMembers = this.getGroupMembers.bind(this);
    }

    async getGroupMembers(req, res, next) {
        try {
            if (!req.params.group_id) {
                throw new Error('Must specify group id (group_id) in request params for group members');
            }
            const members = await services.db.GroupMembers.findAll({ where: {
                GroupId: req.body.group_id
            }});
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, { members }));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error(`Failed fetching group members- ${e.stack}`)));
        }
    }

};
