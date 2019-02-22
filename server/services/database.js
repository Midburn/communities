const Sequelize = require ('sequelize');
const Models = require ('../../db/models');
const DBConfig = require ('../../db/config');
// Load environment variables default values
require ('dotenv').config ();

class DatabaseService {
  async init () {
    this.initsequelize ();
    try {
      await this.initModels ();
    } catch (e) {
      console.error ('Error syncing db models - have you ran all migration?');
      console.error (e.stack);
    }
  }

  initsequelize () {
    const envConfig = process.env.NODE_ENV === 'production'
      ? DBConfig.production
      : DBConfig.development;
    console.info (
      `Communities DB connection running with ${process.env.NODE_ENV} configuration:`
    );
    console.info (JSON.stringify (envConfig));
    this.sequelize = new Sequelize (envConfig);
  }

  async initModels () {
    this.Audits = await Models.Audits (this.sequelize, Sequelize);
    this.Groups = await Models.Groups (this.sequelize, Sequelize);
    this.GroupMembers = await Models.GroupMembers (this.sequelize, Sequelize);
    this.Allocations = await Models.Allocations (this.sequelize, Sequelize);
    this.Permissions = await Models.Permissions (this.sequelize, Sequelize);
    this.LoggedUsers = await Models.LoggedUsers (this.sequelize, Sequelize);
    this.Requests = await Models.Requests (this.sequelize, Sequelize);
    this.AdminAllocationRounds = await Models.AdminAllocationRounds (
      this.sequelize,
      Sequelize
    );
    this.MemberRoles = await Models.MemberRoles(this.sequelize, Sequelize);

    this.Groups.hasMany (this.GroupMembers, {
      as: 'members',
      foreignKey: 'group_id',
    });
      this.Groups.hasMany (this.MemberRoles, {
          as: 'roles',
          foreignKey: 'group_id',
      });
    this.GroupMembers.hasMany (this.MemberRoles, {
        as: 'roles',
        foreignKey: 'user_id',
        sourceKey: 'user_id'
    });

    // DO NOT USE FORCE TRUE - this will recreate the data base
    return await this.sequelize.sync ({force: false});
  }
}

module.exports = new DatabaseService ();
