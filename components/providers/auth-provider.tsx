"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { logger } from "@/utils/logger";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initializeAuth = async () => {
      if (typeof window !== "undefined") {
        try {
          const storedSessionStr = localStorage.getItem("ingatin-auth-token");
          if (storedSessionStr) {
            const storedSession = JSON.parse(storedSessionStr);
            if (storedSession?.user) {
              setUser(storedSession.user);
              setLoading(false); // Unblock UI immediately
            }
          }
        } catch (e) {
          logger.error("Error parsing stored session:", e);
        }
      }

      // 2. Authoritative check with Supabase
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        setUser(session?.user ?? null);
        setInitialCheckDone(true);
        setLoading(false);

        // Redirect logic
        const isProtectedRoute = pathname.startsWith("/dashboard");

        if (!session && isProtectedRoute) {
          router.replace("/login");
        } else if (session && pathname === "/login") {
          router.replace("/dashboard");
        }
      } catch (error) {
        logger.error("Error checking session:", error);
        setInitialCheckDone(true);
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
      setLoading(false);

      if (initialCheckDone || _event === "SIGNED_IN" || _event === "SIGNED_OUT") {
        const isProtectedRoute = pathname.startsWith("/dashboard");

        if (!session && isProtectedRoute) {
          router.replace("/login");
        } else if (session && pathname === "/login") {
          router.replace("/dashboard");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [router, pathname, initialCheckDone]);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
