"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient, type User } from "@/lib/supabase";

export function useRealtimeUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let channel: any = null;

    async function setup() {
      try {
        const supabase = getSupabaseClient();

        // Initial fetch
        await fetchUsers(supabase);

        // Subscribe to realtime changes
        channel = supabase
          .channel("users-changes")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "users",
            },
            () => {
              console.log("🔔 Realtime update received");
              fetchUsers(supabase);
            }
          )
          .subscribe();
      } catch (err) {
        console.warn("Supabase not available:", err);
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      }
    }

    setup();

    return () => {
      try {
        if (channel) {
          const supabase = getSupabaseClient();
          supabase.removeChannel(channel);
        }
      } catch (e) {
        // ignore cleanup errors
      }
    };
  }, []);

  const fetchUsers = async (supabaseParam?: ReturnType<typeof getSupabaseClient>) => {
    try {
      const supabase = supabaseParam ?? getSupabaseClient();
      const { data, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setUsers((data as User[]) || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  return { users, loading, error, refetch: fetchUsers };
}
