"use client";

import { QueryProvider } from "./query-provider";
import { AuthProvider } from "./auth-provider";
import { UsersRealtimeSync } from "@/components/features/users-realtime-sync";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <UsersRealtimeSync />
        {children}
      </AuthProvider>
    </QueryProvider>
  );
}
