"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface StaffMember {
  role: "RN" | "EN" | "AIN";
  name: string;
  agency: boolean;
  gap?: boolean;
}

interface ShiftCardProps {
  shift: "morning" | "afternoon" | "night";
  timeRange: string;
  totalRostered: number;
  gaps: number;
  rnConfirmed: boolean;
  agencyCount: number;
  staff: StaffMember[];
  onFillGap?: () => void;
  defaultExpanded?: boolean;
}

const SHIFT_LABELS = { morning: "Morning", afternoon: "Afternoon", night: "Night" };

const ROLE_COLORS: Record<string, string> = {
  RN: "bg-[#1B4332] text-white",
  EN: "bg-[#2D7D73] text-white",
  AIN: "bg-[#6BAF92] text-white",
};

export function ShiftCard({ shift, timeRange, totalRostered, gaps, rnConfirmed, agencyCount, staff, onFillGap, defaultExpanded = false }: ShiftCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const hasGap = gaps > 0;
  const hasRnGap = !rnConfirmed;

  return (
    <div className={`rounded-xl border overflow-hidden ${hasRnGap ? "border-[#C4704A]" : hasGap ? "border-[#D4A017]" : "border-border"}`}>
      <button onClick={() => setExpanded(!expanded)} className="w-full p-4 text-left flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${hasGap ? "bg-[#D4A017]" : "bg-[#2D7D73]"}`} />
            <span className="text-sm font-semibold text-foreground">{SHIFT_LABELS[shift]}</span>
          </div>
          <span className="text-xs text-muted-foreground">{timeRange}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{totalRostered} staff</span>
          {hasGap && <span className="text-xs font-medium text-[#D4A017]">{gaps} gap{gaps > 1 ? "s" : ""}</span>}
          {!hasGap && <span className="text-xs text-[#2D7D73]">✓</span>}
          <span className="text-xs text-muted-foreground">RN {rnConfirmed ? "✓" : "⚠"}</span>
          {agencyCount > 0 && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[#D4A017]/10 text-[#D4A017]">{agencyCount} agency</span>
          )}
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border">
          {staff.map((s, i) => (
            s.gap ? (
              <div key={i} className="flex items-center justify-between px-4 py-2.5 bg-[#FEF7F0] border-l-2 border-[#C4704A]">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${ROLE_COLORS[s.role]}`}>{s.role}</span>
                  <span className="text-sm text-[#C4704A] font-medium">{s.name}</span>
                </div>
                {onFillGap && (
                  <button onClick={onFillGap} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#D4A017] text-white hover:opacity-90">
                    Fill gap →
                  </button>
                )}
              </div>
            ) : (
              <div key={i} className="flex items-center gap-2 px-4 py-2 border-b border-border last:border-b-0">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${ROLE_COLORS[s.role]}`}>{s.role}</span>
                <span className="text-sm text-foreground flex-1">{s.name}</span>
                {s.agency && (
                  <span className="w-[18px] h-[18px] rounded-full bg-[#D4A017] text-white text-[10px] font-bold flex items-center justify-center">A</span>
                )}
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}
