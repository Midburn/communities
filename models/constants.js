const GROUP_TYPES = {
  CAMP: 'camp',
  ART: 'art',
};

/**
 * Used to prevent allocation conflicts
 * MAKE SURE TO ADD MIGRATIONS WHEN CHANGING THIS VALUE
 */
const ALLOCATION_GROUPS = {
  PRODUCTION: 'production',
  THEME_CAMPS: 'theme_camps',
  ART_INSTALLATIONS: 'art_installation',
  VOLUNTEER_DEPARTMENT: 'volunteer_department',
};

/**
 * Ticket allocation types
 * MAKE SURE TO ADD MIGRATIONS WHEN CHANGING THIS VALUE
 */
const ALLOCATION_TYPES = {
  PRE_SALE: 'pre_sale',
  EARLY_ARRIVAL: 'early_arrival',
};

/**
 * Constants related to the allocations service server.
 */
const ALLOCATIONS_SERVICE = {
  ALLOCATION_TYPES: ['EARLY_ARRIVAL', 'APPRICIATION_TICKETS', 'TICKETS'],
  GROUP_TYPES: ['VOLUNTEER', 'CAMP', 'ART'],
  // Translate local constants to allocations service constants
  getAllocationType: localAllocationType => {
    if (!ALLOCATION_TYPES.hasOwnProperty (localAllocationType)) {
      return console.error (
        'When using getAllocationType you must use a ALLOCATION_TYPE key from constants'
      );
    }
    const dict = {
      [ALLOCATION_TYPES.PRE_SALE]: 'APPRICIATION_TICKETS',
      [ALLOCATION_TYPES.EARLY_ARRIVAL]: 'EARLY_ARRIVAL',
    };
    return dict[localAllocationType];
  },
  // Translate local constants to allocations service constants
  getAllocationGroup: localAllocationGroup => {
    if (!ALLOCATION_GROUPS.hasOwnProperty (localAllocationGroup)) {
      return console.error (
        'When using getAllocationGroup you must use a ALLOCATION_GROUPS key from constants'
      );
    }
    const dict = {
      [ALLOCATION_GROUPS.PRODUCTION]: null,
      [ALLOCATION_GROUPS.THEME_CAMPS]: 'CAMP',
      [ALLOCATION_GROUPS.ART_INSTALLATIONS]: 'ART',
      [ALLOCATION_GROUPS.VOLUNTEER_DEPARTMENT]: 'VOLUNTEER',
    };
    return dict[localAllocationType];
  },
};

function getFormerEventId (currentEventId) {
  let eventYear = parseInt (currentEventId.replace ('MIDBURN', ''));
  eventYear--;
  return `MIDBURN${eventYear}`;
}

module.exports = {
  getFormerEventId,
  /** 
     * Group-related enums
     */
  NOISE_LEVEL: {
    QUIET: 'quiet',
    MEDIUM: 'medium',
    NOISY: 'noisy',
    VERY_NOISY: 'very_noisy',
  },

  GROUP_STATUS: {
    ACTIVE: 'active',
    OPEN: 'open',
    CLOSED: 'closed',
    DELETED: 'deleted',
  },
  /**
     * Group types for DB + navs.
     */
  GROUP_TYPES: {
    CAMP: 'camp',
    ART: 'art',
  },

  ALLOCATION_GROUPS,
  GIVEN_BY_SYSTEM_CODE: -1,
  UNPUBLISHED_ALLOCATION_KEY: 'unpublished',
  // Used to prevent conflicts in permission table
  ENTITY_TYPE: {
    USER: 'User',
    GROUP: 'Group',
  },
  GROUP_TYPES_TO_ALLOCATIPN_GROUP: {
    [GROUP_TYPES.CAMP]: ALLOCATION_GROUPS.THEME_CAMPS,
    [GROUP_TYPES.ARTS]: ALLOCATION_GROUPS.ART_INSTALLATIONS,
  },

  SPARK_TYPES_TO_GROUP_TYPES: {
    art_installation: GROUP_TYPES.ART,
    theme_camp: GROUP_TYPES.CAMP,
  },

  SPARK_ACTION_TYPES: {
    ALLOCATE_PRESALE: 'pre_sale_ticket',
  },

  PERMISSION_TYPES: {
    ADMIN: 'admin_permission',
    ALLOCATE_PRESALE_TICKET: 'pre_sale_allocation_permission',
    GIVE_PERMISSION: 'give_permission',
  },
  /**
     * We don't want to delete things from the tables.
     * MAKE SURE TO ADD MIGRATIONS WHEN CHANGING THIS VALUE
     */
  DB_RECORD_STATUS_TYPES: {
    DELETED: 'deleted',
    ACTIVE: 'active',
  },
  ALLOCATION_TYPES,
  /**
     * Used to save record of audits done by users.
     */
  AUDIT_TYPES: {
    // Save the time admin allocated presale tickets
    PRESALE_ALLOCATIONS_ADMIN: 'presale_allocation_update',
    // Save the time someone allocated group tickets
    PRESALE_ALLOCATIONS_GROUP: 'presale_allocation_group_update',
  },
  /**
     * Response types for generic response
     */
  RESPONSE_TYPES: {
    JSON: 'JSON',
    STATIC: 'STATIC',
    ERROR: 'ERROR',
  },

  ALLOCATIONS_SERVICE,
};
