"use client";

import { useEffect, useState } from "react";

const AGENTS = [
  { name: "Sentinel", action: "Care minutes compliant. RN confirmed tonight.", value: "180/215", dot: "#2d6a4f", time: "2m" },
  { name: "Chronicler", action: "SIRS Priority 1 draft ready. Awaiting DON.", value: "1 draft", dot: "#c89a3c", time: "11m" },
  { name: "Oracle", action: "AN-ACC reclassification opportunities identified.", value: "$11.4K/mo", dot: "#2d6a4f", time: "Sun" },
  { name: "Keeper", action: "PSH convergence Grevillea Wing. Cycle 6.", value: "2 domains", dot: "#b5572a", time: "Fri" },
  { name: "Steward", action: "Sunday PM structural gap. 7th consecutive week.", value: "$4.9K save", dot: "#c89a3c", time: "6am" },
  { name: "Sentinel", action: "Falls rate down 12% this quarter. Correlating with agency reduction.", value: "-12%", dot: "#2d6a4f", time: "4h" },
  { name: "Oracle", action: "Accommodation pricing $48K below market. 3 beds.", value: "$144K gap", dot: "#c89a3c", time: "Mon" },
  { name: "Keeper", action: "Turnover precursor detected. Wattle Wing PSH_13.", value: "71% prob", dot: "#b5572a", time: "Thu" },
  { name: "Chronicler", action: "Board Pack Q3 compiled. 8 sections. Awaiting CEO.", value: "8 days", dot: "#2d6a4f", time: "10am" },
  { name: "Steward", action: "Overtime concentrated in night shift RN. 3 staff.", value: "142 hrs", dot: "#c89a3c", time: "3am" },
];

export function AgentActivityCard() {
  const [offset, setOffset] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setOffset((prev) => (prev + 1) % (AGENTS.length - 4));
        setFade(true);
      }, 300);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const visible = AGENTS.slice(offset, offset + 5);

  return (
    <div className="bg-white rounded-[10px] p-5 w-full overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)" }}>
      {/* Fixed header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] font-semibold text-[#1a1218]">Agent activity</p>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-[#1a1218]/35">5/5</span>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2d6a4f] animate-pulse" />
            <span className="text-[9px] font-medium text-[#1a1218]/30">Running</span>
          </div>
        </div>
      </div>

      {/* Scrolling agent rows */}
      <div className={`space-y-0 transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"}`}>
        {visible.map((agent, i) => (
          <div key={`${offset}-${i}`} className="flex items-start gap-2.5 py-2" style={{ borderTop: i > 0 ? "1px solid rgba(26,18,24,0.04)" : "none" }}>
            <span className="w-2 h-2 rounded-full shrink-0 mt-1" style={{ backgroundColor: agent.dot }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#1a1218]/70">{agent.name}</span>
                <span className="text-[10px] font-semibold tabular-nums" style={{ color: agent.dot }}>{agent.value}</span>
              </div>
              <p className="text-[10px] text-[#1a1218]/40 mt-0.5 leading-snug">{agent.action}</p>
            </div>
            <span className="text-[9px] text-[#1a1218]/20 shrink-0">{agent.time}</span>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="flex items-center justify-center gap-1 mt-3 pt-2" style={{ borderTop: "1px solid rgba(26,18,24,0.04)" }}>
        {Array.from({ length: AGENTS.length - 4 }).map((_, i) => (
          <span key={i} className="w-1 h-1 rounded-full transition-all duration-300" style={{ backgroundColor: i === offset ? "#2d6a4f" : "rgba(26,18,24,0.1)" }} />
        ))}
      </div>
    </div>
  );
}
