const Router = require('express').Router;
const controllers = require('../controllers');

module.exports = class CampsRouter {

    constructor() {
        this.router = new Router();
        this.initMiddleware();
        this.initRoutes();
    }

    initMiddleware() {
        // Version Router level middlewares
    }

    initRoutes() {
        /**
         * E.G - /api/VERSION/spark/camps/open
         */
        this.router.get('/spark/camps/open', controllers.sparkCamps.getOpenCamps);
        this.router.get('/spark/camps/arts/open', controllers.sparkCamps.getOpenArts);
        this.router.get('/spark/camps/all/:type', controllers.sparkCamps.getAllByType);
        this.router.post('/spark/camps/updatePresaleQuota', controllers.sparkCamps.updatePresaleQuota);
        this.router.get('/spark/camps/:id', controllers.sparkCamps.getCamp);
        this.router.get('/spark/camps/:id/members', controllers.sparkCamps.getCampMembers);
        this.router.get('/spark/camps/:id/members/count', controllers.sparkCamps.getCampMembersCount);
        this.router.get('/spark/camps/:id/members/tickets', controllers.sparkCamps.getCampMembersTickets);
        this.router.get('/spark/usersGroups', controllers.sparkCamps.getUsersGroups);
    }
};
