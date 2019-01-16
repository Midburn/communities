const Audits = require('./audit'),
    Allocations = require('./allocations'),
    Permissions = require('./permissions'),
    LoggedUsers = require('./loggedusers'),
    Groups = require('./group'),
    GroupMembers = require('./groupmember'),
    LoggedUsers = require('./loggedusers'),
    AdminAllocationRounds = require('./adminallocationrounds');

module.exports = {
    Audits,
    Groups,
    GroupMembers,
    Allocations,
    Permissions,
    LoggedUsers,
    AdminAllocationRounds
};
