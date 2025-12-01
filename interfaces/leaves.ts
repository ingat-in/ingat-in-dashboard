export interface IUserLeave {
  id?: number;
  user_number: string;
  type: "izin" | "sakit" | "cuti";
  reason: string;
  start_date: string;
  end_date: string;
  days: number;
  status: "pending" | "approved" | "active" | "completed" | "cancelled";
  approved_by?: string | null;
  approved_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ILeaveWithUser extends IUserLeave {
  user_name?: string | null;
}
