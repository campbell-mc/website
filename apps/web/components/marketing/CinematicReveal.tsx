"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const COPY_LINES: Array<{
  words: string[];
  style: "timestamp" | "setup" | "action" | "resolution" | "pause" | "punchline";
  breakAfter?: boolean;
}> = [
  { words: ["11:04pm", "Friday."], style: "timestamp", breakAfter: true },
  { words: ["A", "Priority", "1", "incident."], style: "setup" },
  { words: ["24", "hours", "to", "notify", "ACQSC."], style: "setup", breakAfter: true },
  { words: ["CHRIS", "classified", "it", "in", "4", "minutes."], style: "action" },
  { words: ["The", "draft", "was", "waiting", "in", "the", "DON\u2019s", "inbox", "by", "11:09."], style: "resolution" },
  { words: ["She", "approved", "it", "before", "midnight."], style: "resolution", breakAfter: true },
  { words: ["That\u2019s", "not", "a", "feature."], style: "pause" },
  { words: ["That\u2019s", "the", "difference", "between", "a", "penalty"], style: "punchline" },
  { words: ["and", "a", "clean", "record."], style: "punchline", breakAfter: true },
];

const STYLES: Record<string, {
  fontSize: string; fontFamily: string; fontStyle: string; fontWeight: string;
  litColor: string; unlitColor: string; lineHeight: string;
}> = {
  timestamp: { fontSize: "clamp(2.8rem, 5.5vw, 5.2rem)", fontFamily: "'Source Serif 4', Georgia, serif", fontStyle: "italic", fontWeight: "400", litColor: "#faf7f2", unlitColor: "rgba(250,247,242,0.08)", lineHeight: "1.1" },
  setup: { fontSize: "clamp(1.1rem, 2vw, 1.4rem)", fontFamily: "'DM Sans', sans-serif", fontStyle: "normal", fontWeight: "400", litColor: "rgba(250,247,242,0.45)", unlitColor: "rgba(250,247,242,0.06)", lineHeight: "1.5" },
  action: { fontSize: "clamp(1.4rem, 2.5vw, 2.1rem)", fontFamily: "'DM Sans', sans-serif", fontStyle: "normal", fontWeight: "600", litColor: "#faf7f2", unlitColor: "rgba(250,247,242,0.08)", lineHeight: "1.3" },
  resolution: { fontSize: "clamp(1.2rem, 2.2vw, 1.75rem)", fontFamily: "'Source Serif 4', Georgia, serif", fontStyle: "italic", fontWeight: "400", litColor: "#faf7f2", unlitColor: "rgba(250,247,242,0.08)", lineHeight: "1.4" },
  pause: { fontSize: "clamp(1rem, 1.8vw, 1.3rem)", fontFamily: "'DM Sans', sans-serif", fontStyle: "normal", fontWeight: "400", litColor: "rgba(250,247,242,0.5)", unlitColor: "rgba(250,247,242,0.06)", lineHeight: "1.5" },
  punchline: { fontSize: "clamp(1.4rem, 2.5vw, 2.1rem)", fontFamily: "'DM Sans', sans-serif", fontStyle: "normal", fontWeight: "600", litColor: "#D4A017", unlitColor: "rgba(212,160,23,0.08)", lineHeight: "1.3" },
};

// Flatten all words
const ALL_WORDS = COPY_LINES.flatMap((line, li) =>
  line.words.map((word, wi) => ({ word, lineIdx: li, wordIdx: wi, style: line.style }))
);
const TOTAL = ALL_WORDS.length;

export function CinematicReveal() {
  const outerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [flashed, setFlashed] = useState(false);
  const rafRef = useRef<number>(0);

  const handleScroll = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const outer = outerRef.current;
      if (!outer) return;
      const rect = outer.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, -rect.top / (rect.height - vh)));
      setProgress(p);
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => { window.removeEventListener("scroll", handleScroll); cancelAnimationFrame(rafRef.current); };
  }, [handleScroll]);

  // Amber flash on timestamp reveal
  useEffect(() => {
    if (!flashed && progress * TOTAL >= 1) setFlashed(true);
  }, [progress, flashed]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const zone = isMobile ? 2 : 4;
  const front = progress * TOTAL;

  // Track line start indices
  let runningIdx = 0;
  const lineStarts: number[] = COPY_LINES.map((line) => {
    const start = runningIdx;
    runningIdx += line.words.length;
    return start;
  });

  return (
    <div ref={outerRef} className="relative" style={{ height: "300vh" }}>
      <section
        className="sticky top-0 min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ background: "#1B4332", backgroundImage: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(45,125,115,0.12) 0%, transparent 70%)" }}
      >
        {/* Grain overlay */}
        <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "200px 200px" }} />

        <div className="relative z-[2] max-w-[720px] w-full px-6 lg:px-0 mx-auto">
          {/* Ambient clock */}
          <div className="absolute top-0 right-0 flex flex-col items-end gap-1 md:relative md:absolute md:top-0 md:right-0" style={{ position: isMobile ? "static" : "absolute" }}>
            <div className="text-[13px] font-semibold tracking-[0.15em] animate-pulse" style={{ fontFamily: "'Courier New', Consolas, monospace", color: "#D4A017", opacity: 0.7 }}>23:04</div>
            <div className="text-[9px] font-medium tracking-[0.25em] uppercase" style={{ color: "rgba(212,160,23,0.45)" }}>INCIDENT DETECTED</div>
            <div className="w-1.5 h-1.5 rounded-full ml-auto" style={{ backgroundColor: "#C4704A", animation: "dotBlink 1.2s ease-in-out infinite" }} />
          </div>

          {/* Label */}
          <p className="text-[11px] font-medium tracking-[0.18em] uppercase mb-12 transition-opacity duration-500" style={{ color: "#D4A017", opacity: progress > 0.02 ? 0.8 : 0, marginTop: isMobile ? "28px" : "0" }}>
            A REAL SCENARIO. EVERY FACILITY. EVERY WEEK.
          </p>

          {/* Word-by-word reveal */}
          <div>
            {COPY_LINES.map((line, li) => {
              const cfg = STYLES[line.style];
              const startIdx = lineStarts[li];

              return (
                <div key={li} style={{ marginBottom: line.breakAfter ? "clamp(1.5rem, 3vw, 2.5rem)" : "0.15em", display: "block" }}>
                  {line.words.map((word, wi) => {
                    const gi = startIdx + wi;
                    const dist = front - gi;
                    const lit = dist >= 0;
                    const frac = Math.max(0, Math.min(1, dist / zone));

                    // Timestamp flash
                    const isTimestampFlashing = line.style === "timestamp" && flashed && lit && frac < 0.8;
                    const color = isTimestampFlashing ? "#D4A017" : (lit ? cfg.litColor : cfg.unlitColor);

                    return (
                      <span key={wi} style={{
                        display: "inline",
                        fontFamily: cfg.fontFamily,
                        fontSize: cfg.fontSize,
                        fontStyle: cfg.fontStyle,
                        fontWeight: cfg.fontWeight,
                        lineHeight: cfg.lineHeight,
                        color,
                        opacity: lit ? frac : 1,
                        transition: "color 400ms ease, opacity 400ms ease",
                        marginRight: wi < line.words.length - 1 ? "0.28em" : "0",
                        willChange: "color, opacity",
                      }}>
                        {word}
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Separator */}
          <div className="transition-opacity duration-600" style={{ width: 60, height: 2, backgroundColor: "#D4A017", margin: "clamp(2rem, 4vw, 3.5rem) 0 clamp(1.5rem, 3vw, 2.5rem) 0", opacity: progress > 0.75 ? 1 : 0 }} />

          {/* Footnote */}
          <div className="transition-opacity duration-600" style={{ opacity: progress > 0.8 ? 0.55 : 0, transitionDelay: "200ms", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8125rem", lineHeight: 1.7, color: "rgba(250,247,242,0.55)" }}>
            <p style={{ margin: "0 0 0.25em" }}>The Chronicler agent. Event-driven. Always watching.</p>
            <p style={{ margin: 0 }}>Civil penalties for late SIRS notifications. Zero missed deadlines at current pilots.</p>
          </div>
        </div>

        <style jsx>{`
          @keyframes dotBlink {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.3; transform: scale(0.7); }
          }
        `}</style>
      </section>
    </div>
  );
}
