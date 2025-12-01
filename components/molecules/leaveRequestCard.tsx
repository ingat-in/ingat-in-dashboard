"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, User, Phone, FileText, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/molecules/confirmDialog";
import { ILeaveWithUser } from "@/interfaces/leaves";
import { LEAVE_STATUS_LABELS } from "@/constants";

interface LeaveRequestCardProps {
  leave: ILeaveWithUser;
  onApprove: (leaveId: number) => void;
  onReject: (leaveId: number) => void;
  isApproving: boolean;
  isRejecting: boolean;
  delay?: number;
}

export function LeaveRequestCard({
  leave,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
  delay = 0,
}: LeaveRequestCardProps) {
  const typeColors = {
    izin: {
      badge: "bg-blue-100 text-blue-800 border-blue-200",
      border: "border-blue-200/60",
      bg: "bg-gradient-to-br from-blue-50/50 to-blue-100/30",
    },
    sakit: {
      badge: "bg-red-100 text-red-800 border-red-200",
      border: "border-red-200/60",
      bg: "bg-gradient-to-br from-red-50/50 to-red-100/30",
    },
    cuti: {
      badge: "bg-green-100 text-green-800 border-green-200",
      border: "border-green-200/60",
      bg: "bg-gradient-to-br from-green-50/50 to-green-100/30",
    },
  };

  const color = typeColors[leave.type];
  const userName = leave.user_name || "User tanpa nama";
  const phoneNumber = leave.user_number.replace("@s.whatsapp.net", "");

  // Format dates
  const startDate = new Date(leave.start_date);
  const endDate = new Date(leave.end_date);
  const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const isLoading = isApproving || isRejecting;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`p-6 border-2 ${color.border} rounded-xl ${color.bg} hover:shadow-lg transition-all`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-zinc-600" />
            <h3 className="text-lg font-bold text-zinc-900">{userName}</h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <Phone className="h-3.5 w-3.5" />
            <span>{phoneNumber}</span>
          </div>
        </div>
        <Badge className={`${color.badge} border font-semibold`}>
          {LEAVE_STATUS_LABELS[leave.type]}
        </Badge>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-2 text-sm">
          <Calendar className="h-4 w-4 text-zinc-500 mt-0.5 shrink-0" />
          <div>
            <span className="text-zinc-700 font-medium">Periode: </span>
            <span className="text-zinc-600">
              {dateFormatter.format(startDate)} - {dateFormatter.format(endDate)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-zinc-500 shrink-0" />
          <div>
            <span className="text-zinc-700 font-medium">Durasi: </span>
            <span className="text-zinc-600">{leave.days} hari</span>
          </div>
        </div>

        <div className="flex items-start gap-2 text-sm">
          <FileText className="h-4 w-4 text-zinc-500 mt-0.5 shrink-0" />
          <div>
            <span className="text-zinc-700 font-medium">Alasan: </span>
            <p className="text-zinc-600 mt-1">{leave.reason}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-200">
        <ConfirmDialog
          trigger={
            <Button
              variant="outline"
              disabled={isLoading}
              className="w-full bg-white hover:bg-red-50 text-red-700 border-red-300 hover:border-red-400 font-semibold"
            >
              {isRejecting ? (
                <>
                  <XCircle className="mr-2 h-4 w-4 animate-pulse" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </>
              )}
            </Button>
          }
          title="Reject Leave Request?"
          description={`Are you sure you want to reject ${userName}'s ${LEAVE_STATUS_LABELS[
            leave.type
          ].toLowerCase()} request? This action cannot be undone.`}
          confirmLabel="Reject"
          onConfirm={() => onReject(leave.id!)}
          isLoading={isRejecting}
          loadingLabel="Rejecting..."
          variant="warning"
        />

        <ConfirmDialog
          trigger={
            <Button
              variant="outline"
              disabled={isLoading}
              className="w-full bg-white hover:bg-green-50 text-green-700 border-green-300 hover:border-green-400 font-semibold"
            >
              {isApproving ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4 animate-pulse" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </>
              )}
            </Button>
          }
          title="Approve Leave Request?"
          description={`Are you sure you want to approve ${userName}'s ${LEAVE_STATUS_LABELS[
            leave.type
          ].toLowerCase()} request for ${leave.days} days?`}
          confirmLabel="Approve"
          onConfirm={() => onApprove(leave.id!)}
          isLoading={isApproving}
          loadingLabel="Approving..."
          variant="info"
        />
      </div>
    </motion.div>
  );
}
