const Audits = require('./audit'),
    Allocations = require('./allocations'),
    Permissions = require('./permissions'),
    LoggedUsers = require('./loggedusers');
const Groups = require('./group');
const GroupMembers = require('./groupmember');

module.exports = {
    Audits,
    Groups,
    GroupMembers,
    Allocations,
    Permissions,
    LoggedUsers,
};
