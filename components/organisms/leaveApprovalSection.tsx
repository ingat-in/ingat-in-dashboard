"use client";

import { motion } from "framer-motion";
import { ClipboardList, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LeaveRequestCard } from "@/components/molecules/leaveRequestCard";
import { usePendingLeaves } from "@/services/leaves/query";
import { useApproveLeave, useRejectLeave } from "@/services/leaves/mutation";
import { toast } from "sonner";
import { logger } from "@/utils/logger";

interface LeaveApprovalSectionProps {
  delay?: number;
}

export function LeaveApprovalSection({ delay = 0 }: LeaveApprovalSectionProps) {
  const { data: pendingLeaves, isLoading, isError, error, refetch } = usePendingLeaves();
  const approveMutation = useApproveLeave();
  const rejectMutation = useRejectLeave();

  const handleApprove = async (leaveId: number) => {
    try {
      await approveMutation.mutateAsync({
        leaveId,
        approvedBy: "admin", // TODO: Replace with actual admin identifier
      });
      toast.success("Leave request approved successfully!");
    } catch (error) {
      logger.error("Error approving leave:", error);
      toast.error("Failed to approve leave request. Please try again.");
    }
  };

  const handleReject = async (leaveId: number) => {
    try {
      await rejectMutation.mutateAsync(leaveId);
      toast.success("Leave request rejected successfully!");
    } catch (error) {
      logger.error("Error rejecting leave:", error);
      toast.error("Failed to reject leave request. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="shadow-xl border-zinc-200/50 overflow-hidden bg-white/90 md:backdrop-blur-2xl">
        <CardHeader className="border-b border-zinc-100/80 pb-6 bg-linear-to-br from-zinc-50/50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold bg-linear-to-br from-zinc-900 to-zinc-700 bg-clip-text text-transparent flex items-center gap-3">
                <ClipboardList className="h-6 w-6 text-zinc-700" />
                Leave Approval
              </CardTitle>
              <CardDescription className="text-zinc-600 font-medium mt-2">
                Review and approve pending leave requests from users
              </CardDescription>
            </div>
            {!isLoading && pendingLeaves && pendingLeaves.length > 0 && (
              <Badge className="bg-orange-100 text-orange-800 border-orange-200 border text-lg px-3 py-1">
                {pendingLeaves.length}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-zinc-400 mb-3" />
              <p className="text-zinc-500 font-medium">Loading pending requests...</p>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-8 w-8 text-red-500 mb-3" />
              <p className="text-zinc-700 font-medium mb-2">Failed to load leave requests</p>
              <p className="text-sm text-zinc-500 mb-4">
                {error instanceof Error ? error.message : "An unexpected error occurred"}
              </p>
              <Button
                onClick={() => refetch()}
                variant="outline"
                className="bg-white hover:bg-zinc-50"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && pendingLeaves && pendingLeaves.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="p-4 bg-zinc-100 rounded-full mb-4">
                <ClipboardList className="h-8 w-8 text-zinc-400" />
              </div>
              <p className="text-zinc-700 font-medium mb-1">No pending requests</p>
              <p className="text-sm text-zinc-500">All leave requests have been processed</p>
            </div>
          )}

          {/* Leave Requests Grid */}
          {!isLoading && !isError && pendingLeaves && pendingLeaves.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingLeaves.map((leave, index) => (
                <LeaveRequestCard
                  key={leave.id}
                  leave={leave}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  isApproving={approveMutation.isPending}
                  isRejecting={rejectMutation.isPending}
                  delay={index * 0.05}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
