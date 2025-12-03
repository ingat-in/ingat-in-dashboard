"use client";

export const runtime = 'edge';

import { motion } from "framer-motion";
import { Users, CheckCircle, XCircle, Search, Edit, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logger } from "@/utils/logger";
import { formatDate, formatTime } from "@/utils/date";

import { useUsers } from "@/services/users/query";
import { useDeleteUser } from "@/services/users/mutation";
import { PageHeader } from "@/components/atoms/pageHeader";
import { LoadingState } from "@/components/atoms/loadingState";
import { ConfirmDialog } from "@/components/molecules/confirmDialog";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IUser } from "@/interfaces/users";
import { StatCard } from "@/components/molecules/statCard";

export default function UsersPage() {
  const { data: users = [], isLoading: loading } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");

  const deleteUserMutation = useDeleteUser();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);

  const router = useRouter();

  const formatPhoneNumber = (number: string) =>
    number.replace(/^62/, "0").replace("@s.whatsapp.net", "");

  const filteredUsers = users.filter((user) =>
    formatPhoneNumber(user.number).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = (user: IUser) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete?.id) return;

    try {
      await deleteUserMutation.mutateAsync(userToDelete.id);
      toast.success("User deleted successfully!");
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      logger.error("Error deleting user:", error);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  const handleEditClick = (user: IUser) => {
    router.push(`/dashboard/users/${user.id}/edit`);
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
      <PageHeader
        title="Users Management"
        description="View and manage all registered users in the system"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Users" value={users.length} icon={Users} gradient="blue" />
        <StatCard
          title="Morning Check-ins"
          value={users.filter((u) => u.absen_pagi).length}
          icon={CheckCircle}
          gradient="emerald"
        />
        <StatCard
          title="Evening Check-ins"
          value={users.filter((u) => u.absen_sore).length}
          icon={CheckCircle}
          gradient="violet"
        />
      </div>

      {/* Users Table */}
      <Card className="shadow-xl border-zinc-200/50 overflow-hidden bg-white/90 backdrop-blur-2xl">
        <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-100/80 pb-6 bg-linear-to-br from-zinc-50/50 to-white">
          <div>
            <CardTitle className="text-2xl font-bold bg-linear-to-br from-zinc-900 to-zinc-700 bg-clip-text text-transparent flex items-center gap-3">
              <Users className="h-6 w-6 text-zinc-700" />
              User List
            </CardTitle>
            <p className="text-sm text-zinc-500 mt-2 font-medium">
              {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative cursor-target">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                type="text"
                placeholder="Search by number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 border-zinc-300 focus:border-blue-500"
              />
            </div>
            <Button
              onClick={() => router.push("/dashboard/users/create")}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <LoadingState message="Loading user data..." size="lg" />
          ) : filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b-2 border-zinc-200/80 bg-linear-to-r from-zinc-50/80 via-zinc-50/50 to-zinc-50/80">
                    <TableHead className="w-[70px] font-bold text-zinc-700 text-xs uppercase tracking-wider py-4 pl-6">
                      No
                    </TableHead>
                    <TableHead className="font-bold text-zinc-700 text-xs uppercase tracking-wider py-4 min-w-[180px]">
                      WhatsApp Number
                    </TableHead>
                    <TableHead className="font-bold text-zinc-700 text-xs uppercase tracking-wider py-4 min-w-[150px]">
                      Name
                    </TableHead>
                    <TableHead className="font-bold text-zinc-700 text-xs uppercase tracking-wider py-4 text-center min-w-[150px]">
                      Morning Check-in
                    </TableHead>
                    <TableHead className="font-bold text-zinc-700 text-xs uppercase tracking-wider py-4 text-center min-w-[150px]">
                      Evening Check-in
                    </TableHead>
                    <TableHead className="font-bold text-zinc-700 text-xs uppercase tracking-wider py-4 min-w-[180px]">
                      Last Activity
                    </TableHead>
                    <TableHead className="font-bold text-zinc-700 text-xs uppercase tracking-wider py-4 min-w-[150px]">
                      Suspend Until
                    </TableHead>
                    <TableHead className="font-bold text-zinc-700 text-xs uppercase tracking-wider py-4 text-center min-w-[120px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user, idx) => (
                    <tr
                      key={user.id || idx}
                      className="border-b border-zinc-100 cursor-pointer transition-colors duration-200 group hover:bg-zinc-50/50"
                    >
                      <TableCell className="font-bold text-zinc-800 py-5 pl-6">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 group-hover:bg-blue-100 text-zinc-700 group-hover:text-blue-700 transition-colors text-sm font-semibold">
                          {idx + 1}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-zinc-900 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="font-mono text-sm">
                            {formatPhoneNumber(user.number)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-zinc-700 py-5">
                        <span className="font-medium">
                          {user.name || <span className="text-zinc-400 italic">No name</span>}
                        </span>
                      </TableCell>
                      <TableCell className="py-5">
                        <div className="flex justify-center">
                          <Badge
                            variant="outline"
                            className={`font-semibold text-xs px-4 py-1.5 rounded-full shadow-sm transition-all duration-200 ${
                              user.absen_pagi
                                ? "bg-linear-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-300 hover:shadow-md hover:shadow-emerald-200"
                                : "bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-100"
                            }`}
                          >
                            {user.absen_pagi ? (
                              <span className="flex items-center gap-1.5">
                                <CheckCircle className="h-3.5 w-3.5" />
                                Completed
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5">
                                <XCircle className="h-3.5 w-3.5" />
                                Pending
                              </span>
                            )}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="py-5">
                        <div className="flex justify-center">
                          <Badge
                            variant="outline"
                            className={`font-semibold text-xs px-4 py-1.5 rounded-full shadow-sm transition-all duration-200 ${
                              user.absen_sore
                                ? "bg-linear-to-r from-violet-50 to-violet-100 text-violet-700 border-violet-300 hover:shadow-md hover:shadow-violet-200"
                                : "bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-100"
                            }`}
                          >
                            {user.absen_sore ? (
                              <span className="flex items-center gap-1.5">
                                <CheckCircle className="h-3.5 w-3.5" />
                                Completed
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5">
                                <XCircle className="h-3.5 w-3.5" />
                                Pending
                              </span>
                            )}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-zinc-600 text-sm font-medium py-5">
                        {user.last_checkin ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-zinc-800 font-semibold">
                              {formatDate(user.last_checkin)}
                            </span>
                            <span className="text-zinc-500 text-xs">
                              {formatTime(user.last_checkin)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-zinc-400 italic">No activity</span>
                        )}
                      </TableCell>
                      <TableCell className="text-zinc-600 text-sm font-medium py-5">
                        {user.suspend_until ? (
                          <div className="flex flex-col gap-0.5">
                            <Badge
                              variant="outline"
                              className="bg-amber-50 text-amber-700 border-amber-300 font-semibold text-xs px-3 py-1 rounded-full w-fit"
                            >
                              Suspended
                            </Badge>
                            <span className="text-zinc-800 font-semibold text-xs mt-1">
                              {formatDate(user.suspend_until)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-zinc-400 italic">Active</span>
                        )}
                      </TableCell>
                      <TableCell className="py-5">
                        <div className="flex justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditClick(user)}
                            className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <ConfirmDialog
                            trigger={
                              <Button
                                size="sm"
                                variant="outline"
                                className="hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            }
                            open={deleteDialogOpen && userToDelete?.id === user.id}
                            onOpenChange={(open) => {
                              setDeleteDialogOpen(open);
                              if (!open) setUserToDelete(null);
                            }}
                            title="Delete User Confirmation"
                            description={
                              <>
                                Are you sure you want to delete user{" "}
                                <span className="font-mono font-semibold text-zinc-900">
                                  {formatPhoneNumber(user.number)}
                                </span>
                                ? This action cannot be undone.
                              </>
                            }
                            confirmLabel="Delete"
                            onConfirm={() => {
                              handleDeleteClick(user);
                              handleDeleteConfirm();
                            }}
                            isLoading={deleteUserMutation.isPending}
                            loadingLabel="Deleting..."
                            variant="danger"
                          />
                        </div>
                      </TableCell>
                    </tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-20 text-zinc-500 bg-linear-to-br from-zinc-50/80 to-zinc-100/40">
              <Users className="mx-auto h-16 w-16 mb-6 text-zinc-300" />
              <h3 className="text-xl font-bold text-zinc-800 mb-2">
                {searchQuery ? "No users match your search" : "No users found"}
              </h3>
              <p className="text-zinc-500 font-medium">
                {searchQuery
                  ? "Try a different search term"
                  : "Users will appear here once they interact with the bot"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
