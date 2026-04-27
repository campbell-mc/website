"use client";

import { useEffect, useState } from "react";

function AnimNumber({ target, suffix = "", prefix = "", duration = 2000 }: { target: number; suffix?: string; prefix?: string; duration?: number }) {
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

  return <>{prefix}{value}{suffix}</>;
}

export function CareMinutesCard() {
  return (
    <div className="bg-white rounded-2xl p-6 w-full" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[13px] font-semibold text-[#1a1218]">Care minutes</p>
          <p className="text-[11px] text-[#1a1218]/40">Mt Gib Gardens Bowral · Today</p>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ backgroundColor: "rgba(45,106,79,0.08)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#2d6a4f]" />
          <span className="text-[10px] font-medium text-[#2d6a4f]">Compliant</span>
        </div>
      </div>

      {/* Big number */}
      <div className="mb-5">
        <div className="flex items-baseline gap-2">
          <span className="text-[48px] font-light tracking-tight leading-none text-[#1a1218]">
            <AnimNumber target={236} />
          </span>
          <span className="text-[14px] text-[#1a1218]/35">/ 215 min target</span>
        </div>
        <p className="text-[12px] text-[#2d6a4f] mt-1.5">+21 above target · RN 46.8 of 44 required</p>
      </div>

      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex justify-between text-[10px] text-[#1a1218]/40 mb-1.5">
          <span>Total minutes compliance</span>
          <span className="font-medium text-[#1a1218]/60">110%</span>
        </div>
        <div className="h-2 bg-[#f5f3f0] rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-[#2d6a4f] transition-all duration-[2000ms] ease-out" style={{ width: "100%" }} />
        </div>
      </div>

      {/* Shift breakdown */}
      <div className="space-y-2.5">
        {[
          { shift: "Morning", total: "82", rn: "16.2", status: "ok" },
          { shift: "Afternoon", total: "78", rn: "15.4", status: "ok" },
          { shift: "Night", total: "76", rn: "15.2", status: "ok" },
        ].map((s) => (
          <div key={s.shift} className="flex items-center justify-between py-2 border-t" style={{ borderColor: "rgba(26,18,24,0.04)" }}>
            <span className="text-[12px] text-[#1a1218]/50">{s.shift}</span>
            <div className="flex items-center gap-4">
              <span className="text-[12px] font-medium text-[#1a1218]/70">{s.total} total</span>
              <span className="text-[12px] text-[#1a1218]/40">{s.rn} RN</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#2d6a4f]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
