"use client";

import { useEffect } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/components/providers/auth-provider";
import { supabase } from "@/lib/supabase";
import { IUser } from "@/interfaces/users";

export function UsersRealtimeSync() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      return;
    }

    let channel: RealtimeChannel | null = null;

    async function setupRealtime() {
      console.log("🔌 Setting up Realtime subscription with React Query...");

      // Subscribe to realtime changes
      channel = supabase
        .channel("users-realtime-query-sync")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "users",
          },
          (payload) => {
            console.log("🔔 Realtime event received:", payload.eventType);

            // Update React Query cache based on event type
            switch (payload.eventType) {
              case "INSERT":
                queryClient.setQueryData<IUser[]>(["users"], (old) => {
                  if (!old) return [payload.new as IUser];
                  return [payload.new as IUser, ...old];
                });
                break;

              case "UPDATE":
                // Update users list
                queryClient.setQueryData<IUser[]>(["users"], (old) => {
                  if (!old) return old;
                  return old.map((user) =>
                    user.id === (payload.new as IUser).id ? (payload.new as IUser) : user
                  );
                });
                // Update individual user cache if exists
                const updatedUserId = (payload.new as IUser).id;
                if (updatedUserId) {
                  queryClient.setQueryData(["users", updatedUserId], payload.new as IUser);
                }
                break;

              case "DELETE":
                const deletedUserId = (payload.old as IUser).id;
                // Remove from users list
                queryClient.setQueryData<IUser[]>(["users"], (old) => {
                  if (!old) return old;
                  return old.filter((user) => user.id !== deletedUserId);
                });
                // Remove individual user cache
                if (deletedUserId) {
                  queryClient.removeQueries({
                    queryKey: ["users", deletedUserId],
                  });
                }
                break;
            }

            // Mark queries as stale for background refetch
            queryClient.invalidateQueries({
              queryKey: ["users"],
              refetchType: "none", // Don't refetch immediately, just mark as stale
            });
          }
        )
        .subscribe((status) => {
          console.log("📡 Realtime subscription status:", status);
        });
    }

    setupRealtime();

    return () => {
      if (channel) {
        console.log("🔌 Unsubscribing from realtime channel");
        supabase.removeChannel(channel);
      }
    };
  }, [queryClient, user]);

  return null;
}
