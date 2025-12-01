"use client";

import { usePathname } from "next/navigation";
import { SideBar } from "@/components/molecules/sideBar";
import { useAuth } from "@/components/providers/auth-provider";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { loading, user } = useAuth();
  const isLoginPage = pathname === "/login";

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-sm text-zinc-500 font-medium">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!isLoginPage && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Render login page without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10 h-full w-full">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
        <div className="absolute left-1/4 top-20 -z-10 h-[600px] w-[600px] rounded-full bg-linear-to-br from-amber-200/30 to-orange-200/20 blur-[130px]" />
        <div className="absolute right-1/4 bottom-20 -z-10 h-[600px] w-[600px] rounded-full bg-linear-to-tl from-blue-200/25 to-indigo-200/20 blur-[130px]" />
      </div>

      <SideBar />
      <main className="flex-1 overflow-x-hidden">
        <div className="container mx-auto px-4 lg:px-8 py-6 md:py-8 lg:py-12 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
