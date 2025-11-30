"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/providers/auth-provider";
import { getUsers, getUserById } from "./api";

// Get all users
export function useUsers() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!user,
  });
}

// Get single user
export function useUser(id: string) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => getUserById(id),
    enabled: !!id && !!user,
  });
}
