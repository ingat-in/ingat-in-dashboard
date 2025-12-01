import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface FormContainerProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  backUrl: string;
  children: ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  isEmpty?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
}

export function FormContainer({
  title,
  subtitle,
  icon: Icon,
  backUrl,
  children,
  onSubmit,
  isEmpty = false,
  emptyMessage = "Not found",
  emptyDescription,
}: FormContainerProps) {
  const router = useRouter();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Button onClick={() => router.push(backUrl)} variant="outline" className="w-fit">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>

        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-700 bg-clip-text text-transparent mb-2">
            {title}
          </h1>
          <p className="text-lg text-zinc-600">{subtitle}</p>
        </div>
      </div>

      {/* Empty State or Form Card */}
      {isEmpty ? (
        <Card className="shadow-xl border-zinc-200/50 overflow-hidden bg-white/90 md:backdrop-blur-2xl">
          {/* backdrop-blur only on desktop */}
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 rounded-full bg-zinc-100">
                <Icon className="h-8 w-8 text-zinc-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-zinc-900">{emptyMessage}</h3>
                {emptyDescription && (
                  <p className="text-sm text-zinc-500 max-w-sm">{emptyDescription}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-xl border-zinc-200/50 overflow-hidden bg-white/90 md:backdrop-blur-2xl">
          {/* backdrop-blur only on desktop */}
          <CardHeader className="border-b border-zinc-100/80 bg-linear-to-br from-zinc-50/50 to-white">
            <CardTitle className="text-2xl font-bold bg-linear-to-br from-zinc-900 to-zinc-700 bg-clip-text text-transparent flex items-center gap-3">
              <Icon className="h-6 w-6 text-zinc-700" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={onSubmit} className="space-y-8">
              {children}
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
