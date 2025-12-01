"use client";

import { motion } from "framer-motion";
import { Shield, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { logger } from "@/utils/logger";

import { useResetMorningAttendance, useResetEveningAttendance } from "@/services/users/mutation";
import { PageHeader } from "@/components/atoms/pageHeader";
import { WarningNotice } from "@/components/atoms/warningNotice";
import { ResetAttendanceCard } from "@/components/molecules/resetAttendanceCard";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  const resetMorningMutation = useResetMorningAttendance();
  const resetEveningMutation = useResetEveningAttendance();

  const handleResetMorning = async () => {
    try {
      await resetMorningMutation.mutateAsync();
      toast.success("Morning attendance reset successfully!");
    } catch (error) {
      logger.error("Error resetting morning attendance:", error);
      toast.error("Failed to reset morning attendance. Please try again.");
    }
  };

  const handleResetEvening = async () => {
    try {
      await resetEveningMutation.mutateAsync();
      toast.success("Evening attendance reset successfully!");
    } catch (error) {
      logger.error("Error resetting evening attendance:", error);
      toast.error("Failed to reset evening attendance. Please try again.");
    }
  };

  const pageTransition = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="show" className="space-y-8">
      {/* Header */}
      <PageHeader title="Admin Panel" description="Manage system settings and attendance data" />

      {/* Reset Attendance Section */}
      <Card className="shadow-xl border-zinc-200/50 overflow-hidden bg-white/90 md:backdrop-blur-2xl">
        {/* backdrop-blur only on desktop */}
        <CardHeader className="border-b border-zinc-100/80 pb-6 bg-linear-to-br from-zinc-50/50 to-white">
          <CardTitle className="text-2xl font-bold bg-linear-to-br from-zinc-900 to-zinc-700 bg-clip-text text-transparent flex items-center gap-3">
            <Shield className="h-6 w-6 text-zinc-700" />
            Reset Attendance
          </CardTitle>
          <CardDescription className="text-zinc-600 font-medium mt-2">
            Reset attendance data for all users. This action will set all check-in statuses to
            pending.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResetAttendanceCard
              title="Morning Check-in"
              description="Reset all morning attendance to pending status"
              icon={Sun}
              buttonLabel="Reset Morning"
              confirmTitle="Reset Morning Attendance?"
              confirmDescription="This will reset all users' morning check-in status to pending. This action cannot be undone."
              onConfirm={handleResetMorning}
              isPending={resetMorningMutation.isPending}
              colorScheme="emerald"
              delay={0.1}
            />

            <ResetAttendanceCard
              title="Evening Check-in"
              description="Reset all evening attendance to pending status"
              icon={Moon}
              buttonLabel="Reset Evening"
              confirmTitle="Reset Evening Attendance?"
              confirmDescription="This will reset all users' evening check-in status to pending. This action cannot be undone."
              onConfirm={handleResetEvening}
              isPending={resetEveningMutation.isPending}
              colorScheme="violet"
              delay={0.2}
            />
          </div>
        </CardContent>
      </Card>

      <WarningNotice
        title="Important Notice"
        message="Reset operations affect all users in the system. Make sure to use these features responsibly, as they cannot be undone. Consider notifying users before performing a reset."
        delay={0.3}
      />
    </motion.div>
  );
}
