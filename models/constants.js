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

module.exports = {
  /**
     * Group types for DB + navs.
     */

  /** 
     * Group-related enums
     */
  NOISE_LEVEL: {
    QUIET: 'quiet',
    MEDIUM: 'medium',
    NOISY: 'noisy',
    VERY_NOISY: 'very noisy',
  },

  GROUP_STATUS: {
    OPEN: 'open',
    CLOSED: 'closed',
    INACTIVE: 'inactive',
    DELETED: 'deleted',
  },

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
  CAMP_TYPES: {
    CONTENT: 'CONTENT',
    HOSPITALITY: 'HOSPITALITY',
    SPONTANEOUS: 'SPONTANEOUS',
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
  /**
     * Ticket allocation types
     * MAKE SURE TO ADD MIGRATIONS WHEN CHANGING THIS VALUE
     */
  ALLOCATION_TYPES: {
    PRE_SALE: 'pre_sale',
    EARLY_ARRIVAL: 'early_arrival',
  },
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
   * Roles important for production purposes  
   */
  GROUP_STATIC_ROLES: {
    LEADER: 'LEADER',
    MOOP: 'MOOP',
    SAFETY: 'SAFETY',
    SOUND: 'SOUND',
    CONTENT: 'CONTENT',
    CONTACT: 'CONTACT',
    PRE_SALE_ALLOCATOR: 'PRE_SALE_ALLOCATOR',
    EARLY_ARRIVAL_ALLOCATOR: 'EARLY_ARRIVAL_ALLOCATOR',
  },

  ACTION_NAMES: {
    DELETE: 'DELETE',
    ADD: 'ADD',
  },

  /**
     * Response types for generic response
     */
  RESPONSE_TYPES: {
    JSON: 'JSON',
    STATIC: 'STATIC',
    ERROR: 'ERROR',
  },

  GROUP_MEMBERSHIP_STATUS: {
    OPEN: 'OPEN',
    CLOSED: 'CLOSED',
    UNKNOWN: 'UNKNOWN',
  },
};
