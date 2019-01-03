const GROUP_TYPES = {
        CAMP: 'camp',
        ART: 'art'
    };

module.exports = {
    /**
     * Group types for DB + navs.
     */
    GROUP_TYPES,

    SPARK_TYPES_TO_GROUP_TYPES: {
        art_installation: GROUP_TYPES.ART,
        theme_camp: GROUP_TYPES.CAMP
    },
    /**
     * We don't want to delete things from the tables.
     */
    DB_RECORD_STATUS_TYPES: {
        DELETED: 'deleted',
        ACTIVE: 'active'
    },
    /**
     * Used to save record of audits done by users.
     */
    AUDIT_TYPES: {
        // Save the time admin allocated presale tickets
        PRESALE_ALLOCATIONS_ADMIN: 'presale_allocation_update'
    },
    /**
     * Response types for generic response
     */
    RESPONSE_TYPES: {
        JSON: 'JSON',
        STATIC: 'STATIC',
        ERROR: 'ERROR'
    }
};
