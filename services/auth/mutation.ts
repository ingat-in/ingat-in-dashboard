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
  });
}
