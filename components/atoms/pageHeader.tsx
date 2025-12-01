import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
      <div>
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-700 bg-clip-text text-transparent mb-2">
          {title}
        </h1>
        <p className="text-sm md:text-lg text-zinc-600">{description}</p>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
