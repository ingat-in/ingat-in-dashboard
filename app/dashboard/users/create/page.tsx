"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Save } from "lucide-react";
import { toast } from "sonner";
import { logger } from "@/utils/logger";

import { useCreateUser } from "@/services/users/mutation";
import { FormContainer } from "@/components/organisms/formContainer";
import { FormInput } from "@/components/molecules/formInput";
import { CheckInStatusSection } from "@/components/organisms/checkInStatusSection";
import { FormActions } from "@/components/molecules/formActions";

export default function CreateUserPage() {
  const router = useRouter();
  const createUserMutation = useCreateUser();

  const [formData, setFormData] = useState({
    number: "",
    name: "",
    absen_pagi: false,
    absen_sore: false,
    suspend_until: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.number) {
      toast.error("Please enter a phone number");
      return;
    }

    // Format number to include WhatsApp format
    let formattedNumber = formData.number;

    if (formattedNumber.startsWith("0")) {
      formattedNumber = "62" + formattedNumber.substring(1);
    } else if (!formattedNumber.startsWith("62")) {
      formattedNumber = "62" + formattedNumber;
    }

    if (!formattedNumber.includes("@s.whatsapp.net")) {
      formattedNumber += "@s.whatsapp.net";
    }

    try {
      await createUserMutation.mutateAsync({
        number: formattedNumber,
        name: formData.name || null,
        absen_pagi: formData.absen_pagi,
        absen_sore: formData.absen_sore,
        suspend_until: formData.suspend_until || null,
      });

      toast.success("User created successfully!");
      router.push("/dashboard/users");
    } catch (error) {
      logger.error("Error creating user:", error);
      toast.error("Failed to create user. Please try again.");
    }
  };

  return (
    <FormContainer
      title="Create New User"
      subtitle="Add a new user to the system"
      icon={UserPlus}
      backUrl="/dashboard/users"
      onSubmit={handleSubmit}
    >
      <FormInput
        id="number"
        label="WhatsApp Number"
        type="text"
        placeholder="08123456789 or 628123456789"
        value={formData.number}
        onChange={(value) => setFormData((prev) => ({ ...prev, number: value }))}
        required
        helpText="Enter phone number (with or without country code)"
        className="font-mono"
      />

      <FormInput
        id="name"
        label="Name"
        type="text"
        placeholder="Enter user name (optional)"
        value={formData.name}
        onChange={(value) => setFormData((prev) => ({ ...prev, name: value }))}
        helpText="Optional: User's display name"
      />

      <CheckInStatusSection
        absenPagi={formData.absen_pagi}
        absenSore={formData.absen_sore}
        onTogglePagi={() => setFormData((prev) => ({ ...prev, absen_pagi: !prev.absen_pagi }))}
        onToggleSore={() => setFormData((prev) => ({ ...prev, absen_sore: !prev.absen_sore }))}
      />

      <FormInput
        id="suspend_until"
        label="Suspend Until"
        type="datetime-local"
        placeholder="Select suspension end date"
        value={formData.suspend_until}
        onChange={(value) => setFormData((prev) => ({ ...prev, suspend_until: value }))}
        helpText="Optional: Suspend user until this date and time"
      />

      <FormActions
        onCancel={() => router.push("/dashboard/users")}
        submitLabel="Create User"
        submitIcon={Save}
        isLoading={createUserMutation.isPending}
        loadingLabel="Creating..."
        loadingIcon={UserPlus}
        cancelDisabled={createUserMutation.isPending}
      />
    </FormContainer>
  );
}
