const constants = require('../../models/constants');

module.exports = (sequelize, DataTypes) => {
    const Group = sequelize.define(
        'Group',
        {
            spark_id: {
                type: DataTypes.INTEGER,
            },
            group_name_en: {
                type: DataTypes.STRING,
            },
            group_name_he: {type: DataTypes.STRING},
            group_desc_en: {
                type: DataTypes.TEXT,
            },
            group_desc_he: {
                type: DataTypes.TEXT,
            },
            group_character: DataTypes.TEXT,
            accept_families: DataTypes.BOOLEAN,
            child_friendly: DataTypes.BOOLEAN,
            web_published: DataTypes.BOOLEAN,
            facebook_url: DataTypes.STRING,
            group_type: {
                type: DataTypes.ENUM,
                values: [constants.GROUP_TYPES.CAMP, constants.GROUP_TYPES.ART],
            },
            main_contact: {
                type: DataTypes.INTEGER,
            },
            sound_contact: {
                type: DataTypes.INTEGER,
            },
            moop_contact: {
                type: DataTypes.INTEGER,
            },
            safety_contact: {
                type: DataTypes.INTEGER,
            },
            contact_person_id: {
                type: DataTypes.INTEGER,
            },
            event_id: {
                type: DataTypes.STRING,
            },
            dream_id: {
                type: DataTypes.STRING,
            },
            camp_type: {
                type: DataTypes.STRING,
            },
            record_status: {
                type: DataTypes.ENUM,
                values: [
                    constants.DB_RECORD_STATUS_TYPES.ACTIVE,
                    constants.DB_RECORD_STATUS_TYPES.DELETED,
                ],
                defaultValue: constants.DB_RECORD_STATUS_TYPES.ACTIVE,
            },
            group_membership_status: {
                type: DataTypes.ENUM,
                values: [
                    constants.GROUP_MEMBERSHIP_STATUS.OPEN,
                    constants.GROUP_MEMBERSHIP_STATUS.CLOSED,
                    constants.GROUP_MEMBERSHIP_STATUS.UNKNOWN,
                ],
                defaultValue: constants.GROUP_MEMBERSHIP_STATUS.CLOSED
            },
            group_status: {
                type: DataTypes.ENUM,
                values: [
                    constants.GROUP_STATUS.OPEN,
                    constants.GROUP_STATUS.CLOSED,
                    constants.GROUP_STATUS.DELETED,
                    constants.GROUP_STATUS.INACTIVE,
                ],
                defaultValue: constants.GROUP_STATUS.ACTIVE,
            },
            noise_level: {
                type: DataTypes.ENUM,
                values: [
                    constants.NOISE_LEVEL.QUIET,
                    constants.NOISE_LEVEL.MEDIUM,
                    constants.NOISE_LEVEL.NOISY,
                    constants.NOISE_LEVEL.VERY_NOISY,
                ],
                defaultValue: constants.NOISE_LEVEL.MEDIUM,
            },
        },
        {}
    );
    Group.associate = function (models) {
        // associations can be defined here

        // This will add to 'Group' the getMembers and setMembers accessors, and add groupId attribute to 'GroupMember' model.
        models.Group.hasMany(models.GroupMember, {as: 'members'});
    };
    return Group;
};
