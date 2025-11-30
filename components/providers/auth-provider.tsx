"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User, Session, AuthChangeEvent } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setInitialCheckDone(true);
        setLoading(false);

        // Redirect logic after checking session
        if (!session && pathname !== "/login") {
          router.replace("/login");
        } else if (session && pathname === "/login") {
          router.replace("/");
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setInitialCheckDone(true);
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);

      // Only redirect after initial check is done
      if (initialCheckDone) {
        if (!session && pathname !== "/login") {
          router.replace("/login");
        } else if (session && pathname === "/login") {
          router.replace("/");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [router, pathname, initialCheckDone]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
