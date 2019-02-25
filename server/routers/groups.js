const Router = require ('express').Router;
const controllers = require ('../controllers');
const constants = require ('../../models/constants');

module.exports = class GroupRouter {
  constructor () {
    this.router = new Router ();
    this.controller = controllers.groups;
    this.initMiddleware ();
    this.initRoutes ();
  }

  initMiddleware () {
    // Version Router level middlewares
  }

  initRoutes () {
    /**
         * all groups actions
         * E.G - POST/GET/PUT /api/VERSION/group/
         */
    this.router
      .route ('/groups')
      .get (this.controller.getGroups)
      .post (this.controller.createGroups)
      .put (this.controller.updateGroups);

    this.router.route ('/groups/members').get (this.controller.getGroupMembers);
    this.router
      .route ('/groups/roles')
      .post (this.controller.addGroupRole)
      .delete (this.controller.removeGroupRole);
    this.router.route ('/groups/:groupId').get (this.controller.getGroup);
    /**
       * groups members actions
       * E.G - POST/DELETE /api/VERSION/group/1/members
       */
    this.router
      .route ('/groups/:groupId/members')
      .post (this.controller.addGroupMembers)
      .delete (this.controller.removeGroupMembers);
  }
};
