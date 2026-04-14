"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Mic } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  showAskChris?: boolean;
}

export function PageHeader({ title, subtitle, backHref = "/dashboard", showAskChris = true }: PageHeaderProps) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        <button onClick={() => router.push(backHref)} className="p-1 -ml-1 hover:bg-muted rounded-lg">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">{title}</p>
          {subtitle && <p className="text-[10px] text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {showAskChris && (
        <button onClick={() => router.push("/dashboard/coach")} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted">
          <Mic className="w-3.5 h-3.5" /> Ask CHRIS
        </button>
      )}
    </div>
  );
}
