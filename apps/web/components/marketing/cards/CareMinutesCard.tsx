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

// 7-day sparkline data (total minutes compliance %)
const SPARKLINE = [82, 79, 85, 83, 78, 84, 84];

export function CareMinutesCard() {
  return (
    <div className="bg-white rounded-[10px] p-6 w-full" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[14px] font-semibold text-[#1a1218]">Care minutes</p>
          <p className="text-[10px] text-[#1a1218]/35">Mt Gib Gardens Bowral · Today</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(181,87,42,0.08)" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#b5572a" }} />
            <span className="text-[9px] font-semibold" style={{ color: "#b5572a" }}>Below target</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2d6a4f] animate-pulse" />
            <span className="text-[9px] font-medium text-[#1a1218]/30">Live</span>
          </div>
        </div>
      </div>

      {/* Big number */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-[52px] font-bold tracking-tight leading-none" style={{ color: "#b5572a" }}>
            <AnimNumber target={180} />
          </span>
          <span className="text-[14px] text-[#1a1218]/25">/ 215</span>
        </div>
        <p className="text-[11px] mt-1.5 font-medium" style={{ color: "#b5572a" }}>-35 below target · RN 31.2 / 44</p>
      </div>

      {/* Total bar */}
      <div className="mb-3">
        <div className="flex justify-between text-[10px] text-[#1a1218]/35 mb-1">
          <span>Total</span>
          <span className="font-semibold" style={{ color: "#b5572a" }}>84%</span>
        </div>
        <div className="h-2 bg-[#f5f3f0] rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-[2000ms] ease-out" style={{ width: "84%", backgroundColor: "#b5572a" }} />
        </div>
      </div>

      {/* RN bar */}
      <div className="mb-3">
        <div className="flex justify-between text-[10px] text-[#1a1218]/35 mb-1">
          <span>RN</span>
          <span className="font-semibold" style={{ color: "#c4674a" }}>71%</span>
        </div>
        <div className="h-2 bg-[#f5f3f0] rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-[2000ms] ease-out" style={{ width: "71%", backgroundColor: "#c4674a" }} />
        </div>
      </div>

      {/* 7-day sparkline */}
      <div className="mb-4">
        <p className="text-[9px] text-[#1a1218]/30 mb-1.5">7-day total compliance trend</p>
        <svg viewBox="0 0 140 28" className="w-full h-7">
          {/* Target line at 100% */}
          <line x1="0" y1="2" x2="140" y2="2" stroke="#2d6a4f" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.2" />
          {/* Sparkline */}
          <polyline
            fill="none" stroke="#2D7D73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            points={SPARKLINE.map((v, i) => `${i * (140 / 6)},${28 - (v / 100) * 26}`).join(" ")}
          />
          {/* Dots */}
          {SPARKLINE.map((v, i) => (
            <circle key={i} cx={i * (140 / 6)} cy={28 - (v / 100) * 26} r="2" fill="#2D7D73" opacity="0.6" />
          ))}
        </svg>
      </div>

      {/* Sentinel alert */}
      <div className="rounded-lg px-3 py-2.5 mb-4" style={{ backgroundColor: "rgba(181,87,42,0.05)", borderLeft: "3px solid #b5572a" }}>
        <p className="text-[10px] font-semibold mb-0.5" style={{ color: "#b5572a" }}>Sentinel alert</p>
        <p className="text-[11px] text-[#1a1218]/55 leading-relaxed">Afternoon RN shift unfilled. Projected breach if not covered by 3pm.</p>
      </div>

      {/* Shift breakdown */}
      <div className="space-y-0">
        {[
          { shift: "AM", total: "68", rn: "12.8", status: "warn" },
          { shift: "PM", total: "58", rn: "9.2", status: "bad" },
          { shift: "Night", total: "54", rn: "9.2", status: "warn" },
        ].map((s, i) => (
          <div key={s.shift} className="flex items-center justify-between py-2" style={{ borderTop: i > 0 ? "1px solid rgba(26,18,24,0.04)" : "none" }}>
            <span className="text-[11px] font-medium text-[#1a1218]/45">{s.shift}</span>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-semibold text-[#1a1218]/65">{s.total}</span>
              <span className="text-[10px] text-[#1a1218]/30">{s.rn} RN</span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.status === "bad" ? "#b5572a" : "#c89a3c" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
