"use client";

// ── Team Briefing Calculator v2 ─────────────────────────────────────────────
// Structural decisions:
// 1. Single-screen layout: all inputs in scrollable left column, briefing output
//    on the right. No tabs. Submit button triggers LLM generation.
// 2. Financial & Funding block added as fourth input block.
// 3. LLM generation via /api/team-briefing/generate (Claude streaming).
// 4. PDF: print-styled page via window.print() for v1. Server-side Puppeteer
//    pipeline deferred to v2 when volume justifies it.
// 5. Fallback: if LLM call fails, shows the templated briefing from the
//    existing generate() function as a fallback with a "fallback mode" indicator.

import { useState, useMemo, useRef } from "react";
import Link from "next/link";

const C = {
  canvas: "#FAFAF6", card: "#FFFFFF", text: "#0E0E0E", textMuted: "#5A5A57",
  textFaint: "#8A8A85", teal: "#1F6F66", amber: "#BA7517", red: "#A32D2D",
  border: "rgba(15,23,42,0.10)", borderSubtle: "rgba(15,23,42,0.07)",
  ctaBg: "#0E0E0E", ctaText: "#FAFAF6",
  forest: "#1B4332", gold: "#D4A853",
};

const inter = "'Inter', system-ui, -apple-system, sans-serif";
const fraunces = "'Fraunces', Georgia, serif";
const sourceSerif = "'Source Serif 4', Georgia, serif";

type ServiceType = "residential" | "home_care" | "ndis" | "mixed";

const SERVICES: { id: ServiceType; label: string; sub: string }[] = [
  { id: "residential", label: "Residential aged care", sub: "AN-ACC, care minutes, 24/7 RN" },
  { id: "home_care", label: "Home care (HCP / CHSP)", sub: "Mobile workforce, utilisation" },
  { id: "ndis", label: "NDIS-funded supports", sub: "Worker screening, behaviour support" },
  { id: "mixed", label: "Mixed (residential + community)", sub: "Both data sets" },
];

interface F { key: string; label: string; unit: string; min: number; max: number; step: number; def: number; domain: string; sub?: string; }

const OPS_RESI: F[] = [
  { key: "totalFte", label: "Total FTE", unit: "FTE", min: 10, max: 500, step: 5, def: 120, domain: "Workforce" },
  { key: "rnFte", label: "RN FTE", unit: "FTE", min: 0, max: 60, step: 1, def: 18, domain: "Workforce" },
  { key: "enFte", label: "EN FTE", unit: "FTE", min: 0, max: 40, step: 1, def: 12, domain: "Workforce" },
  { key: "pcwFte", label: "PCW / AIN FTE", unit: "FTE", min: 0, max: 200, step: 1, def: 72, domain: "Workforce" },
  { key: "bedOccupancy", label: "Bed occupancy", unit: "%", min: 50, max: 100, step: 1, def: 92, domain: "Workforce" },
  { key: "careMinTotal", label: "Care minutes (total)", unit: "min/res/day", min: 140, max: 280, step: 2, def: 198, domain: "Clinical" },
  { key: "careMinRn", label: "Care minutes (RN)", unit: "min/res/day", min: 10, max: 70, step: 1, def: 32, domain: "Clinical" },
  { key: "rnCoverage", label: "24/7 RN coverage", unit: "0=No 1=Yes", min: 0, max: 1, step: 1, def: 1, domain: "Clinical", sub: "0 = No/Mixed, 1 = Yes" },
  { key: "agencyPct", label: "Agency / casual FTE", unit: "%", min: 0, max: 50, step: 1, def: 18, domain: "Workforce" },
  { key: "turnover", label: "Staff turnover rate", unit: "% ann.", min: 0, max: 60, step: 1, def: 28, domain: "Attrition" },
  { key: "newStaff", label: "New staff < 6 months", unit: "head", min: 0, max: 80, step: 1, def: 22, domain: "Workforce" },
  { key: "missed", label: "Missed / unfilled shifts", unit: "/month", min: 0, max: 60, step: 1, def: 14, domain: "Rostering" },
  { key: "overtime", label: "Overtime hours (clinical)", unit: "hrs/mo", min: 0, max: 500, step: 10, def: 180, domain: "Rostering" },
  { key: "sickLeave", label: "Sick leave (clinical)", unit: "hrs/FTE/yr", min: 0, max: 120, step: 2, def: 62, domain: "Leave" },
  { key: "wcHours", label: "Workers comp hours", unit: "hrs/yr", min: 0, max: 500, step: 10, def: 120, domain: "Leave" },
  { key: "aggression", label: "Aggression incidents", unit: "/month", min: 0, max: 30, step: 1, def: 6, domain: "WHS" },
  { key: "manualHandling", label: "Manual handling compliance", unit: "%", min: 0, max: 100, step: 1, def: 78, domain: "Training" },
  { key: "medIncidents", label: "Medication incidents", unit: "/month", min: 0, max: 30, step: 1, def: 4, domain: "Clinical Quality" },
  { key: "falls", label: "Falls with injury", unit: "/1k res days", min: 0, max: 20, step: 0.5, def: 6.2, domain: "Clinical Quality" },
];

const FINANCIAL: F[] = [
  { key: "anaccHigh", label: "AN-ACC high care (CFR 9-13)", unit: "%", min: 0, max: 100, step: 5, def: 45, domain: "AN-ACC Mix" },
  { key: "anaccMod", label: "AN-ACC moderate (CFR 5-8)", unit: "%", min: 0, max: 100, step: 5, def: 40, domain: "AN-ACC Mix" },
  { key: "anaccLight", label: "AN-ACC light (CFR 1-4)", unit: "%", min: 0, max: 100, step: 5, def: 15, domain: "AN-ACC Mix" },
  { key: "gatingCompliance", label: "Care minutes gating compliance", unit: "%", min: 50, max: 105, step: 1, def: 93, domain: "Supplement" },
  { key: "agencyHoursPct", label: "Agency hours as % of total", unit: "%", min: 0, max: 40, step: 1, def: 18, domain: "Cost" },
  { key: "overtimeWeekly", label: "Overtime hours per week", unit: "hrs", min: 0, max: 200, step: 5, def: 85, domain: "Cost" },
  { key: "wcQuarter", label: "Workers comp hours (quarter)", unit: "hrs", min: 0, max: 800, step: 10, def: 240, domain: "Cost" },
  { key: "marginPerBed", label: "Direct care margin per bed/day", unit: "$", min: -25, max: 25, step: 0.5, def: 2.4, domain: "Margin", sub: "StewartBrown sector benchmark: -$9.80 in 1H FY26" },
];

const PULSE = [
  { key: "psychSafety", label: "Psychological safety", def: 58 },
  { key: "trust", label: "Trust in leadership", def: 52 },
  { key: "workload", label: "Workload sustainability", def: 45 },
  { key: "recognition", label: "Recognition", def: 48 },
  { key: "managerSupport", label: "Manager support", def: 55 },
  { key: "roleClarity", label: "Role clarity", def: 62 },
  { key: "voice", label: "Voice / suggestion willingness", def: 44 },
  { key: "fatigue", label: "Fatigue", def: 68 },
  { key: "roleConflict", label: "Role conflict", def: 42 },
  { key: "changePace", label: "Change pace tolerance", def: 38 },
  { key: "peerSupport", label: "Peer support", def: 65 },
  { key: "safetyCulture", label: "Safety culture", def: 56 },
];

function Slider({ label, value, min, max, step, display, onChange, sub }: {
  label: string; value: number; min: number; max: number; step: number;
  display: string; onChange: (v: number) => void; sub?: string;
}) {
  return (
    <div className="mb-3">
      <div className="flex justify-between items-baseline mb-0.5">
        <div><span className="text-[12px] font-medium" style={{ color: C.text }}>{label}</span>
          {sub && <p className="text-[9px]" style={{ color: C.textFaint }}>{sub}</p>}
        </div>
        <span className="text-[13px] font-medium tabular-nums" style={{ color: C.text }}>{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full cursor-pointer h-1.5" style={{ accentColor: C.teal }} />
    </div>
  );
}

function InputBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[5px] p-4 lg:p-5" style={{ backgroundColor: C.card, border: `0.5px solid ${C.border}` }}>
      <p className="text-[10px] font-medium uppercase tracking-[0.08em] mb-3 pb-2" style={{ color: C.teal, borderBottom: `0.5px solid ${C.borderSubtle}` }}>{title}</p>
      {children}
    </div>
  );
}

function SeverityDot({ severity }: { severity: string }) {
  const colors: Record<string, string> = { critical: C.red, elevated: C.amber, watch: C.amber, strength: C.teal };
  return <span className="w-2 h-2 rounded-full shrink-0 mt-1" style={{ backgroundColor: colors[severity] ?? C.textFaint }} />;
}

interface BriefingData {
  chrisInsight: string;
  story: string;
  signals: { domain: string; severity: string; signal: string; context: string }[];
  practices: { name: string; description: string; rationale: string }[];
  financialSignals: { domain: string; headline: string; body: string; value: string }[];
}

export default function TeamBriefingTool() {
  const [svc, setSvc] = useState<ServiceType>("residential");
  const [teamName, setTeamName] = useState("Grevillea Wing");
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState("NFP");
  const [region, setRegion] = useState("Metropolitan");
  const [ops, setOps] = useState<Record<string, number>>({});
  const [fin, setFin] = useState<Record<string, number>>({});
  const [pulse, setPulse] = useState<Record<string, number>>(() => {
    const d: Record<string, number> = {};
    PULSE.forEach((f) => { d[f.key] = f.def; });
    return d;
  });
  const [generating, setGenerating] = useState(false);
  const [briefing, setBriefing] = useState<BriefingData | null>(null);
  const [fallback, setFallback] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [emailName, setEmailName] = useState("");
  const [emailRole, setEmailRole] = useState("");
  const [emailOrg, setEmailOrg] = useState("");
  const briefingRef = useRef<HTMLDivElement>(null);

  const fields = OPS_RESI; // TODO: switch based on svc
  const effOps = useMemo(() => {
    const d: Record<string, number> = {};
    fields.forEach((f) => { d[f.key] = ops[f.key] ?? f.def; });
    return d;
  }, [fields, ops]);
  const effFin = useMemo(() => {
    const d: Record<string, number> = {};
    FINANCIAL.forEach((f) => { d[f.key] = fin[f.key] ?? f.def; });
    return d;
  }, [fin]);

  const nextBriefing = new Date();
  nextBriefing.setDate(nextBriefing.getDate() + 14);

  async function handleGenerate() {
    setGenerating(true);
    setFallback(false);
    setBriefing(null);

    try {
      const res = await fetch("/api/team-briefing/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          setup: { serviceType: svc, teamName, orgName, orgType, region },
          ops: effOps,
          financial: effFin,
          pulse,
        }),
      });

      if (!res.ok) throw new Error("Generation failed");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullText += decoder.decode(value, { stream: true });
        }
      }

      // Parse JSON response
      const parsed = JSON.parse(fullText) as BriefingData;
      setBriefing(parsed);

      // Scroll to briefing on mobile
      setTimeout(() => {
        briefingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    } catch {
      // Fallback to templated briefing
      setFallback(true);
      setBriefing({
        chrisInsight: "Multiple signals converging across workforce and pulse data. Cross-reference the operational indicators with the pulse scores below.",
        story: `This team is running at ${effOps.turnover ?? 28}% annualised turnover with agency dependency at ${effOps.agencyPct ?? 18}% of total FTE. The pulse data suggests workload sustainability is under pressure at ${pulse.workload}%, and voice willingness sits at ${pulse.voice}%. When these signals converge, the risk compounds.\n\nThe data suggests this is not about morale alone. The team is carrying unresolved operational strain alongside genuine pulse signals.`,
        signals: [
          { domain: "Attrition", severity: effOps.turnover > 35 ? "critical" : "elevated", signal: `Turnover at ${effOps.turnover}%`, context: "Sector average is 28%. Each avoided replacement saves roughly $50K." },
          { domain: "Workforce", severity: (effOps.agencyPct ?? 18) > 18 ? "elevated" : "watch", signal: `Agency at ${effOps.agencyPct ?? 18}% of FTE`, context: "Sector average is 12%. Above 18% erodes continuity and inflates cost." },
          { domain: "Pulse", severity: pulse.workload < 45 ? "critical" : "elevated", signal: `Workload sustainability at ${pulse.workload}%`, context: "Below 45% is a leading indicator of attrition within 6 months." },
          { domain: "Pulse", severity: pulse.voice < 45 ? "elevated" : "watch", signal: `Voice willingness at ${pulse.voice}%`, context: "Staff are not raising issues. Expect delayed signal detection." },
          { domain: "Pulse", severity: pulse.fatigue > 65 ? "elevated" : "watch", signal: `Fatigue at ${pulse.fatigue}%`, context: "Above 65% correlates with increased sick leave and injury within 90 days." },
        ],
        practices: [
          { name: "Open the next huddle with a specific check-in question", description: "Ask one direct question about what is making the shift harder this week. Not 'how are you' but 'what is the one thing that would make tomorrow easier'. Listen. Write it down.", rationale: "Voice willingness is low. This practice rebuilds the habit of speaking up in small, safe increments." },
          { name: "Run a 15-minute supervision with each new starter this week", description: "Sit with each new team member for 15 minutes. Ask what they expected versus what they found. Name one thing that is working and one thing that needs attention.", rationale: `${effOps.newStaff ?? 22} new starters in the last 6 months. The onboarding window is when turnover risk is highest.` },
          { name: "Name the workload pressure in your next team message", description: "Send a short message to the team acknowledging the workload. Be specific: name the shift, the coverage gap, or the roster pressure. Do not promise a fix. Just name it.", rationale: "Workload sustainability is at ${pulse.workload}%. Naming the pressure is the first step to addressing it." },
        ],
        financialSignals: [],
      });
    } finally {
      setGenerating(false);
    }
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    try { await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, name: emailName, role: emailRole, organisation: emailOrg, workflow_interest: "team_briefing_v2", calculator_data: { serviceType: svc, teamName, orgName } }) }); } catch {}
    setEmailSent(true);
  }

  return (
    <div style={{ fontFamily: inter }}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:opsz,wght@9..144,400&family=Source+Serif+4:ital,wght@0,400;1,400&display=swap" />

      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-sm" style={{ backgroundColor: "rgba(250,250,246,0.92)", borderBottom: `0.5px solid ${C.borderSubtle}` }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-12 py-3">
          <Link href="/v2" className="text-[15px] font-medium tracking-tight" style={{ color: C.text }}>Chris<span style={{ color: C.teal }}>·</span>OS</Link>
          <a href="/v2#book" className="text-[14px] font-medium px-[20px] py-[12px] rounded-[4px]" style={{ backgroundColor: C.ctaBg, color: C.ctaText }}>Book a conversation</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ backgroundColor: C.canvas }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 lg:pt-14 pb-8">
          <p className="text-[17px] mb-2" style={{ fontFamily: fraunces, fontStyle: "italic", letterSpacing: "-0.01em", color: C.teal }}>Team Briefing Calculator</p>
          <h1 className="text-[clamp(1.5rem,3vw,24px)] font-medium leading-[1.1] tracking-[-0.025em] mb-2 max-w-[500px]" style={{ color: C.text }}>
            Enter your data. See what your team leaders would receive.
          </h1>
          <p className="text-[14px] leading-[1.6] max-w-[480px]" style={{ color: C.textMuted }}>
            All inputs default to representative values. Adjust any slider, then hit Generate. Chris builds the briefing from your numbers.
          </p>
        </div>
      </section>

      {/* Calculator body */}
      <section style={{ backgroundColor: C.canvas }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-14 lg:pb-20">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left: all inputs */}
            <div className="w-full lg:w-[360px] shrink-0 space-y-4">
              {/* Setup */}
              <InputBlock title="Setup">
                <div className="space-y-2 mb-3">
                  {SERVICES.map((o) => (
                    <button key={o.id} onClick={() => setSvc(o.id)} className="w-full text-left px-3 py-2 rounded-[4px] text-[12px] transition-all"
                      style={{ border: `0.5px solid ${svc === o.id ? C.teal : C.border}`, backgroundColor: svc === o.id ? `${C.teal}08` : "transparent", color: C.text }}>
                      <span className="font-medium">{o.label}</span> <span style={{ color: C.textFaint }}>{o.sub}</span>
                    </button>
                  ))}
                </div>
                <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Team / wing name" className="w-full px-3 py-2 rounded-[4px] text-[12px] mb-2 focus:outline-none" style={{ border: `0.5px solid ${C.border}`, color: C.text }} />
                <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Organisation (optional)" className="w-full px-3 py-2 rounded-[4px] text-[12px] mb-2 focus:outline-none" style={{ border: `0.5px solid ${C.border}`, color: C.text }} />
                <div className="grid grid-cols-2 gap-2">
                  <select value={orgType} onChange={(e) => setOrgType(e.target.value)} className="px-3 py-2 rounded-[4px] text-[12px]" style={{ border: `0.5px solid ${C.border}`, color: C.text }}>
                    {["NFP", "For-profit", "Government", "Charity"].map((o) => <option key={o}>{o}</option>)}
                  </select>
                  <select value={region} onChange={(e) => setRegion(e.target.value)} className="px-3 py-2 rounded-[4px] text-[12px]" style={{ border: `0.5px solid ${C.border}`, color: C.text }}>
                    {["Metropolitan", "Regional", "Rural/Remote"].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </InputBlock>

              {/* Operations */}
              <InputBlock title="Operations">
                {fields.map((f) => (
                  <Slider key={f.key} label={f.label} value={effOps[f.key]} min={f.min} max={f.max} step={f.step} sub={f.sub}
                    display={`${effOps[f.key]}${f.unit.startsWith("%") || f.unit.startsWith("0") ? "" : ` ${f.unit}`}`}
                    onChange={(v) => setOps({ ...ops, [f.key]: v })} />
                ))}
              </InputBlock>

              {/* Financial */}
              <InputBlock title="Financial and funding">
                {FINANCIAL.map((f) => (
                  <Slider key={f.key} label={f.label} value={effFin[f.key]} min={f.min} max={f.max} step={f.step} sub={f.sub}
                    display={f.unit === "$" ? `$${effFin[f.key]}` : `${effFin[f.key]}${f.unit.startsWith("%") ? "%" : ` ${f.unit}`}`}
                    onChange={(v) => setFin({ ...fin, [f.key]: v })} />
                ))}
                <p className="text-[9px] mt-2" style={{ color: C.textFaint }}>Sources: StewartBrown ACFPS, Mirus Australia, AN-ACC pricing $295.64/NWAU (1 Oct 2025).</p>
              </InputBlock>

              {/* Pulse */}
              <InputBlock title="Pulse survey data">
                <p className="text-[9px] mb-3" style={{ color: C.textFaint }}>Representative aged care cohort defaults. Adjust to match your team.</p>
                {PULSE.map((f) => (
                  <Slider key={f.key} label={f.label} value={pulse[f.key]} min={0} max={100} step={1}
                    display={`${pulse[f.key]}%`} onChange={(v) => setPulse({ ...pulse, [f.key]: v })} />
                ))}
              </InputBlock>

              {/* Submit */}
              <button onClick={handleGenerate} disabled={generating}
                className="w-full py-3.5 rounded-[4px] text-[14px] font-medium disabled:opacity-50 sticky bottom-4"
                style={{ backgroundColor: C.ctaBg, color: C.ctaText }}>
                {generating ? "Chris is generating..." : briefing ? "Regenerate Team Briefing →" : "Generate Team Briefing →"}
              </button>
            </div>

            {/* Right: briefing output */}
            <div ref={briefingRef} className="flex-1 min-w-0">
              {!briefing && !generating && (
                <div className="rounded-[5px] p-6 lg:p-8" style={{ backgroundColor: C.card, border: `0.5px solid ${C.border}` }}>
                  <p className="text-[15px] font-medium mb-4" style={{ color: C.text }}>Your briefing will appear here</p>
                  <div className="space-y-3">
                    {["Chris Insight", "The Story Behind the Data", "What is Showing Up", "Three Micro-Practices", "Financial Signals", "Suggested Next Briefing"].map((s) => (
                      <div key={s} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.borderSubtle }} />
                        <span className="text-[13px]" style={{ color: C.textFaint }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {generating && (
                <div className="rounded-[5px] p-6 lg:p-8 flex items-center gap-3" style={{ backgroundColor: C.card, border: `0.5px solid ${C.border}` }}>
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: C.teal }} />
                  <p className="text-[14px]" style={{ color: C.textMuted }}>Chris is reading your inputs and building the briefing...</p>
                </div>
              )}

              {briefing && (
                <div className="space-y-4">
                  {/* Honest framing */}
                  <p className="text-[11px]" style={{ color: C.textFaint }}>Pulse, attrition, and WHS signals run live with our cohort today. Operational and financial signals model the platform shipping across 2026.</p>

                  {fallback && <p className="text-[11px] font-medium" style={{ color: C.amber }}>Fallback mode: generated from templates. LLM generation was unavailable.</p>}

                  {/* Header */}
                  <div className="rounded-[5px] overflow-hidden" style={{ border: `0.5px solid ${C.border}`, boxShadow: `0 0 0 4px ${C.teal}14` }}>
                    <div className="px-5 py-4" style={{ backgroundColor: C.forest }}>
                      <p className="text-[9px] font-medium uppercase tracking-[0.08em] mb-0.5" style={{ color: "rgba(255,255,255,0.85)" }}>Team Briefing · {teamName}</p>
                      <p className="text-[14px] font-medium" style={{ color: "#fff" }}>{orgName || "Your organisation"} · Cycle 8 · {new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" })}</p>
                    </div>

                    {/* Chris Insight */}
                    <div className="px-5 py-4" style={{ borderBottom: `0.5px solid ${C.border}` }}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${C.forest} 0%, ${C.gold} 100%)` }}>
                          <span className="text-white text-[9px] font-medium">C</span>
                        </div>
                        <span className="text-[9px] font-medium uppercase tracking-[0.08em]" style={{ color: C.textMuted }}>Chris Insight</span>
                      </div>
                      <p className="text-[14px] leading-[1.45] italic" style={{ fontFamily: sourceSerif, color: C.text }}>{briefing.chrisInsight}</p>
                    </div>

                    {/* Story */}
                    <div className="px-5 py-4" style={{ borderBottom: `0.5px solid ${C.border}` }}>
                      <p className="text-[9px] font-medium uppercase tracking-[0.08em] mb-3" style={{ color: C.textMuted }}>The story behind the data</p>
                      {briefing.story.split("\n").filter(Boolean).map((para, i) => (
                        <p key={i} className="text-[14px] leading-[1.6] mb-3" style={{ fontFamily: sourceSerif, color: C.textMuted }}>{para}</p>
                      ))}
                    </div>

                    {/* Signals */}
                    <div className="px-5 py-4" style={{ borderBottom: `0.5px solid ${C.border}` }}>
                      <p className="text-[9px] font-medium uppercase tracking-[0.08em] mb-3" style={{ color: C.textMuted }}>What is showing up</p>
                      <div className="space-y-3">
                        {briefing.signals.map((sig, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <SeverityDot severity={sig.severity} />
                            <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[9px] font-medium uppercase tracking-[0.06em]" style={{ color: C.textFaint }}>{sig.domain}</span>
                                <span className="text-[8px] font-medium px-1.5 py-0.5 rounded" style={{
                                  backgroundColor: sig.severity === "critical" ? `${C.red}10` : sig.severity === "strength" ? `${C.teal}10` : `${C.amber}10`,
                                  color: sig.severity === "critical" ? C.red : sig.severity === "strength" ? C.teal : C.amber,
                                }}>{sig.severity}</span>
                              </div>
                              <p className="text-[13px] font-medium" style={{ color: C.text }}>{sig.signal}</p>
                              <p className="text-[12px]" style={{ color: C.textMuted }}>{sig.context}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Practices */}
                    <div className="px-5 py-4" style={{ borderBottom: briefing.financialSignals.length > 0 ? `0.5px solid ${C.border}` : "none" }}>
                      <p className="text-[9px] font-medium uppercase tracking-[0.08em] mb-3" style={{ color: C.textMuted }}>Three micro-practices this fortnight</p>
                      <div className="space-y-4">
                        {briefing.practices.map((pr, i) => (
                          <div key={i}>
                            <div className="flex items-start gap-2">
                              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0 mt-0.5" style={{ backgroundColor: `${C.teal}10`, color: C.teal }}>{i + 1}</span>
                              <div>
                                <p className="text-[13px] font-medium mb-1" style={{ color: C.text }}>{pr.name}</p>
                                <p className="text-[12px] leading-[1.55] mb-1" style={{ color: C.textMuted }}>{pr.description}</p>
                                <p className="text-[11px] italic" style={{ color: C.textFaint }}>{pr.rationale}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Financial signals */}
                    {briefing.financialSignals.length > 0 && (
                      <div className="px-5 py-4" style={{ borderBottom: `0.5px solid ${C.border}` }}>
                        <p className="text-[9px] font-medium uppercase tracking-[0.08em] mb-3" style={{ color: C.textMuted }}>Financial signals</p>
                        <div className="space-y-3">
                          {briefing.financialSignals.map((fs, i) => (
                            <div key={i}>
                              <p className="text-[9px] font-medium uppercase tracking-[0.06em] mb-0.5" style={{ color: C.textFaint }}>{fs.domain}</p>
                              <p className="text-[13px] font-medium mb-1" style={{ color: C.text }}>{fs.headline}</p>
                              <p className="text-[12px] leading-[1.55]" style={{ color: C.textMuted }}>{fs.body}</p>
                              {fs.value && <p className="text-[15px] font-medium mt-1" style={{ color: C.teal }}>{fs.value}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Next briefing */}
                    <div className="px-5 py-3">
                      <p className="text-[12px]" style={{ color: C.textFaint }}>Suggested next briefing: <span className="font-medium" style={{ color: C.text }}>{nextBriefing.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}</span></p>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="space-y-3">
                    <button onClick={() => setShowEmail(true)} className="w-full py-3.5 rounded-[4px] text-[14px] font-medium" style={{ backgroundColor: C.ctaBg, color: C.ctaText }}>
                      Get this as a board paper, signed by Campbell McGlynn and Ben Palmer →
                    </button>
                    <a href="/v2#book" className="block w-full text-center py-3 rounded-[4px] text-[13px] font-medium" style={{ border: `0.5px solid ${C.border}`, color: C.text }}>Book 30 minutes with Campbell</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Email modal */}
      {showEmail && !emailSent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setShowEmail(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <form onSubmit={handleEmail} className="relative bg-white rounded-[8px] p-6 max-w-md w-full space-y-3" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[16px] font-medium" style={{ color: C.text }}>Download your Team Briefing</h3>
            <p className="text-[13px]" style={{ color: C.textMuted }}>Full briefing PDF with signal prioritisation, narrative, micro-practices, and financial signals. Signed by Campbell McGlynn and Dr Ben Palmer.</p>
            <input required type="text" value={emailName} onChange={(e) => setEmailName(e.target.value)} placeholder="Name" className="w-full px-4 py-2.5 rounded-[4px] text-[13px] focus:outline-none" style={{ border: `0.5px solid ${C.border}` }} />
            <select value={emailRole} onChange={(e) => setEmailRole(e.target.value)} className="w-full px-4 py-2.5 rounded-[4px] text-[13px] focus:outline-none" style={{ border: `0.5px solid ${C.border}` }}>
              <option value="">Select role</option>
              {["CEO", "CFO", "COO", "DON", "HR Manager", "WHS Lead", "Quality Lead", "Facility Manager", "Team Leader", "Other"].map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <input required type="text" value={emailOrg} onChange={(e) => setEmailOrg(e.target.value)} placeholder="Organisation" className="w-full px-4 py-2.5 rounded-[4px] text-[13px] focus:outline-none" style={{ border: `0.5px solid ${C.border}` }} />
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Work email" className="w-full px-4 py-2.5 rounded-[4px] text-[13px] focus:outline-none" style={{ border: `0.5px solid ${C.border}` }} />
            <button type="submit" className="w-full py-3 rounded-[4px] text-[14px] font-medium" style={{ backgroundColor: C.ctaBg, color: C.ctaText }}>Send my briefing →</button>
            <p className="text-[10px]" style={{ color: C.textFaint }}>Read our security and privacy position at <a href="/trust" className="hover:underline" style={{ color: C.teal }}>chris-os.io/trust</a>.</p>
          </form>
        </div>
      )}
      {showEmail && emailSent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setShowEmail(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-[8px] p-8 max-w-md w-full text-center">
            <p className="text-[16px] font-medium" style={{ color: C.teal }}>Sent.</p>
            <p className="text-[13px] mt-2" style={{ color: C.textMuted }}>Your Team Briefing will arrive shortly.</p>
          </div>
        </div>
      )}
    </div>
  );
}
