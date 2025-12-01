/**
 * User Constants
 */

// Query Keys
export const USER_QUERY_KEYS = {
  ROOT: ["users"] as const,
  DETAIL: (id: string) => ["users", id] as const,
  RECENT_ACTIVITY: ["users", "recent-activity"] as const,
} as const;

// Cache Configuration
export const USER_CACHE_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
} as const;

// Table Configuration
export const USER_TABLE_CONFIG = {
  NAME: "users",
  ORDER_BY: "created_at",
  ORDER_DIRECTION: "descending",
} as const;
