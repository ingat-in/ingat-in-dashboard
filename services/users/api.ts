import { supabase } from "@/lib/supabase";
import { IUser } from "@/interfaces/users";
import { USER_TABLE_CONFIG } from "@/constants";

/**
 * User API functions
 */

export async function getUsers(): Promise<IUser[]> {
  const { data, error } = await supabase
    .from(USER_TABLE_CONFIG.NAME)
    .select("*")
    .order(USER_TABLE_CONFIG.ORDER_BY, { ascending: false });

  if (error) throw error;
  return (data as IUser[]) || [];
}

export async function getUserById(id: string): Promise<IUser> {
  const { data, error } = await supabase
    .from(USER_TABLE_CONFIG.NAME)
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as IUser;
}

export async function updateUser(id: string, updates: Partial<IUser>): Promise<IUser> {
  const { data, error } = await supabase
    .from(USER_TABLE_CONFIG.NAME)
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as IUser;
}

export async function deleteUser(id: string): Promise<void> {
  const { error } = await supabase.from(USER_TABLE_CONFIG.NAME).delete().eq("id", id);

  if (error) throw error;
}

export async function createUser(
  user: Omit<IUser, "id" | "created_at" | "updated_at">
): Promise<IUser> {
  const { data, error } = await supabase
    .from(USER_TABLE_CONFIG.NAME)
    .insert(user)
    .select()
    .single();

  if (error) throw error;
  return data as IUser;
}

export async function resetMorningAttendance(): Promise<void> {
  const { error } = await supabase
    .from(USER_TABLE_CONFIG.NAME)
    .update({ absen_pagi: false, updated_at: new Date().toISOString() })
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (error) throw error;
}

export async function resetEveningAttendance(): Promise<void> {
  const { error } = await supabase
    .from(USER_TABLE_CONFIG.NAME)
    .update({ absen_sore: false, updated_at: new Date().toISOString() })
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (error) throw error;
}

export async function getRecentActivity(): Promise<IUser[]> {
  const { data, error } = await supabase
    .from(USER_TABLE_CONFIG.NAME)
    .select("*")
    .not("last_checkin", "is", null)
    .order("last_checkin", { ascending: false })
    .limit(4);

  if (error) throw error;
  return (data as IUser[]) || [];
}
