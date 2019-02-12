/**
 * This is used to unify Spark and Local way of describing group
 */
class GroupMembership {
  constructor (data) {
    this.data = data;
    this.id = data.id || data.group_id;
    this.group_type = (data.group_type || ' ').toLowerCase ();
    // Hacky way to handle Spark's member status key.
    this.isMember =
      (data.hasOwnProperty ('member_status') &&
        data.member_status.includes ('approved')) ||
      true;
  }
}

module.exports = {
  GroupMembership,
};
