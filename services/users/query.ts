"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/providers/auth-provider";
import { getUsers, getUserById, getRecentActivity } from "./api";
import { USER_QUERY_KEYS, USER_CACHE_CONFIG } from "@/constants";

/**
 * User query hooks
 */

export function useUsers() {
  const { user } = useAuth();

  return useQuery({
    queryKey: USER_QUERY_KEYS.ROOT,
    queryFn: getUsers,
    staleTime: USER_CACHE_CONFIG.STALE_TIME,
    enabled: !!user,
  });
}

export function useUser(id: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: USER_QUERY_KEYS.DETAIL(id),
    queryFn: () => getUserById(id),
    staleTime: USER_CACHE_CONFIG.STALE_TIME,
    enabled: !!id && !!user,
  });
}

export function useRecentActivity() {
  const { user } = useAuth();

  return useQuery({
    queryKey: USER_QUERY_KEYS.RECENT_ACTIVITY,
    queryFn: getRecentActivity,
    staleTime: USER_CACHE_CONFIG.STALE_TIME,
    enabled: !!user,
  });
}
