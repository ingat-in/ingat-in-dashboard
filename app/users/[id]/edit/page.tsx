"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { Save, UserCog } from "lucide-react";
import { toast } from "sonner";
import { logger } from "@/utils/logger";

import { useUser } from "@/services/users/query";
import { useUpdateUser } from "@/services/users/mutation";
import { FormContainer } from "@/components/organisms/formContainer";
import { LoadingState } from "@/components/atoms/loadingState";
import { FormInput } from "@/components/molecules/formInput";
import { CheckInStatusSection } from "@/components/organisms/checkInStatusSection";
import { FormActions } from "@/components/molecules/formActions";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const { data: user, isLoading: loading } = useUser(userId);
  const updateUserMutation = useUpdateUser();

  type FormData = {
    number: string;
    absen_pagi: boolean;
    absen_sore: boolean;
  };

  // Initialize form data from user, re-compute when user changes
  const initialFormData = useMemo(
    () => ({
      number: user?.number.replace("@s.whatsapp.net", "") || "",
      absen_pagi: user?.absen_pagi || false,
      absen_sore: user?.absen_sore || false,
    }),
    [user]
  );

  const [formData, setFormData] = useState<FormData>(initialFormData);

  // Sync formData when initialFormData changes
  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateUserMutation.mutateAsync({
        id: userId,
        updates: {
          number: formData.number.includes("@s.whatsapp.net")
            ? formData.number
            : `${formData.number}@s.whatsapp.net`,
          absen_pagi: formData.absen_pagi,
          absen_sore: formData.absen_sore,
        },
      });

      toast.success("User updated successfully!");
      router.push("/users");
    } catch (error) {
      logger.error("Error updating user:", error);
      toast.error("Failed to update user. Please try again.");
    }
  };

  if (loading) {
    return <LoadingState message="Loading user data..." />;
  }

  return (
    <FormContainer
      title="Edit User"
      subtitle="Update user information and check-in status"
      icon={UserCog}
      backUrl="/users"
      onSubmit={handleSubmit}
      isEmpty={!user}
      emptyMessage="User not found"
      emptyDescription="The user you're looking for doesn't exist or has been deleted."
    >
      {user && (
        <>
          <FormInput
            id="number"
            label="WhatsApp Number"
            type="text"
            placeholder="628123456789"
            value={formData.number}
            onChange={(value) => setFormData((prev) => ({ ...prev, number: value }))}
            required
            helpText="Enter the phone number without @s.whatsapp.net"
            className="font-mono"
          />

          <CheckInStatusSection
            absenPagi={formData.absen_pagi}
            absenSore={formData.absen_sore}
            onTogglePagi={() => setFormData((prev) => ({ ...prev, absen_pagi: !prev.absen_pagi }))}
            onToggleSore={() => setFormData((prev) => ({ ...prev, absen_sore: !prev.absen_sore }))}
          />

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

          <FormActions
            onCancel={() => router.push("/users")}
            submitLabel="Save Changes"
            submitIcon={Save}
            isLoading={updateUserMutation.isPending}
            loadingLabel="Saving..."
            cancelDisabled={updateUserMutation.isPending}
          />
        </>
      )}
    </FormContainer>
  );
}
