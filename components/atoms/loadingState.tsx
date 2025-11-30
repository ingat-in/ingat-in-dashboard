import { RefreshCw } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingState({ message = "Loading...", size = "md" }: LoadingStateProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <RefreshCw className={`${sizeClasses[size]} animate-spin text-blue-500`} />
      <p className="text-sm text-zinc-500 font-medium">{message}</p>
    </div>
  );
}
