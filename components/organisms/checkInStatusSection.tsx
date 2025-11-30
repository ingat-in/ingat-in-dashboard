import { Label } from "@/components/ui/label";
import { CheckInCard } from "@/components/molecules/checkInCard";

interface CheckInStatusSectionProps {
  absenPagi: boolean;
  absenSore: boolean;
  onTogglePagi: () => void;
  onToggleSore: () => void;
}

export function CheckInStatusSection({
  absenPagi,
  absenSore,
  onTogglePagi,
  onToggleSore,
}: CheckInStatusSectionProps) {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-semibold text-zinc-700">Check-in Status</Label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CheckInCard
          title="Morning Check-in"
          description="Click to toggle morning check-in status"
          isActive={absenPagi}
          onClick={onTogglePagi}
          activeColor="emerald"
        />

        <CheckInCard
          title="Evening Check-in"
          description="Click to toggle evening check-in status"
          isActive={absenSore}
          onClick={onToggleSore}
          activeColor="violet"
        />
      </div>
    </div>
  );
}
