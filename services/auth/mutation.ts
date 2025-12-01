"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn, signOut } from "./api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Sign in mutation
export function useSignIn() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signIn(email, password),
    onSuccess: () => {
      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success("Login successful! Welcome back.");
      router.push("/");
    },
  });
}

// Sign out mutation
export function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      // Clear all auth queries
      queryClient.removeQueries({ queryKey: ["auth"] });
      // Clear users queries
      queryClient.removeQueries({ queryKey: ["users"] });
      toast.success("Logged out successfully.");
      router.push("/login");
    },
    onError: (error) => {
      // Force logout on error (e.g. session not found)
      queryClient.removeQueries({ queryKey: ["auth"] });
      queryClient.removeQueries({ queryKey: ["users"] });

      // Check if it's a session error
      if (error.message.includes("session") || error.message.includes("JWT")) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Error logging out, but you have been signed out locally.");
      }

      router.push("/login");
    },
  });
}
