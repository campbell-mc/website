"use client";

interface IncidentCardProps {
  incidentId: string;
  type: string;
  date: string;
  wing: string;
  status: "logged" | "assessed" | "sirs_notified" | "closed";
  daysOpen: number;
  sirsCategory?: number | null;
  sirsDeadline?: string;
  agencyShift: boolean;
  onAction: () => void;
}

const STATUS_PILLS: Record<string, string> = {
  logged: "bg-[#6B7280] text-white",
  assessed: "bg-[#2D7D73] text-white",
  sirs_notified: "bg-[#D4A017] text-white",
  closed: "bg-[#6BAF92] text-white",
};

const STATUS_LABELS: Record<string, string> = {
  logged: "Logged",
  assessed: "Assessed",
  sirs_notified: "SIRS Notified",
  closed: "Closed",
};

const ACTION_LABELS: Record<string, string> = {
  logged: "Assess incident →",
  assessed: "Review SIRS draft →",
  sirs_notified: "View submission →",
  closed: "View details →",
};

function getSirsUrgency(category: number | null | undefined, deadline: string | undefined): { color: string; pulse: boolean; label: string } | null {
  if (!category || !deadline) return null;
  const remaining = new Date(deadline).getTime() - Date.now();
  const hours = remaining / (1000 * 60 * 60);

  if (category === 1) {
    if (hours < 6) return { color: "text-[#C4704A]", pulse: true, label: `Cat 1 — ${Math.max(0, Math.round(hours))}h remaining` };
    if (hours < 12) return { color: "text-[#C4704A]", pulse: false, label: `Cat 1 — ${Math.round(hours)}h remaining` };
    return { color: "text-[#D4A017]", pulse: false, label: `Cat 1 — ${Math.round(hours)}h remaining` };
  }
  const days = hours / 24;
  if (days < 7) return { color: "text-[#D4A017]", pulse: false, label: `Cat 2 — ${Math.round(days)}d remaining` };
  return { color: "text-muted-foreground", pulse: false, label: `Cat 2 — ${Math.round(days)}d remaining` };
}

export function IncidentCard({ incidentId, type, date, wing, status, daysOpen, sirsCategory, sirsDeadline, agencyShift, onAction }: IncidentCardProps) {
  const urgency = getSirsUrgency(sirsCategory, sirsDeadline);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <p className="text-sm font-semibold text-foreground">{type}</p>
          <p className="text-xs text-muted-foreground">{incidentId} · {date} · {wing}</p>
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${STATUS_PILLS[status]}`}>
          {STATUS_LABELS[status]}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-3">
        {sirsCategory && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#D4A017]/10 text-[#D4A017] border border-[#D4A017]/20">
            SIRS Cat {sirsCategory}
          </span>
        )}
        {agencyShift && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#D4A017]/10 text-[#D4A017]">
            Agency shift
          </span>
        )}
        {status !== "closed" && (
          <span className="text-[10px] text-muted-foreground">{daysOpen} days open</span>
        )}
        {status === "closed" && (
          <span className="text-[10px] text-muted-foreground">Closed in {daysOpen} days</span>
        )}
      </div>

      {urgency && (
        <div className={`text-xs font-medium mb-3 ${urgency.color} ${urgency.pulse ? "animate-pulse" : ""}`}>
          ⏱ {urgency.label}
        </div>
      )}

      {status !== "closed" && (
        <button
          onClick={onAction}
          className="w-full py-2.5 rounded-lg text-xs font-medium bg-[#1B4332] text-white hover:opacity-90"
        >
          {ACTION_LABELS[status]}
        </button>
      )}
    </div>
  );
}
