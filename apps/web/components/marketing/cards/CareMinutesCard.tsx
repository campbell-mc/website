"use client";

import { useEffect, useState, useRef } from "react";

function AnimNumber({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setStarted(true), 300); return () => clearTimeout(t); }, []);
  useEffect(() => {
    if (!started) return;
    const start = Date.now();
    const step = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);
  return <>{value}</>;
}

// 14-day trend data (total minutes)
const TREND_14 = [188, 192, 185, 198, 194, 182, 179, 190, 186, 195, 183, 180, 178, 180];
// RN trend
const RN_TREND = [33, 35, 30, 38, 36, 31, 29, 34, 32, 36, 30, 31, 29, 31];

// Mini animated sparkline that draws itself
function AnimSparkline({ data, color, height = 32, targetLine }: { data: number[]; color: string; height?: number; targetLine?: number }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const dur = 1500;
    const step = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) requestAnimationFrame(step);
    };
    const t = setTimeout(() => requestAnimationFrame(step), 500);
    return () => clearTimeout(t);
  }, []);

  const max = Math.max(...data) * 1.1;
  const min = Math.min(...data) * 0.9;
  const w = 160;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - ((v - min) / (max - min)) * (height - 4)}`);
  const visibleCount = Math.ceil(progress * data.length);

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }}>
      {targetLine && (
        <line x1="0" y1={height - ((targetLine - min) / (max - min)) * (height - 4)} x2={w} y2={height - ((targetLine - min) / (max - min)) * (height - 4)} stroke="#2d6a4f" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.25" />
      )}
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        points={points.slice(0, visibleCount).join(" ")} opacity="0.7" />
      {data.slice(0, visibleCount).map((v, i) => (
        <circle key={i} cx={(i / (data.length - 1)) * w} cy={height - ((v - min) / (max - min)) * (height - 4)}
          r={i === visibleCount - 1 ? 2.5 : 1.5} fill={color} opacity={i === visibleCount - 1 ? 1 : 0.4} />
      ))}
    </svg>
  );
}

export function CareMinutesCard() {
  // Simulate live update pulse
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const i = setInterval(() => { setPulse(true); setTimeout(() => setPulse(false), 800); }, 8000);
    return () => clearInterval(i);
  }, []);

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
            <span className={`w-1.5 h-1.5 rounded-full bg-[#2d6a4f] ${pulse ? "animate-ping" : "animate-pulse"}`} />
            <span className="text-[9px] font-medium text-[#1a1218]/30">Live</span>
          </div>
        </div>
      </div>

      {/* Big number with supplementary data */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-[52px] font-bold tracking-tight leading-none" style={{ color: "#b5572a" }}>
            <AnimNumber target={180} />
          </span>
          <div>
            <span className="text-[14px] text-[#1a1218]/25">/ 215</span>
            <p className="text-[10px] text-[#1a1218]/25 mt-0.5">min/res/day</p>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-[11px] font-medium" style={{ color: "#b5572a" }}>-35 below target</span>
          <span className="text-[10px] text-[#1a1218]/25">·</span>
          <span className="text-[11px] font-medium" style={{ color: "#c4674a" }}>RN 31.2 / 44</span>
          <span className="text-[10px] text-[#1a1218]/25">·</span>
          <span className="text-[10px] text-[#1a1218]/35">Supp: 0%</span>
        </div>
      </div>

      {/* Dual compliance bars with animated fill */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <div className="flex justify-between text-[9px] text-[#1a1218]/35 mb-1">
            <span>Total</span>
            <span className="font-semibold" style={{ color: "#b5572a" }}>84%</span>
          </div>
          <div className="h-2 bg-[#f5f3f0] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-[2000ms] ease-out" style={{ width: "84%", backgroundColor: "#b5572a" }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-[9px] text-[#1a1218]/35 mb-1">
            <span>RN</span>
            <span className="font-semibold" style={{ color: "#c4674a" }}>71%</span>
          </div>
          <div className="h-2 bg-[#f5f3f0] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-[2000ms] ease-out" style={{ width: "71%", backgroundColor: "#c4674a" }} />
          </div>
        </div>
      </div>

      {/* 14-day sparklines (animated draw) */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[9px] text-[#1a1218]/30">14-day trend</p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1"><span className="w-2 h-0.5 rounded" style={{ backgroundColor: "#b5572a" }} /><span className="text-[8px] text-[#1a1218]/25">Total</span></div>
            <div className="flex items-center gap-1"><span className="w-2 h-0.5 rounded" style={{ backgroundColor: "#2D7D73" }} /><span className="text-[8px] text-[#1a1218]/25">RN</span></div>
          </div>
        </div>
        <div className="relative">
          <AnimSparkline data={TREND_14} color="#b5572a" height={36} targetLine={215} />
          <div className="absolute inset-0">
            <AnimSparkline data={RN_TREND} color="#2D7D73" height={36} targetLine={44} />
          </div>
        </div>
      </div>

      {/* Sentinel alert with pulse animation */}
      <div className={`rounded-lg px-3 py-2.5 mb-3 transition-all duration-500 ${pulse ? "ring-1 ring-[#b5572a]/20" : ""}`} style={{ backgroundColor: "rgba(181,87,42,0.05)", borderLeft: "3px solid #b5572a" }}>
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className={`w-1.5 h-1.5 rounded-full ${pulse ? "animate-ping" : ""}`} style={{ backgroundColor: "#b5572a" }} />
          <p className="text-[10px] font-semibold" style={{ color: "#b5572a" }}>Sentinel alert</p>
          <span className="text-[9px] text-[#1a1218]/25 ml-auto">2 min ago</span>
        </div>
        <p className="text-[11px] text-[#1a1218]/55 leading-relaxed">Afternoon RN shift unfilled. Projected breach if not covered by 3pm. Agency options: 2 available, $87/hr blended.</p>
      </div>

      {/* Shift breakdown with mini bars */}
      <div className="space-y-0">
        {[
          { shift: "AM", total: 68, rn: 12.8, target: 72, status: "warn" },
          { shift: "PM", total: 58, rn: 9.2, target: 72, status: "bad" },
          { shift: "Night", total: 54, rn: 9.2, target: 71, status: "warn" },
        ].map((s, i) => (
          <div key={s.shift} className="py-2" style={{ borderTop: i > 0 ? "1px solid rgba(26,18,24,0.04)" : "none" }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-medium text-[#1a1218]/45">{s.shift}</span>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-semibold text-[#1a1218]/65">{s.total} min</span>
                <span className="text-[10px] text-[#1a1218]/30">{s.rn} RN</span>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.status === "bad" ? "#b5572a" : "#c89a3c" }} />
              </div>
            </div>
            <div className="h-1 bg-[#f5f3f0] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-[2000ms]" style={{ width: `${(s.total / s.target) * 100}%`, backgroundColor: s.status === "bad" ? "#b5572a" : "#c89a3c" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom summary row */}
      <div className="flex items-center justify-between mt-3 pt-2" style={{ borderTop: "1px solid rgba(26,18,24,0.06)" }}>
        <div className="text-[9px] text-[#1a1218]/30">
          <span className="font-semibold text-[#1a1218]/50">92%</span> occupancy · <span className="font-semibold text-[#1a1218]/50">80</span> beds · <span className="font-semibold text-[#1a1218]/50">74</span> occupied
        </div>
        <span className="text-[9px] font-medium" style={{ color: "#b5572a" }}>Supp gap: $139K/yr</span>
      </div>
    </div>
  );
}
