"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── Palette: warm, confident, not-tech-bro ─────────────────────────────────
const P = {
  canvas: "#faf7f2",
  canvasAlt: "#f3ede4",
  dark: "#1a1218",
  ink: "#2d2a2e",
  inkSoft: "rgba(45,42,46,0.72)",
  inkMuted: "rgba(45,42,46,0.45)",
  inkFaint: "rgba(45,42,46,0.08)",
  sage: "#5a7d6a",
  sageSoft: "rgba(90,125,106,0.12)",
  sageLight: "rgba(90,125,106,0.06)",
  coral: "#d4896c",
  coralSoft: "rgba(212,137,108,0.12)",
  copper: "#c89a3c",
  copperDark: "#8b6914",
  cream: "#f5ede3",
  white: "#ffffff",
};

// ─── Stage data ─────────────────────────────────────────────────────────────
const STAGES = [
  {
    id: "connect",
    num: "01",
    label: "Connect",
    title: "Your operation, in one view",
    body: "Chris connects to the systems you already run: clinical, rostering, finance, compliance, family. No migration. No re-platforming. No schema mapping. Your data stays where it is. Chris reads what's already there.",
    pills: ["Native Integrations", "Living Memory", "Zero Migration"],
    accent: P.sage,
  },
  {
    id: "watch",
    num: "02",
    label: "Watch",
    title: "Every domain, every shift",
    body: "Chris watches what's happening across the operation: workforce, clinical, compliance, finance, governance. Continuous, simultaneous, cross-domain. The signals that used to surface days late, surfaced before they land.",
    pills: ["Cross-Domain Watch", "Continuous Oversight", "Early Signals"],
    accent: P.sage,
  },
  {
    id: "support",
    num: "03",
    label: "Support",
    title: "Leadership in the flow of work",
    body: "A roster gap on Sunday is a clinical risk on Monday is a Commission notification on Friday. Chris makes that chain legible. It surfaces what matters to the people who can act on it, in the flow of their work, with the context they need to lead.",
    pills: ["Chain Detection", "Leader Support", "Flow-of-Work"],
    accent: P.coral,
  },
  {
    id: "act",
    num: "04",
    label: "Act",
    title: "Routine work, handled",
    body: "When something is routine and the path is clear, Chris handles it. Drafting the response. Logging the action. Closing the loop. Your leaders spend their judgment on the work that actually needs them.",
    pills: ["Routine Automation", "Closed Loop", "Leader-Led"],
    accent: P.coral,
  },
];

const INTEGRATIONS = [
  { name: "Leecare", sub: "Clinical & Care Planning", color: "#3b7dd8" },
  { name: "AutumnCare", sub: "Clinical", color: "#d4896c" },
  { name: "Person Centred Software", sub: "Clinical", color: "#5a7d6a" },
  { name: "eCase", sub: "Compliance", color: "#7c6bb5" },
  { name: "Carelink+", sub: "Resident Management", color: "#3b7dd8" },
  { name: "HumanForce", sub: "Workforce & Rostering", color: "#d4896c" },
  { name: "Manad Plus", sub: "Operations", color: "#5a7d6a" },
  { name: "Xero", sub: "Finance", color: "#13b5ea" },
];

// ─── SVG Illustrations ──────────────────────────────────────────────────────

function ConnectIllustration() {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Converging nodes into unified view */}
      <defs>
        <linearGradient id="gc1" x1="0" y1="0" x2="400" y2="300">
          <stop offset="0%" stopColor={P.sage} stopOpacity="0.08" />
          <stop offset="100%" stopColor={P.coral} stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="gc2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={P.sage} />
          <stop offset="100%" stopColor={P.sage} stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" rx="16" fill="url(#gc1)" />
      {/* Source system nodes */}
      {[
        { cx: 60, cy: 60, label: "Clinical" },
        { cx: 60, cy: 150, label: "Roster" },
        { cx: 60, cy: 240, label: "Finance" },
        { cx: 170, cy: 45, label: "Compliance" },
        { cx: 170, cy: 255, label: "Family" },
      ].map((n, i) => (
        <g key={i}>
          <line x1={n.cx + 30} y1={n.cy} x2={280} y2={150} stroke={P.sage} strokeWidth="1.5" strokeOpacity="0.2" strokeDasharray="4 4">
            <animate attributeName="stroke-dashoffset" from="8" to="0" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          </line>
          <circle cx={n.cx} cy={n.cy} r="22" fill={P.white} stroke={P.sage} strokeWidth="1.5" strokeOpacity="0.3" />
          <circle cx={n.cx} cy={n.cy} r="6" fill={P.sage} fillOpacity="0.25" />
          <circle cx={n.cx} cy={n.cy} r="3" fill={P.sage} fillOpacity="0.6" />
          <text x={n.cx} y={n.cy + 36} textAnchor="middle" fill={P.inkMuted} fontSize="9" fontFamily="system-ui">{n.label}</text>
        </g>
      ))}
      {/* Central unified node */}
      <circle cx="300" cy="150" r="48" fill={P.white} stroke={P.sage} strokeWidth="2" strokeOpacity="0.3" />
      <circle cx="300" cy="150" r="32" fill={P.sageSoft} />
      <circle cx="300" cy="150" r="16" fill={P.sage} fillOpacity="0.3" />
      <circle cx="300" cy="150" r="6" fill={P.sage}>
        <animate attributeName="r" values="5;7;5" dur="3s" repeatCount="indefinite" />
      </circle>
      <text x="300" y="215" textAnchor="middle" fill={P.ink} fontSize="11" fontWeight="500" fontFamily="system-ui">One view</text>
    </svg>
  );
}

function WatchIllustration() {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="gw1" x1="0" y1="0" x2="400" y2="300">
          <stop offset="0%" stopColor={P.sage} stopOpacity="0.06" />
          <stop offset="100%" stopColor={P.sage} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" rx="16" fill="url(#gw1)" />
      {/* Hexagonal grid */}
      {[
        [140, 75], [200, 75], [260, 75],
        [110, 130], [170, 130], [230, 130], [290, 130],
        [140, 185], [200, 185], [260, 185],
        [170, 240], [230, 240],
      ].map(([cx, cy], i) => {
        const isActive = [1, 4, 5, 8, 10].includes(i);
        return (
          <g key={i}>
            <polygon
              points={`${cx},${cy - 22} ${cx + 19},${cy - 11} ${cx + 19},${cy + 11} ${cx},${cy + 22} ${cx - 19},${cy + 11} ${cx - 19},${cy - 11}`}
              fill={isActive ? P.sageSoft : "rgba(45,42,46,0.02)"}
              stroke={isActive ? P.sage : "rgba(45,42,46,0.08)"}
              strokeWidth="1"
              strokeOpacity={isActive ? "0.4" : "1"}
            />
            {isActive && (
              <circle cx={cx} cy={cy} r="4" fill={P.sage} fillOpacity="0.5">
                <animate attributeName="fillOpacity" values="0.3;0.7;0.3" dur={`${2 + i * 0.2}s`} repeatCount="indefinite" />
              </circle>
            )}
          </g>
        );
      })}
      {/* Signal pulse lines between active hexes */}
      {[
        [200, 75, 170, 130], [200, 75, 230, 130], [170, 130, 200, 185], [230, 130, 200, 185], [200, 185, 230, 240],
      ].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={P.sage} strokeWidth="1" strokeOpacity="0.2">
          <animate attributeName="strokeOpacity" values="0.1;0.35;0.1" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
        </line>
      ))}
      {/* Domain labels */}
      {[
        [55, 90, "Workforce"], [55, 150, "Clinical"], [55, 210, "Finance"],
        [330, 90, "Compliance"], [330, 150, "Governance"], [330, 210, "Quality"],
      ].map(([x, y, label], i) => (
        <text key={i} x={x as number} y={y as number} textAnchor={i < 3 ? "end" : "start"} fill={P.inkMuted} fontSize="9" fontFamily="system-ui">{label as string}</text>
      ))}
    </svg>
  );
}

function SupportIllustration() {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="gs1" x1="0" y1="0" x2="400" y2="300">
          <stop offset="0%" stopColor={P.coral} stopOpacity="0.06" />
          <stop offset="100%" stopColor={P.sage} stopOpacity="0.03" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" rx="16" fill="url(#gs1)" />
      {/* Leader's console frame */}
      <rect x="60" y="45" width="280" height="210" rx="12" fill={P.white} stroke="rgba(45,42,46,0.08)" strokeWidth="1" />
      {/* Title bar */}
      <rect x="60" y="45" width="280" height="32" rx="12" fill="rgba(45,42,46,0.03)" />
      <rect x="60" y="65" width="280" height="12" fill="rgba(45,42,46,0.03)" />
      <circle cx="78" cy="61" r="4" fill={P.sage} fillOpacity="0.4" />
      <circle cx="90" cy="61" r="4" fill={P.coral} fillOpacity="0.4" />
      <circle cx="102" cy="61" r="4" fill="rgba(45,42,46,0.1)" />
      {/* Surfaced context cards */}
      {[
        { y: 90, w: 250, color: P.coral, label: "RN gap detected. Sunday PM.", opacity: "0.15" },
        { y: 130, w: 220, color: P.sage, label: "Care minutes: 188/215. Action needed.", opacity: "0.12" },
        { y: 170, w: 240, color: P.sage, label: "SIRS Cat 1 draft ready. Review.", opacity: "0.08" },
      ].map((card, i) => (
        <g key={i}>
          <rect x="80" y={card.y} width={card.w} height="30" rx="6" fill={card.color} fillOpacity={card.opacity} stroke={card.color} strokeWidth="1" strokeOpacity="0.15" />
          <circle cx="94" cy={card.y + 15} r="4" fill={card.color} fillOpacity="0.4">
            <animate attributeName="fillOpacity" values="0.25;0.5;0.25" dur={`${2.5 + i * 0.4}s`} repeatCount="indefinite" />
          </circle>
          <text x="106" y={card.y + 19} fill={P.inkSoft} fontSize="9" fontFamily="system-ui">{card.label}</text>
        </g>
      ))}
      {/* Chain connection line */}
      <path d="M 94 120 L 94 130 L 94 160 L 94 170" stroke={P.coral} strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.3">
        <animate attributeName="stroke-dashoffset" from="6" to="0" dur="2s" repeatCount="indefinite" />
      </path>
      {/* Leader indicator */}
      <rect x="80" y="215" width="100" height="24" rx="12" fill={P.coralSoft} />
      <text x="130" y="231" textAnchor="middle" fill={P.coral} fontSize="9" fontWeight="500" fontFamily="system-ui">DON, Monday 7am</text>
    </svg>
  );
}

function ActIllustration() {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="ga1" x1="0" y1="0" x2="400" y2="300">
          <stop offset="0%" stopColor={P.coral} stopOpacity="0.05" />
          <stop offset="100%" stopColor={P.sage} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" rx="16" fill="url(#ga1)" />
      {/* Closed loop circle */}
      <circle cx="200" cy="150" r="90" fill="none" stroke={P.sage} strokeWidth="2" strokeOpacity="0.1" />
      <circle cx="200" cy="150" r="90" fill="none" stroke={P.sage} strokeWidth="2.5" strokeOpacity="0.35" strokeDasharray="480 85">
        <animateTransform attributeName="transform" type="rotate" from="0 200 150" to="360 200 150" dur="12s" repeatCount="indefinite" />
      </circle>
      {/* Progress arc completing */}
      <circle cx="200" cy="150" r="70" fill="none" stroke={P.coral} strokeWidth="2" strokeOpacity="0.15" />
      <circle cx="200" cy="150" r="70" fill="none" stroke={P.coral} strokeWidth="2.5" strokeOpacity="0.4" strokeDasharray="380 60" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" from="360 200 150" to="0 200 150" dur="16s" repeatCount="indefinite" />
      </circle>
      {/* Stage markers around the loop */}
      {[
        { angle: -90, label: "Trigger", color: P.sage },
        { angle: 0, label: "Draft", color: P.sage },
        { angle: 90, label: "Log", color: P.coral },
        { angle: 180, label: "Close", color: P.coral },
      ].map((m, i) => {
        const rad = (m.angle * Math.PI) / 180;
        const cx = 200 + 90 * Math.cos(rad);
        const cy = 150 + 90 * Math.sin(rad);
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r="14" fill={P.white} stroke={m.color} strokeWidth="1.5" strokeOpacity="0.3" />
            <circle cx={cx} cy={cy} r="5" fill={m.color} fillOpacity="0.35" />
            <text x={cx} y={cy + 28} textAnchor="middle" fill={P.inkMuted} fontSize="9" fontFamily="system-ui">{m.label}</text>
          </g>
        );
      })}
      {/* Centre checkmark */}
      <circle cx="200" cy="150" r="28" fill={P.sageSoft} />
      <path d="M 188 150 L 196 158 L 214 140" stroke={P.sage} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

const ILLUSTRATIONS = [ConnectIllustration, WatchIllustration, SupportIllustration, ActIllustration];

// ─── Integration Logo ───────────────────────────────────────────────────────
function IntegrationLogo({ name, sub, color }: { name: string; sub: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-2 px-3 py-4 rounded-xl transition-all hover:scale-105"
      style={{ backgroundColor: P.white, boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)" }}>
      {/* Wordmark circle */}
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[15px] font-semibold"
        style={{ backgroundColor: `${color}10`, color }}>
        {name.charAt(0)}
      </div>
      <div className="text-center">
        <p className="text-[12px] font-medium leading-tight" style={{ color: P.ink }}>{name}</p>
        <p className="text-[10px] mt-0.5" style={{ color: P.inkMuted }}>{sub}</p>
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function HowItWorksPage() {
  const [active, setActive] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Auto-advance tabs every 6s unless user interacts
  const [userInteracted, setUserInteracted] = useState(false);
  useEffect(() => {
    if (userInteracted) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % 4);
    }, 6000);
    return () => clearInterval(interval);
  }, [userInteracted]);

  const stage = STAGES[active];
  const Illustration = ILLUSTRATIONS[active];

  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", backgroundColor: P.canvas }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50" style={{ backgroundColor: P.dark, borderBottom: "1px solid rgba(245,237,227,0.08)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 lg:px-16 py-4">
          <Link href="/v2" className="text-[15px] font-medium tracking-tight" style={{ color: P.cream }}>Chris<span style={{ color: P.copper }}>.</span></Link>
          <div className="flex items-center gap-4">
            <Link href="/v2" className="text-[13px] hidden md:block" style={{ color: "rgba(245,237,227,0.55)" }}>Home</Link>
            <a href="/v2#book" className="text-[13px] font-medium px-5 py-2 rounded" style={{ backgroundColor: P.copper, color: P.dark }}>Book a conversation</a>
          </div>
        </div>
      </nav>

      {/* ─── How it works ─────────────────────────────────────────────────── */}
      <section ref={sectionRef} style={{ backgroundColor: P.canvas }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-16 pt-20 lg:pt-28 pb-16">
          {/* Header: Eyebrow + Headline + Right intro */}
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 mb-16 lg:mb-20 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div>
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase mb-4" style={{ color: P.sage }}>How it works</p>
              <h1 className="text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.02em]" style={{ color: P.ink }}>
                Aged care, with intelligence in every layer
              </h1>
            </div>
            <div className="lg:pt-10">
              <p className="text-[17px] leading-[1.7]" style={{ color: P.inkSoft }}>
                Cross-domain intelligence working alongside your leaders. Reading every system you already run, catching what slips between domains, supporting the people running care, and handling the routine so they can lead.
              </p>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 mb-10 lg:mb-14 overflow-x-auto pb-1 -mx-1 px-1">
            {STAGES.map((s, i) => (
              <button key={s.id}
                onClick={() => { setActive(i); setUserInteracted(true); }}
                className="relative flex-1 min-w-[140px] text-left px-5 py-4 rounded-xl transition-all duration-300"
                style={{
                  backgroundColor: active === i ? P.white : "transparent",
                  boxShadow: active === i ? "0 2px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)" : "none",
                }}>
                <p className="text-[10px] font-semibold tracking-[0.12em] uppercase mb-1 transition-colors duration-300"
                  style={{ color: active === i ? s.accent : P.inkMuted }}>
                  {s.num}
                </p>
                <p className="text-[14px] font-medium transition-colors duration-300"
                  style={{ color: active === i ? P.ink : P.inkMuted }}>
                  {s.label}
                </p>
                {/* Active indicator */}
                {active === i && (
                  <div className="absolute bottom-0 left-5 right-5 h-[2px] rounded-full" style={{ backgroundColor: s.accent }} />
                )}
                {/* Auto-advance progress bar */}
                {active === i && !userInteracted && (
                  <div className="absolute bottom-0 left-5 right-5 h-[2px] rounded-full overflow-hidden" style={{ backgroundColor: "rgba(45,42,46,0.06)" }}>
                    <div className="h-full rounded-full" style={{ backgroundColor: s.accent, animation: "progressFill 6s linear" }} />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Stage content: illustration left, copy right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Illustration */}
            <div className="order-2 lg:order-1 rounded-2xl overflow-hidden transition-all duration-500"
              style={{ backgroundColor: P.canvasAlt, border: "1px solid rgba(45,42,46,0.04)" }}>
              <div className="p-4 lg:p-6">
                <Illustration />
              </div>
            </div>

            {/* Copy */}
            <div className="order-1 lg:order-2">
              <div className="mb-6">
                <p className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-3" style={{ color: stage.accent }}>
                  {stage.num} {stage.label}
                </p>
                <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-semibold leading-[1.15] tracking-[-0.01em] mb-5" style={{ color: P.ink }}>
                  {stage.title}
                </h2>
                <p className="text-[16px] leading-[1.75]" style={{ color: P.inkSoft }}>
                  {stage.body}
                </p>
              </div>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2">
                {stage.pills.map((pill) => (
                  <span key={pill} className="px-4 py-2 rounded-full text-[12px] font-medium"
                    style={{
                      backgroundColor: stage.accent === P.coral ? P.coralSoft : P.sageSoft,
                      color: stage.accent === P.coral ? P.coral : P.sage,
                    }}>
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Integrations block ───────────────────────────────────────────── */}
      <section style={{ backgroundColor: P.canvasAlt, borderTop: `1px solid ${P.inkFaint}` }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16 lg:py-20">
          <div className="text-center mb-10">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: P.sage }}>Integrations</p>
            <h2 className="text-[clamp(1.3rem,3vw,2rem)] font-semibold leading-[1.15] tracking-[-0.01em] mb-3" style={{ color: P.ink }}>
              Reads what you already run
            </h2>
            <p className="text-[15px]" style={{ color: P.inkMuted }}>
              No migration. No re-platforming.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {INTEGRATIONS.map((int) => (
              <IntegrationLogo key={int.name} {...int} />
            ))}
          </div>

          <p className="text-center text-[12px] mt-8" style={{ color: P.inkMuted }}>
            Plus Deputy, Employment Hero, Chris21, ELMO, RiskMan, GPMS, and any system with an API or structured export.
          </p>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: P.dark }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-16 py-16 lg:py-20 text-center">
          <h2 className="text-[clamp(1.3rem,3vw,2rem)] font-semibold leading-[1.15] tracking-[-0.01em] mb-4" style={{ color: P.cream }}>
            See how Chris reads your operation
          </h2>
          <p className="text-[15px] leading-[1.7] mb-8 max-w-lg mx-auto" style={{ color: "rgba(245,237,227,0.55)" }}>
            30 minutes. We walk through your systems, your pain points, and what Chris would surface in week one. No demo deck. Just your data and ours.
          </p>
          <a href="/v2#book" className="inline-block px-8 py-3.5 rounded-lg text-[14px] font-medium transition-colors hover:opacity-90" style={{ backgroundColor: P.copper, color: P.dark }}>
            Book a conversation
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: P.dark, borderTop: "1px solid rgba(245,237,227,0.06)" }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-16 py-8 flex items-center justify-between">
          <Link href="/v2" className="text-[13px]" style={{ color: "rgba(245,237,227,0.35)" }}>Chris<span style={{ color: "rgba(200,154,60,0.5)" }}>.</span></Link>
          <p className="text-[11px]" style={{ color: "rgba(245,237,227,0.2)" }}>&copy; 2026 Culture Crunch Pty Ltd</p>
        </div>
      </footer>

      {/* Keyframe for auto-advance progress bar */}
      <style jsx global>{`
        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
