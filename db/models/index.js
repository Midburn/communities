const Audits = require('./audit'),
    Allocations = require('./allocations'),
    Permissions = require('./permissions'),
    LoggedUsers = require('./loggedusers'),
    Groups = require('./group'),
    GroupMembers = require('./groupmember');

module.exports = {
    Audits,
    Groups,
    GroupMembers,
    Allocations,
    Permissions,
    LoggedUsers,
};
