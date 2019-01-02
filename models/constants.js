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
     * Response types for generic response
     */
    RESPONSE_TYPES: {
        JSON: 'JSON',
        STATIC: 'STATIC',
        ERROR: 'ERROR'
    }
};
