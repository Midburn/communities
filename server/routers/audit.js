const Router = require('express').Router;
const controllers = require('../controllers');

module.exports = class AuditRouter {

    constructor() {
        this.router = new Router();
        this.controller = controllers.audit;
        this.initMiddleware();
        this.initRoutes();
    }

    initMiddleware() {
        // Version Router level middlewares
    }

    initRoutes() {
        /**
         * Get And Set audits
         * E.G - /api/VERSION/audit/presale_allocation_update
         */
        this.router.route('/audit/:type')
            .get(this.controller.getAudits)
            .post(this.controller.setAudit);
        /**
         * Get audits for related entity (camp, user etc...)
         * E.G - /api/VERSION/audit/presale_allocation_update/12
         */
        this.router.get('/audit/:type/:id', this.controller.getAuditsForEntity)
    }
};
