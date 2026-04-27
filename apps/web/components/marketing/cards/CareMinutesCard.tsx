"use client";

import { useEffect, useState } from "react";

function AnimNumber({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!started) return;
    const start = Date.now();
    const step = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return <>{value}</>;
}

export function CareMinutesCard() {
  return (
    <div className="bg-white rounded-2xl p-7 w-full" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[14px] font-semibold text-[#1a1218]">Care minutes</p>
          <p className="text-[11px] text-[#1a1218]/40">Mt Gib Gardens Bowral · Today</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(181,87,42,0.08)" }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#b5572a" }} />
          <span className="text-[10px] font-medium" style={{ color: "#b5572a" }}>Below target</span>
        </div>
      </div>

      {/* Big number */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-[56px] font-light tracking-tight leading-none" style={{ color: "#b5572a" }}>
            <AnimNumber target={180} />
          </span>
          <span className="text-[15px] text-[#1a1218]/30">/ 215 min target</span>
        </div>
        <p className="text-[13px] mt-2" style={{ color: "#b5572a" }}>−35 below target · RN 31.2 of 44 required</p>
      </div>

      {/* Total progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-[10px] text-[#1a1218]/40 mb-1.5">
          <span>Total minutes compliance</span>
          <span className="font-medium" style={{ color: "#b5572a" }}>84%</span>
        </div>
        <div className="h-2.5 bg-[#f5f3f0] rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-[2000ms] ease-out" style={{ width: "84%", backgroundColor: "#b5572a" }} />
        </div>
      </div>

      {/* RN progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-[10px] text-[#1a1218]/40 mb-1.5">
          <span>RN minutes compliance</span>
          <span className="font-medium" style={{ color: "#b5572a" }}>71%</span>
        </div>
        <div className="h-2.5 bg-[#f5f3f0] rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-[2000ms] ease-out" style={{ width: "71%", backgroundColor: "#c4674a" }} />
        </div>
      </div>

      {/* CHRIS alert */}
      <div className="rounded-xl px-4 py-3 mb-5" style={{ backgroundColor: "rgba(181,87,42,0.06)", borderLeft: "3px solid #b5572a" }}>
        <p className="text-[11px] font-medium mb-0.5" style={{ color: "#b5572a" }}>Sentinel alert</p>
        <p className="text-[12px] text-[#1a1218]/60 leading-relaxed">Afternoon RN shift unfilled. Projected care minutes will breach if not covered by 3pm.</p>
      </div>

      {/* Shift breakdown */}
      <div className="space-y-0">
        {[
          { shift: "Morning", total: "68", rn: "12.8", status: "warn" },
          { shift: "Afternoon", total: "58", rn: "9.2", status: "bad" },
          { shift: "Night", total: "54", rn: "9.2", status: "warn" },
        ].map((s, i) => (
          <div key={s.shift} className="flex items-center justify-between py-2.5" style={{ borderTop: i > 0 ? "1px solid rgba(26,18,24,0.04)" : "none" }}>
            <span className="text-[12px] text-[#1a1218]/50">{s.shift}</span>
            <div className="flex items-center gap-4">
              <span className="text-[12px] font-medium text-[#1a1218]/70">{s.total} total</span>
              <span className="text-[12px] text-[#1a1218]/40">{s.rn} RN</span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.status === "bad" ? "#b5572a" : "#c89a3c" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
