const Audits = require('./audit'),
    Allocations = require('./allocations'),
    Permissions = require('./permissions'),
    LoggedUsers = require('./loggedusers'),
    Groups = require('./group'),
    AdminAllocationRounds = require('./adminallocationrounds'),
    GroupMembers = require('./groupmember'),
    Requests = require('./requests'),
    MemberRoles = require('./memberroles');

module.exports = {
    Audits,
    Groups,
    GroupMembers,
    Allocations,
    Permissions,
    LoggedUsers,
    Requests,
    AdminAllocationRounds,
    MemberRoles
};
