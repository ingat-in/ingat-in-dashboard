import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface StatCardProps {
  title: string;
  value?: string | number;
  icon: LucideIcon;
  gradient?: "blue" | "emerald" | "violet" | "amber" | "red";
  delay?: number;
  loading?: boolean;
  progress?: number;
  footer?: string;
}

const gradients = {
  blue: {
    card: "border-blue-100/50 bg-linear-to-br from-white via-blue-50/30 to-white",
    icon: "bg-linear-to-br from-blue-500 to-blue-600 shadow-blue-500/30",
    text: "text-blue-600",
    glow: "bg-blue-400/10 group-hover:bg-blue-400/20",
    hover: "hover:shadow-blue-500/10",
    overlay: "from-blue-500/5",
    progressBg: "bg-blue-100/60",
    progressBar: "[&>div]:bg-linear-to-r [&>div]:from-blue-500 [&>div]:to-blue-600",
  },
  emerald: {
    card: "border-emerald-100/50 bg-linear-to-br from-white via-emerald-50/30 to-white",
    icon: "bg-linear-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/30",
    text: "text-emerald-600",
    glow: "bg-emerald-400/10 group-hover:bg-emerald-400/20",
    hover: "hover:shadow-emerald-500/10",
    overlay: "from-emerald-500/5",
    progressBg: "bg-emerald-100/60",
    progressBar: "[&>div]:bg-linear-to-r [&>div]:from-emerald-500 [&>div]:to-emerald-600",
  },
  violet: {
    card: "border-violet-100/50 bg-linear-to-br from-white via-violet-50/30 to-white",
    icon: "bg-linear-to-br from-violet-500 to-violet-600 shadow-violet-500/30",
    text: "text-violet-600",
    glow: "bg-violet-400/10 group-hover:bg-violet-400/20",
    hover: "hover:shadow-violet-500/10",
    overlay: "from-violet-500/5",
    progressBg: "bg-violet-100/60",
    progressBar: "[&>div]:bg-linear-to-r [&>div]:from-violet-500 [&>div]:to-violet-600",
  },
  amber: {
    card: "border-amber-100/50 bg-linear-to-br from-white via-amber-50/30 to-white",
    icon: "bg-linear-to-br from-amber-500 to-amber-600 shadow-amber-500/30",
    text: "text-amber-600",
    glow: "bg-amber-400/10 group-hover:bg-amber-400/20",
    hover: "hover:shadow-amber-500/10",
    overlay: "from-amber-500/5",
    progressBg: "bg-amber-100/60",
    progressBar: "[&>div]:bg-linear-to-r [&>div]:from-amber-500 [&>div]:to-amber-600",
  },
  red: {
    card: "border-red-100/50 bg-linear-to-br from-white via-red-50/30 to-white",
    icon: "bg-linear-to-br from-red-500 to-red-600 shadow-red-500/30",
    text: "text-red-600",
    glow: "bg-red-400/10 group-hover:bg-red-400/20",
    hover: "hover:shadow-red-500/10",
    overlay: "from-red-500/5",
    progressBg: "bg-red-100/60",
    progressBar: "[&>div]:bg-linear-to-r [&>div]:from-red-500 [&>div]:to-red-600",
  },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  gradient = "blue",
  delay = 0,
  loading = false,
  progress,
  footer,
}: StatCardProps) {
  const colors = gradients[gradient];

  return (
    <Card
      className={`relative overflow-hidden ${colors.card} md:backdrop-blur-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 ${colors.hover} transition-all duration-300 group h-full`}
    >
      <div
        className={`absolute inset-0 bg-linear-to-br ${colors.overlay} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />
      <div
        className={`absolute -right-8 -top-8 h-32 w-32 rounded-full ${colors.glow} blur-2xl transition-colors duration-500`}
      />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
        <CardTitle className="text-sm font-semibold text-zinc-600 uppercase tracking-wide">
          {title}
        </CardTitle>
        <div
          className={`p-3 ${colors.icon} rounded-2xl text-white shadow-lg transition-transform duration-300 hover:scale-110 hover:rotate-12`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="pt-2 relative z-10">
        <div className="text-3xl md:text-5xl font-bold bg-linear-to-br from-zinc-900 to-zinc-700 bg-clip-text text-transparent mb-3">
          {loading || value === undefined ? (
            <div className="h-12 w-24 bg-linear-to-r from-zinc-200 to-zinc-300 animate-pulse rounded-lg" />
          ) : (
            <span className="inline-block animate-fade-in">{value}</span>
          )}
        </div>
        {progress !== undefined && (
          <Progress
            value={progress}
            className={`h-2 ${colors.progressBg} ${colors.progressBar} rounded-full mb-3`}
          />
        )}
        {footer && (
          <p className="text-sm text-zinc-500 flex items-center gap-1.5 font-medium">
            {footer.includes("%") ? (
              <>
                <span className={`${colors.text} font-semibold`}>{footer.split(" ")[0]}</span>{" "}
                {footer.split(" ").slice(1).join(" ")}
              </>
            ) : (
              footer
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
