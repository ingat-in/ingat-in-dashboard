import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface FormActionsProps {
  onCancel: () => void;
  onSubmit?: () => void;
  submitLabel: string;
  submitIcon?: LucideIcon;
  isLoading?: boolean;
  loadingLabel?: string;
  loadingIcon?: LucideIcon;
  cancelDisabled?: boolean;
  submitDisabled?: boolean;
}

export function FormActions({
  onCancel,
  submitLabel,
  submitIcon: SubmitIcon,
  isLoading = false,
  loadingLabel = "Processing...",
  loadingIcon: LoadingIcon,
  cancelDisabled = false,
  submitDisabled = false,
}: FormActionsProps) {
  return (
    <div className="flex gap-3 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={cancelDisabled || isLoading}
        className="flex-1 font-semibold"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={submitDisabled || isLoading}
        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
      >
        {isLoading ? (
          <>
            {LoadingIcon && <LoadingIcon className="mr-2 h-4 w-4 animate-spin" />}
            {loadingLabel}
          </>
        ) : (
          <>
            {SubmitIcon && <SubmitIcon className="mr-2 h-4 w-4" />}
            {submitLabel}
          </>
        )}
      </Button>
    </div>
  );
}
