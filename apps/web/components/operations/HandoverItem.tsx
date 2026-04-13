"use client";

interface HandoverItemProps {
  priority: "high" | "medium" | "low";
  title: string;
  detail: string;
  source: string;
  generatedBy: "chronicler" | "sentinel" | "manual";
  wing?: string;
  noted: boolean;
  onMarkNoted: () => void;
}

const PRIORITY_STYLES = {
  high: "border-l-[#C4704A] bg-[#FEF7F0]",
  medium: "border-l-[#D4A017] bg-[#FFFBF0]",
  low: "border-l-[#2D7D73] bg-white",
};

const PRIORITY_DOTS = { high: "\u{1F534}", medium: "\u{1F7E1}", low: "\u{1F7E2}" };

const AGENT_BADGES: Record<string, string> = {
  chronicler: "bg-amber-100 text-amber-700 border border-amber-200",
  sentinel: "bg-[#F0F4F2] text-[#1B4332] border border-[#2D7D73]",
  steward: "bg-teal-50 text-teal-700 border border-teal-200",
  manual: "bg-gray-100 text-gray-600 border border-gray-200",
};

const AGENT_LABELS: Record<string, string> = {
  chronicler: "Chronicler",
  sentinel: "Sentinel",
  steward: "Steward",
  manual: "Manual",
};

export function HandoverItem({ priority, title, detail, source, generatedBy, wing, noted, onMarkNoted }: HandoverItemProps) {
  return (
    <div className={`rounded-xl border-l-4 border border-border p-4 transition-all ${PRIORITY_STYLES[priority]} ${noted ? "opacity-50" : ""}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm">{PRIORITY_DOTS[priority]}</span>
          <span className={`text-sm font-semibold text-foreground ${noted ? "line-through" : ""}`}>{title}</span>
        </div>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${AGENT_BADGES[generatedBy]}`}>
          {AGENT_LABELS[generatedBy]}
        </span>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed mb-2">{detail}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground/60">{source}</span>
          {wing && <span className="text-[10px] text-muted-foreground/60">· {wing}</span>}
        </div>
        {!noted ? (
          <button
            onClick={onMarkNoted}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
          >
            Mark as noted ✓
          </button>
        ) : (
          <span className="text-[10px] text-muted-foreground/40">Noted ✓</span>
        )}
      </div>
    </div>
  );
}
