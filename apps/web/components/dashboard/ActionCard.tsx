"use client";

import { MoreHorizontal } from "lucide-react";

interface ActionCardProps {
  urgency: "critical" | "warning" | "info" | "positive";
  icon: React.ReactNode;
  title: string;
  chris: string;
  actionLabel: string;
  onAction: () => void;
  deadline?: string;
  meta?: string;
}

const URGENCY_STYLES = {
  critical: { border: "border-l-[hsl(var(--brand-terracotta))]", bg: "rgba(196,112,74,0.06)", shadow: "0 4px 24px rgba(0,0,0,0.10)" },
  warning: { border: "border-l-[hsl(var(--brand-amber))]", bg: "rgba(212,160,23,0.06)", shadow: "0 4px 24px rgba(0,0,0,0.10)" },
  info: { border: "border-l-[hsl(var(--brand-forest))]", bg: "transparent", shadow: "" },
  positive: { border: "border-l-[hsl(var(--brand-teal))]", bg: "transparent", shadow: "" },
};

export function ActionCard({ urgency, icon, title, chris, actionLabel, onAction, deadline, meta }: ActionCardProps) {
  const styles = URGENCY_STYLES[urgency];
  return (
    <div className={`rounded-xl p-4 border border-border border-l-4 ${styles.border} mb-3`} style={{ background: styles.bg || "var(--color-card)", boxShadow: styles.shadow || "" }}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-foreground">{title}</p>
            {deadline && <span className="text-[10px] text-muted-foreground font-mono shrink-0">{deadline}</span>}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-2">{chris}</p>
          {meta && <p className="text-[10px] text-muted-foreground/60 mb-2">{meta}</p>}
          <div className="flex items-center gap-2">
            <button onClick={onAction} className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">{actionLabel}</button>
            <button className="text-xs text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted"><MoreHorizontal className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
