import { Badge } from "@/components/ui/badge";

interface CheckInCardProps {
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
  activeColor: "emerald" | "violet";
}

const colors = {
  emerald: {
    border: "border-emerald-300",
    background: "bg-linear-to-br from-emerald-50 to-emerald-100/50",
    shadow: "shadow-lg shadow-emerald-200/50",
    badge: "bg-emerald-500 text-white border-emerald-600",
  },
  violet: {
    border: "border-violet-300",
    background: "bg-linear-to-br from-violet-50 to-violet-100/50",
    shadow: "shadow-lg shadow-violet-200/50",
    badge: "bg-violet-500 text-white border-violet-600",
  },
};

export function CheckInCard({ title, description, isActive, onClick, activeColor }: CheckInCardProps) {
  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
        isActive
          ? `${colors[activeColor].border} ${colors[activeColor].background} ${colors[activeColor].shadow}`
          : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-zinc-100"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-zinc-900">{title}</h3>
        <Badge
          variant="outline"
          className={`${
            isActive
              ? colors[activeColor].badge
              : "bg-zinc-200 text-zinc-600 border-zinc-300"
          }`}
        >
          {isActive ? "Completed" : "Pending"}
        </Badge>
      </div>
      <p className="text-sm text-zinc-600">{description}</p>
    </div>
  );
}
