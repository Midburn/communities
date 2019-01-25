const services = require('../services');
const GenericResponse = require('../../models/generic-response');
const constants = require('../../models/constants');

module.exports = class AuditController {

    constructor() {
        this.config = services.config;
        this.setAudit = this.setAudit.bind(this);
        this.getAudits = this.getAudits.bind(this);
        this.getAuditsForEntity = this.getAuditsForEntity.bind(this);
    }

    /**
     * Set update on certain data.
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async setAudit(req, res, next) {
        try {
            const data_type = req.params.type;
            const updated_by = req.body.updated_by;
            if (!updated_by) {
                throw new Error('Must specify userId when logging an audit');
            }
            if (!Object.values(constants.AUDIT_TYPES).includes(data_type)) {
                throw new Error(`Unknown audit type - ${data_type} specified, currently only ${Object.keys(constants.AUDIT_TYPES).join(', ')} are allowed`);
            }
            await services.db.Audits.create({ data_type, updated_by, ...req.body });
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, { success: true }));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error(`Failed setting audit ${e.stack}`)));
        }
    }

    /**
     * Get updates on certain data.
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async getAudits(req, res, next) {
        try {
            const data_type = req.params.type;
            if (!Object.values(constants.AUDIT_TYPES).includes(data_type)) {
                throw new Error(`Unknown audit type - ${data_type} specified, currently only ${Object.keys(constants.AUDIT_TYPES).join(', ')} are allowed`);
            }
            const audits = await services.db.Audits.findAll({
                where: { data_type },
                order: [
                    ['createdAt', 'DESC'],
                    ['id', 'DESC']
                ],
                limit: 100
            });
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, { audits }));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error(`Failed getting audits - ${e.stack}`)));
        }
    }

    /**
     * Get updates on certain data.
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async getAuditsForEntity(req, res, next) {
        try {
            const data_type = req.params.type;
            const related_entity = req.params.id;
            if (!Object.values(constants.AUDIT_TYPES).includes(data_type)) {
                throw new Error(`Unknown audit type - ${data_type} specified, currently only ${Object.keys(constants.AUDIT_TYPES).join(', ')} are allowed`);
            }
            const audits = await services.db.Audits.findAll({
                where: { data_type, related_entity },
                order: [
                    ['createdAt', 'DESC'],
                    ['id', 'DESC']
                ],
                limit: 100
            });
            next(new GenericResponse(constants.RESPONSE_TYPES.JSON, { audits }));
        } catch (e) {
            next(new GenericResponse(constants.RESPONSE_TYPES.ERROR, new Error(`Failed getting entity audits - ${e.stack}`)));
        }
    }
};
