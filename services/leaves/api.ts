import { supabase } from "@/lib/supabase";
import { ILeaveWithUser, IUserLeave } from "@/interfaces/leaves";
import { LEAVE_TABLE_CONFIG } from "@/constants";

/**
 * Leave API functions
 */

/**
 * Get all pending leave requests with user information
 */
export async function getPendingLeaves(): Promise<ILeaveWithUser[]> {
  const { data, error } = await supabase
    .from(LEAVE_TABLE_CONFIG.NAME)
    .select(
      `
      *,
      users:fk_user_leaves_user (
        name
      )
    `
    )
    .eq("status", "pending")
    .order(LEAVE_TABLE_CONFIG.ORDER_BY, { ascending: false });

  if (error) throw error;

  // Transform the data to flatten user information
  const leaves = (data || []).map((leave: any) => ({
    ...leave,
    user_name: leave.users?.name || null,
    users: undefined, // Remove nested users object
  }));

  return leaves as ILeaveWithUser[];
}

/**
 * Approve a leave request
 */
export async function approveLeave(leaveId: number, approvedBy: string): Promise<IUserLeave> {
  const { data, error } = await supabase
    .from(LEAVE_TABLE_CONFIG.NAME)
    .update({
      status: "approved",
      approved_by: approvedBy,
      approved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", leaveId)
    .select()
    .single();

  if (error) throw error;
  return data as IUserLeave;
}

/**
 * Reject a leave request (set status to cancelled)
 */
export async function rejectLeave(leaveId: number): Promise<IUserLeave> {
  const { data, error } = await supabase
    .from(LEAVE_TABLE_CONFIG.NAME)
    .update({
      status: "cancelled",
      updated_at: new Date().toISOString(),
    })
    .eq("id", leaveId)
    .select()
    .single();

  if (error) throw error;
  return data as IUserLeave;
}
