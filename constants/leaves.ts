/**
 * Leave-related constants
 */

export const LEAVE_QUERY_KEYS = {
  ROOT: ["leaves"] as const,
  PENDING: ["leaves", "pending"] as const,
  DETAIL: (id: number) => ["leaves", id] as const,
};

export const LEAVE_TABLE_CONFIG = {
  NAME: "user_leaves",
  ORDER_BY: "created_at",
} as const;

export const LEAVE_STATUS_LABELS = {
  izin: "Izin",
  sakit: "Sakit",
  cuti: "Cuti",
} as const;

export const LEAVE_STATUS_COLORS = {
  izin: "blue",
  sakit: "red",
  cuti: "green",
} as const;
