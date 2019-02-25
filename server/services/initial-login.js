const db = require ('./database'),
  permissions = require ('./permissions'),
  spark = require ('./spark'),
  constants = require ('../../models/constants');

/**
 * Used to create permissions on first login.
 */
class InitialLoginService {
  async initUser (sparkUser, req) {
    const wasLogged = !!await db.LoggedUsers.findByPk (sparkUser.user_id);
    if (wasLogged) {
      return;
    }
    await db.LoggedUsers.upsert ({
      email: sparkUser.email,
      user_id: sparkUser.user_id,
      logged: true,
    });
  }
}

module.exports = new InitialLoginService ();
