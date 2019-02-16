const Router = require ('express').Router;
const controllers = require ('../controllers');

module.exports = class UsersRouter {
  constructor () {
    this.router = new Router ();
    this.initMiddleware ();
    this.initRoutes ();
  }

  initMiddleware () {
    // Version Router level middlewares
  }

  initRoutes () {
    /**
         * E.G - /api/VERSION/spark/camps/open
         */
    this.router.get (
      '/spark/users/:id/name',
      controllers.users.getUserNameById
    );
  }
};
