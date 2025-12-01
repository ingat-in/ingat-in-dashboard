"use client";

import { useQuery } from "@tanstack/react-query";
import { getPendingLeaves } from "./api";
import { LEAVE_QUERY_KEYS } from "@/constants";

/**
 * Leave query hooks
 */

export function usePendingLeaves() {
  return useQuery({
    queryKey: LEAVE_QUERY_KEYS.PENDING,
    queryFn: getPendingLeaves,
    refetchInterval: 30000, // Auto-refetch every 30 seconds
    staleTime: 20000, // Consider data stale after 20 seconds
  });
}
