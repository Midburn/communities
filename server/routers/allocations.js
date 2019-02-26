const Router = require ('express').Router;
const controllers = require ('../controllers');

module.exports = class AllocationsRouter {
  constructor () {
    this.router = new Router ();
    this.controller = controllers.allocations;
    this.initMiddleware ();
    this.initRoutes ();
  }

  initMiddleware () {
    // Version Router level middlewares
  }

  initRoutes () {
    /**
         * create new allocation
         * E.G - POST /api/VERSION/allocations
         */
    this.router.route ('/allocations').post (this.controller.allocate);
    /**
         * remove allocation
         * E.G - DELETE /api/VERSION/allocations
         */
    this.router
      .route ('/allocations/:group_id/:id/')
      .delete (this.controller.removeAllocation);
    /**
         * get allocations for certain groups
         * E.G - POST /api/VERSION/allocations/groups
         */
    this.router
      .route ('/allocations/groups')
      .post (this.controller.getGroupsAllocation);
    /**
         * set allocations for certain groups
         * E.G - POST /api/VERSION/allocations/admin/
         */
    this.router
      .route ('/allocations/admin')
      .post (this.controller.adminAllocationToGroup);
    /**
         * get allocations for certain groups
         * E.G - GET /api/VERSION/allocations/groups/:id
         */
    this.router
      .route ('/allocations/admin/:event_id/:allocation_type/:group_type')
      .get (this.controller.getAdminsAllocations)
      .post (this.controller.publishGroupAllocations);
    /**
         * get allocations for certain members
         * E.G - POST /api/VERSION/allocations/members/:id
         */
    this.router
      .route ('/allocations/members')
      .post (this.controller.getMembersAllocations);
  }
};
