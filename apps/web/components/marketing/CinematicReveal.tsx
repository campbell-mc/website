"use client";

import { useEffect, useRef, useState } from "react";

const LINES = [
  { text: "11:04pm Friday.", style: "timestamp" as const, delay: 0 },
  { text: "A Priority 1 incident.", style: "setup" as const, delay: 200 },
  { text: "24 hours to notify ACQSC.", style: "setup" as const, delay: 400 },
  { text: "CHRIS classified it in 4 minutes.", style: "action" as const, delay: 800 },
  { text: "The draft was waiting in the DON\u2019s inbox by 11:09.", style: "resolution" as const, delay: 1200 },
  { text: "She approved it before midnight.", style: "resolution" as const, delay: 1600 },
  { text: "That\u2019s not a feature.", style: "pause" as const, delay: 2200 },
  { text: "That\u2019s the difference between a penalty", style: "punchline" as const, delay: 2800 },
  { text: "and a clean record.", style: "punchline" as const, delay: 3200 },
];

const STYLE_MAP: Record<string, { fontSize: string; fontFamily: string; fontStyle: string; fontWeight: string; color: string; marginBottom: string }> = {
  timestamp: { fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontFamily: "var(--font-instrument-serif, 'Source Serif 4', Georgia, serif)", fontStyle: "italic", fontWeight: "400", color: "#faf7f2", marginBottom: "0.8em" },
  setup: { fontSize: "clamp(1.05rem, 1.8vw, 1.3rem)", fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)", fontStyle: "normal", fontWeight: "400", color: "rgba(250,247,242,0.5)", marginBottom: "0.3em" },
  action: { fontSize: "clamp(1.3rem, 2.2vw, 1.9rem)", fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)", fontStyle: "normal", fontWeight: "600", color: "#faf7f2", marginBottom: "0.3em" },
  resolution: { fontSize: "clamp(1.15rem, 2vw, 1.6rem)", fontFamily: "var(--font-instrument-serif, 'Source Serif 4', Georgia, serif)", fontStyle: "italic", fontWeight: "400", color: "#faf7f2", marginBottom: "0.3em" },
  pause: { fontSize: "clamp(1rem, 1.6vw, 1.2rem)", fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)", fontStyle: "normal", fontWeight: "400", color: "rgba(250,247,242,0.5)", marginBottom: "0.8em" },
  punchline: { fontSize: "clamp(1.3rem, 2.2vw, 1.9rem)", fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)", fontStyle: "normal", fontWeight: "600", color: "#D4A017", marginBottom: "0.15em" },
};

export function CinematicReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "#1B4332",
        backgroundImage: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(45,125,115,0.12) 0%, transparent 70%)",
        padding: "clamp(80px, 10vh, 140px) clamp(24px, 5vw, 80px)",
      }}
    >
      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "200px 200px" }} />

      <div className="relative z-[2] max-w-[720px] mx-auto">
        {/* Clock */}
        <div className="flex items-center gap-3 mb-10">
          <div className="text-[13px] font-semibold tracking-[0.15em]" style={{ fontFamily: "'Courier New', Consolas, monospace", color: "#D4A017", animation: "cinePulse 2.5s ease-in-out infinite" }}>23:04</div>
          <div className="text-[9px] font-medium tracking-[0.2em] uppercase" style={{ color: "rgba(212,160,23,0.5)" }}>INCIDENT DETECTED</div>
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#C4704A", animation: "cineDot 1.2s ease-in-out infinite" }} />
        </div>

        {/* Label */}
        <p className="text-[11px] font-medium tracking-[0.18em] uppercase mb-10 transition-all duration-700" style={{ color: "#D4A017", opacity: visible ? 0.8 : 0, transform: visible ? "translateY(0)" : "translateY(12px)" }}>
          A REAL SCENARIO. EVERY FACILITY. EVERY WEEK.
        </p>

        {/* Lines — staggered fade-in */}
        {LINES.map((line, i) => {
          const s = STYLE_MAP[line.style];
          const lastSetup = line.style === "setup" && LINES[i + 1]?.style !== "setup";
          return (
            <div
              key={i}
              className="transition-all duration-700 ease-out"
              style={{
                fontSize: s.fontSize,
                fontFamily: s.fontFamily,
                fontStyle: s.fontStyle,
                fontWeight: s.fontWeight,
                color: s.color,
                marginBottom: lastSetup ? "1.2em" : s.marginBottom,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${line.delay}ms`,
              }}
            >
              {line.text}
            </div>
          );
        })}

        {/* Separator */}
        <div className="transition-all duration-700" style={{ width: 60, height: 2, backgroundColor: "#D4A017", margin: "2.5rem 0 2rem 0", opacity: visible ? 1 : 0, transitionDelay: "3600ms" }} />

        {/* Footnote */}
        <div className="transition-all duration-700" style={{ opacity: visible ? 0.55 : 0, transitionDelay: "3800ms", fontSize: "0.8125rem", lineHeight: 1.7, color: "rgba(250,247,242,0.55)" }}>
          <p style={{ margin: "0 0 0.25em" }}>The Chronicler agent. Event-driven. Always watching.</p>
          <p style={{ margin: 0 }}>Civil penalties for late SIRS notifications. Zero missed deadlines at current pilots.</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes cinePulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.9; } }
        @keyframes cineDot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(0.7); } }
      `}</style>
    </section>
  );
}
