"use client";

import { useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { Users, CheckCircle, AlertTriangle, Activity } from "lucide-react";

import { useUsers } from "@/services/users/query";
import { RealtimeIndicator } from "@/components/atoms/realtimeIndicator";
import { PageHeader } from "@/components/atoms/pageHeader";
import { LoadingState } from "@/components/atoms/loadingState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IStats } from "@/interfaces/stats";
import { StatCard } from "@/components/molecules/statCard";

export default function Home() {
  const { data: users = [], isLoading: loading, error } = useUsers();

  const stats: IStats = useMemo(() => {
    if (users.length === 0) {
      return {
        totalUsers: 0,
        absenPagi: { sudah: 0, belum: 0, percentage: 0 },
        absenSore: { sudah: 0, belum: 0, percentage: 0 },
      };
    }

    const totalUsers = users.length;
    const absenPagiSudah = users.filter((u) => u.absen_pagi).length;
    const absenSoreSudah = users.filter((u) => u.absen_sore).length;

    return {
      totalUsers,
      absenPagi: {
        sudah: absenPagiSudah,
        belum: totalUsers - absenPagiSudah,
        percentage: totalUsers > 0 ? Math.round((absenPagiSudah / totalUsers) * 100) : 0,
      },
      absenSore: {
        sudah: absenSoreSudah,
        belum: totalUsers - absenSoreSudah,
        percentage: totalUsers > 0 ? Math.round((absenSoreSudah / totalUsers) * 100) : 0,
      },
    };
  }, [users]);

  const pageTransition: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
      },
    },
  };

  const formatPhoneNumber = (number: string) => {
    return number.replace("@s.whatsapp.net", "");
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="show"
      className="space-y-6 md:space-y-8"
    >
      {/* Header */}
      <PageHeader
        title="Dashboard Overview"
        description="Real-time monitoring of WhatsApp Bot attendance system"
        action={<RealtimeIndicator />}
      />

      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-6"
        >
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="flex items-center gap-4 p-4 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <div>
                <p className="font-medium">Gagal memuat data</p>
                <p className="text-sm">{error?.message || "Unknown error"}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6 md:space-y-8"
      >
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            gradient="blue"
            footer="↗ +2.5% from last week"
            loading={loading}
          />
          <StatCard
            title="Absen Pagi"
            value={`${stats.absenPagi.sudah}/${stats.totalUsers}`}
            icon={CheckCircle}
            gradient="emerald"
            progress={stats.absenPagi.percentage}
            footer={`${stats.absenPagi.percentage}% Completion rate`}
            loading={loading}
          />
          <StatCard
            title="Absen Sore"
            value={`${stats.absenSore.sudah}/${stats.totalUsers}`}
            icon={CheckCircle}
            gradient="violet"
            progress={stats.absenSore.percentage}
            footer={`${stats.absenSore.percentage}% Completion rate`}
            loading={loading}
          />
        </div>

        {/* Recent Activity */}
        <motion.div variants={item}>
          <Card className="shadow-xl border-zinc-200/50 overflow-hidden bg-white/90 backdrop-blur-2xl">
            <CardHeader className="border-b border-zinc-100/80 pb-6 bg-linear-to-br from-zinc-50/50 to-white">
              <CardTitle className="text-2xl font-bold bg-linear-to-br from-zinc-900 to-zinc-700 bg-clip-text text-transparent flex items-center gap-3">
                <Activity className="h-6 w-6 text-zinc-700" />
                Recent Activity
              </CardTitle>
              <p className="text-sm text-zinc-500 mt-2 font-medium">Latest check-ins from users</p>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <LoadingState message="Loading activity..." />
              ) : users.length > 0 ? (
                <div className="space-y-4">
                  {users
                    .filter((u) => u.last_checkin)
                    .sort(
                      (a, b) =>
                        new Date(b.last_checkin!).getTime() - new Date(a.last_checkin!).getTime()
                    )
                    .slice(0, 5)
                    .map((user, idx) => (
                      <motion.div
                        key={user.id || idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-zinc-50/50 hover:bg-zinc-100/50 transition-colors border border-zinc-100"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-zinc-900 font-mono text-sm">
                              {formatPhoneNumber(user.number)}
                            </p>
                            <p className="text-xs text-zinc-500">
                              {user.last_checkin &&
                                new Date(user.last_checkin).toLocaleString("id-ID")}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {user.absen_pagi && (
                            <Badge
                              variant="outline"
                              className="bg-emerald-50 text-emerald-700 border-emerald-300"
                            >
                              Morning
                            </Badge>
                          )}
                          {user.absen_sore && (
                            <Badge
                              variant="outline"
                              className="bg-violet-50 text-violet-700 border-violet-300"
                            >
                              Evening
                            </Badge>
                          )}
                        </div>
                      </motion.div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12 text-zinc-500">
                  <Activity className="mx-auto h-12 w-12 mb-4 text-zinc-300" />
                  <p className="text-sm font-medium">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
