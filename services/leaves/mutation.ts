"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveLeave, rejectLeave } from "./api";
import { LEAVE_QUERY_KEYS } from "@/constants";
import { ILeaveWithUser } from "@/interfaces/leaves";

/**
 * Leave mutation hooks
 */

// Helper: Invalidate all leave queries
const invalidateLeaveQueries = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: LEAVE_QUERY_KEYS.ROOT });
};

export function useApproveLeave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leaveId, approvedBy }: { leaveId: number; approvedBy: string }) =>
      approveLeave(leaveId, approvedBy),
    onMutate: async ({ leaveId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: LEAVE_QUERY_KEYS.PENDING });

      // Snapshot previous values
      const previousLeaves = queryClient.getQueryData<ILeaveWithUser[]>(LEAVE_QUERY_KEYS.PENDING);

      // Optimistic update - remove from pending list
      queryClient.setQueryData<ILeaveWithUser[]>(LEAVE_QUERY_KEYS.PENDING, (old) =>
        old ? old.filter((leave) => leave.id !== leaveId) : old
      );

      return { previousLeaves };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousLeaves) {
        queryClient.setQueryData(LEAVE_QUERY_KEYS.PENDING, context.previousLeaves);
      }
    },
    onSettled: () => invalidateLeaveQueries(queryClient),
  });
}

export function useRejectLeave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (leaveId: number) => rejectLeave(leaveId),
    onMutate: async (leaveId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: LEAVE_QUERY_KEYS.PENDING });

      // Snapshot previous values
      const previousLeaves = queryClient.getQueryData<ILeaveWithUser[]>(LEAVE_QUERY_KEYS.PENDING);

      // Optimistic update - remove from pending list
      queryClient.setQueryData<ILeaveWithUser[]>(LEAVE_QUERY_KEYS.PENDING, (old) =>
        old ? old.filter((leave) => leave.id !== leaveId) : old
      );

      return { previousLeaves };
    },
    onError: (err, leaveId, context) => {
      // Rollback on error
      if (context?.previousLeaves) {
        queryClient.setQueryData(LEAVE_QUERY_KEYS.PENDING, context.previousLeaves);
      }
    },
    onSettled: () => invalidateLeaveQueries(queryClient),
  });
}
