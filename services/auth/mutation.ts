"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { signIn, signOut } from "./api";
import { AUTH_QUERY_KEYS, AUTH_ROUTES, USER_QUERY_KEYS } from "@/constants";

/**
 * Authentication mutations using React Query
 */

// Helper: Clear all storage
const clearAllStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.clear();
    sessionStorage.clear();
  }
};

// Helper: Force local signout
const forceLocalSignOut = async () => {
  try {
    await supabase.auth.signOut({ scope: "local" });
  } catch (error) {
    console.error("Failed to force local signout:", error);
  }
};

/**
 * Sign in mutation hook
 */
export function useSignIn() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signIn(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.ROOT });
      toast.success("Login successful! Welcome back.");
      router.push(AUTH_ROUTES.HOME);
    },
  });
}

/**
 * Sign out mutation hook
 */
export function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      try {
        await signOut();
      } catch (error) {
        console.error("Server logout failed:", error);
        await forceLocalSignOut();
      }
    },
    onSuccess: () => {
      // Clear all cached queries
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.ROOT });
      queryClient.removeQueries({ queryKey: USER_QUERY_KEYS.ROOT });

      // Clear all browser storage
      clearAllStorage();

      // Show success toast
      toast.success("Logged out successfully.");

      // Navigate to login page
      router.push(AUTH_ROUTES.LOGIN);
    },
  });
}
