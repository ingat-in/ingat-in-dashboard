"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Users, Menu, X, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function SideBar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  const menuItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Users",
      href: "/users",
      icon: Users,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white/90 backdrop-blur-sm rounded-xl border border-zinc-200 shadow-lg"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-zinc-700" />
        ) : (
          <Menu className="h-6 w-6 text-zinc-700" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-72 bg-white/95 backdrop-blur-xl border-r border-zinc-200/80 shadow-2xl z-40 transition-transform duration-300
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:shadow-none
        `}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2.5 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/30 group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all">
                <LayoutDashboard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-linear-to-br from-zinc-900 to-zinc-700 bg-clip-text text-transparent">
                  Ingat-In
                </h1>
                <p className="text-xs text-zinc-500 font-medium">Dashboard</p>
              </div>
            </Link>
          </motion.div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 group relative
                      ${
                        active
                          ? "bg-linear-to-r from-blue-50 to-blue-100/50 text-blue-700 shadow-md shadow-blue-100"
                          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                      }
                    `}
                  >
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-linear-to-r from-blue-50 to-blue-100/50 rounded-xl"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon
                      className={`h-5 w-5 relative z-10 ${
                        active ? "text-blue-600" : "text-zinc-500 group-hover:text-zinc-700"
                      }`}
                    />
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-6 border-t border-zinc-200/80 space-y-4"
          >
            {/* User Info */}
            {user && (
              <div className="px-4 py-3 bg-linear-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/60">
                <p className="text-xs font-semibold text-blue-700 mb-0.5">Logged in as</p>
                <p className="text-[11px] text-blue-600 font-mono truncate">{user.email}</p>
              </div>
            )}

            {/* Logout Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 font-semibold"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white/95 backdrop-blur-xl border-zinc-200 shadow-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-bold text-zinc-900">
                    Logout Confirmation
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-600">
                    Are you sure you want to logout? You will need to login again to access the
                    dashboard.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="font-semibold hover:bg-zinc-50 border-zinc-200">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleSignOut}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40"
                  >
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </motion.div>
        </div>
      </aside>
    </>
  );
}
