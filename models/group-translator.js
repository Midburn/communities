const constants = require ('./constants');
/**
 * This is used to unify Spark and Local way of describing group membership
 */
class GroupMembership {
  constructor (data, isFromSpark) {
    this.isFromSpark = isFromSpark;
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

/**
 * This is used to unify Spark and local way of describing a group 
 */
class Group {
  extractNameFromJSON (manager) {
    try {
      const extraData = JSON.parse (manager.json);
      return (
        manager.name ||
        `${extraData.drupal_data.address.first_name} ${extraData.drupal_data.address.last_name}`
      );
    } catch (e) {
      return ' ';
    }
  }

  initManager (group) {
    return {
      name: group.contact_person_name,
      email: group.contact_person_email,
      phone: group.contact_person_phone,
    };
  }

  constructor (data, isFromSpark) {
    this.isFromSpark = isFromSpark;
    Object.keys (data).forEach (key => {
      // Copy all keys for same name keys in model
      this[key] = data[key];
    });
    // If no other camp type passed - its a Spark camp - so content
    this.camp_type = this.camp_type || constants.CAMP_TYPES.CONTENT;
    this.group_type = this.group_type ||
      (data.__prototype && data.__prototype.includes ('Art'))
      ? constants.GROUP_TYPES.ART
      : constants.GROUP_TYPES.CAMP;
    // parse all other keys
    this.manager = isFromSpark && data.manager
      ? {
          name: this.extractNameFromJSON (data.manager),
          phone: data.manager.phone,
          email: data.manager.email,
        }
      : this.initManager (data);
    this.group_desc_he = isFromSpark ? data.camp_desc_he : data.group_desc_he;
    this.group_desc_en = isFromSpark ? data.camp_desc_en : data.group_desc;
    this.group_name_he = isFromSpark ? data.camp_name_he : data.group_name_he;
    this.group_name_en = isFromSpark ? data.camp_name_en : data.group_name;
    this.status = this.status || data.group_status;
  }
}

module.exports = {
  GroupMembership,
  Group,
};
