"use client";

import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw, Save, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { User } from "@/lib/types";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    number: "",
    absen_pagi: false,
    absen_sore: false,
  });

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", userId).single();

      if (error) throw error;

      if (data) {
        setUser(data);
        setFormData({
          number: data.number.replace("@s.whatsapp.net", ""),
          absen_pagi: data.absen_pagi,
          absen_sore: data.absen_sore,
        });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      alert("Failed to load user data.");
      router.push("/users");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from("users")
        .update({
          number: formData.number.includes("@s.whatsapp.net")
            ? formData.number
            : `${formData.number}@s.whatsapp.net`,
          absen_pagi: formData.absen_pagi,
          absen_sore: formData.absen_sore,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;

      alert("User updated successfully!");
      router.push("/users");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const toggleAbsenPagi = () => {
    setFormData((prev) => ({ ...prev, absen_pagi: !prev.absen_pagi }));
  };

  const toggleAbsenSore = () => {
    setFormData((prev) => ({ ...prev, absen_sore: !prev.absen_sore }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-10 w-10 animate-spin text-blue-500" />
          <p className="text-sm text-zinc-500 font-medium">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">User not found</h2>
          <Button onClick={() => router.push("/users")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Button onClick={() => router.push("/users")} variant="outline" className="w-fit">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>

        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-700 bg-clip-text text-transparent mb-2">
            Edit User
          </h1>
          <p className="text-lg text-zinc-600">Update user information and check-in status</p>
        </div>
      </div>

      {/* Edit Form */}
      <Card className="shadow-xl border-zinc-200/50 overflow-hidden bg-white/90 backdrop-blur-2xl">
        <CardHeader className="border-b border-zinc-100/80 bg-linear-to-br from-zinc-50/50 to-white">
          <CardTitle className="text-2xl font-bold bg-linear-to-br from-zinc-900 to-zinc-700 bg-clip-text text-transparent flex items-center gap-3">
            <UserIcon className="h-6 w-6 text-zinc-700" />
            User Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* WhatsApp Number */}
            <div className="space-y-3">
              <Label htmlFor="number" className="text-sm font-semibold text-zinc-700">
                WhatsApp Number
              </Label>
              <Input
                id="number"
                type="text"
                value={formData.number}
                onChange={(e) => setFormData((prev) => ({ ...prev, number: e.target.value }))}
                placeholder="628123456789"
                className="font-mono border-zinc-300 focus:border-blue-500"
                required
              />
              <p className="text-xs text-zinc-500">
                Enter the phone number without @s.whatsapp.net
              </p>
            </div>

            {/* Check-in Status */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-zinc-700">Check-in Status</Label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Morning Check-in */}
                <div
                  onClick={toggleAbsenPagi}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    formData.absen_pagi
                      ? "border-emerald-300 bg-linear-to-br from-emerald-50 to-emerald-100/50 shadow-lg shadow-emerald-200/50"
                      : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-zinc-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-zinc-900">Morning Check-in</h3>
                    <Badge
                      variant="outline"
                      className={`${
                        formData.absen_pagi
                          ? "bg-emerald-500 text-white border-emerald-600"
                          : "bg-zinc-200 text-zinc-600 border-zinc-300"
                      }`}
                    >
                      {formData.absen_pagi ? "Completed" : "Pending"}
                    </Badge>
                  </div>
                  <p className="text-sm text-zinc-600">Click to toggle morning check-in status</p>
                </div>

                {/* Evening Check-in */}
                <div
                  onClick={toggleAbsenSore}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    formData.absen_sore
                      ? "border-violet-300 bg-linear-to-br from-violet-50 to-violet-100/50 shadow-lg shadow-violet-200/50"
                      : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-zinc-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-zinc-900">Evening Check-in</h3>
                    <Badge
                      variant="outline"
                      className={`${
                        formData.absen_sore
                          ? "bg-violet-500 text-white border-violet-600"
                          : "bg-zinc-200 text-zinc-600 border-zinc-300"
                      }`}
                    >
                      {formData.absen_sore ? "Completed" : "Pending"}
                    </Badge>
                  </div>
                  <p className="text-sm text-zinc-600">Click to toggle evening check-in status</p>
                </div>
              </div>
            </div>

            {/* User Metadata */}
            {user.created_at && (
              <div className="space-y-2 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600 font-medium">Created At:</span>
                  <span className="text-zinc-900 font-semibold">
                    {new Date(user.created_at).toLocaleString("id-ID")}
                  </span>
                </div>
                {user.last_checkin && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-600 font-medium">Last Check-in:</span>
                    <span className="text-zinc-900 font-semibold">
                      {new Date(user.last_checkin).toLocaleString("id-ID")}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/users")}
                disabled={saving}
                className="flex-1 font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
              >
                {saving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
