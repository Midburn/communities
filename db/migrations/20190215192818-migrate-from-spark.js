const Sequelize = require ('sequelize');
const Models = require ('../models');
const constants = require ('../../models/constants');
require ('dotenv').config ();

async function getCommunitiesDb (config) {
  console.log (
    `Connecting to communities db with config - ${JSON.stringify (config)}`
  );
  const db = {};
  db.sequelize = new Sequelize (config);
  db.Audits = await Models.Audits (db.sequelize, Sequelize);
  db.Groups = await Models.Groups (db.sequelize, Sequelize);
  db.GroupMembers = await Models.GroupMembers (db.sequelize, Sequelize);
  db.Allocations = await Models.Allocations (db.sequelize, Sequelize);
  db.Permissions = await Models.Permissions (db.sequelize, Sequelize);
  db.LoggedUsers = await Models.LoggedUsers (db.sequelize, Sequelize);
  db.Requests = await Models.Requests (db.sequelize, Sequelize);
  db.AdminAllocationRounds = await Models.AdminAllocationRounds (
    db.sequelize,
    Sequelize
  );
  // DO NOT USE FORCE TRUE - this will recreate the data base
  await db.sequelize.sync ({force: false});
  return db;
}

async function getSparkDb (config) {
  console.log (
    `Connecting to spark db with config - ${JSON.stringify (config)}`
  );
  const db = {};
  db.sequelize = new Sequelize (config);
  return db;
}

async function getSparkData (sparkDb, tables) {
  const results = {};
  for (const tableName of tables) {
    results[
      tableName
    ] = await sparkDb.sequelize.query (`SELECT * FROM \`${tableName}\``, {
      type: sparkDb.sequelize.QueryTypes.SELECT,
    });
  }
  return results;
}

function parseSparkCampsToGroups (camps) {
  const parseType = sparkProto =>
    constants.SPARK_TYPES_TO_GROUP_TYPES[sparkProto];
  const keyTranslations = [
    ['__prototype', 'group_type', parseType],
    ['id', 'spark_id'],
    ['event_id', 'event_id'],
    ['accept_families', 'accept_families'],
    ['child_friendly', 'child_friendly'],
    ['camp_desc_en', 'group_desc_en'],
    ['camp_desc_he', 'group_desc_he'],
    ['camp_name_en', 'group_name_en'],
    ['camp_name_he', 'group_name_he'],
    ['created_at', 'created_at'],
    ['web_published', 'web_published'],
    ['status', 'group_status'],
    ['noise_level', 'noise_level'],
    ['facebook_page_url', 'facebook_url'],
    ['type', 'group_character'],
    ['main_contact', 'main_contact'],
    ['moop_contact', 'moop_contact'],
    ['safety_contact', 'safety_contact'],
    ['contact_person_id', 'contact_person_id'],
  ];
  return camps.map (sparkCamp => {
    const communitiesModel = {};
    for (const keyTranslation of keyTranslations) {
      const [sparkKey, communitiesKey, fn] = keyTranslation;
      communitiesModel[communitiesKey] = fn
        ? fn (sparkCamp[sparkKey])
        : sparkCamp[sparkKey];
    }
    // No Spark camps are open!
    communitiesModel.group_is_new_members_open = false;
    return communitiesModel;
  });
}

function getRole (group, member) {
  switch (member.user_id) {
    case group.main_contact:
      return constants.GROUP_STATIC_ROLES.LEADER;
    case group.moop_contact:
      return constants.GROUP_STATIC_ROLES.MOOP;
    case group.safety_contact:
      return constants.GROUP_STATIC_ROLES.SAFETY;
    case group.contact_person_id:
      return constants.GROUP_STATIC_ROLES.CONTACT;
    default:
      return null;
  }
}

async function getGroupMembersData (group, members) {
  const communitiesMemberships = [];
  for (const member of members) {
    const role = getRole (group, member);
    const communitiesMembership = {
      role,
      group_id: group.id,
      user_id: member.user_id,
      createdAt: new Date (),
      updatedAt: new Date (),
      record_status: 'active',
    };
    communitiesMemberships.push (communitiesMembership);
  }
  return communitiesMemberships;
}

/**
 * Starting function
 */
async function Migrate (queryInterface) {
  try {
    const sparkConfig = {
      username: process.env.SPARK_DB_USER || 'spark',
      password: process.env.SPARK_DB_PASSWORD || 'spark',
      database: process.env.SPARK_DB_DBNAME || 'spark',
      host: process.env.SPARK_DB_HOSTNAME || 'sparkdb',
      dialect: 'mysql',
      logging: false,
    };
    const communitiesConfig = {
      dialect: 'mysql',
      host: process.env.MYSQL_DB_HOST || 'communitiesdb',
      database: process.env.MYSQL_DB_NAME || 'communities',
      username: process.env.MYSQL_DB_USERNAME || 'root',
      password: process.env.MYSQL_DB_PASSWORD,
      logging: false,
    };
    const communitiesDb = await getCommunitiesDb (communitiesConfig);
    const sparkDb = await getSparkDb (sparkConfig);
    const sparkData = await getSparkData (sparkDb, ['camps', 'camp_members']);
    const groups = parseSparkCampsToGroups (sparkData.camps);
    const results = {
      success: [],
      failure: [],
    };
    for (const group of groups) {
      try {
        if (group.hasOwnProperty('group_is_new_members_open')) {
          delete group.group_is_new_members_open;
        }
        const result = await communitiesDb.Groups.create (group, {
          returning: true,
        });
        const groupMembers = await getGroupMembersData (
          result.toJSON (),
          sparkData.camp_members.filter (
            members =>
              members.status.includes ('approved') &&
              +members.camp_id === group.spark_id
          )
        );
        if (groupMembers && groupMembers.length) {
          await queryInterface.bulkInsert ('GroupMembers', groupMembers);
        }
        results.success.push (result);
      } catch (e) {
        results.failure.push (group.spark_id);
        console.warn (e);
      }
    }
    console.log (`Migrated ${results.success.length} groups`);
    console.log (`Failed ${results.failure.length} groups`);
  } catch (e) {
    console.warn (e.stack);
  }
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    if (!process.argv.includes ('no-spark')) {
      return Migrate (queryInterface);
    }
    return Promise.resolve ();
  },
  down: (queryInterface, Sequelize) => {},
};
