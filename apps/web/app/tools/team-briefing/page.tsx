"use client";

// ── Structural decisions (review these) ─────────────────────────────────────
// 1. Uses the prototype's design tokens (forest/amber/teal/terracotta) for the
//    briefing output panel, and the V2 website tokens (aubergine/copper/cream)
//    for the marketing wrapper (nav, hero, CTAs). This is intentional: the
//    briefing preview should look like the real product.
// 2. Inline personalisation uses contentEditable divs (Notion-style) rather than
//    textarea overlays. Edits are tracked in state for lead routing payload.
// 3. PDF generation is not implemented in this build (requires server-side
//    rendering pipeline). The download button captures the lead and sends the
//    payload to /api/waitlist. Actual PDF delivery is manual for now.
// 4. Micro-practices are drawn from the canonical practice-library.ts, not
//    hardcoded. Falls back to representative practices if import fails.

import { useState, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { RESIDENTIAL_PRACTICES } from "@/lib/loops/practice-library";

// ── Website brand tokens (nav, hero, CTAs) ──────────────────────────────────
const W = {
  dark: "#1a1218", copper: "#c89a3c", copperDark: "#8b6914", cream: "#faf7f2",
  ink: "#f5ede3", inkDark: "#1a1218", inkMutedLight: "rgba(26,18,24,0.78)",
};

// ── Product brand tokens (briefing output) ──────────────────────────────────
const P = {
  forest: "#1B4332", forestLight: "#2D5F45", amber: "#D4A017", amberLight: "#e8c547",
  terracotta: "#C4704A", teal: "#2D7D73", gold: "#D4A853", cream: "#faf7f2",
  card: "#ffffff", border: "rgba(0,0,0,0.08)", mutedText: "rgba(0,0,0,0.55)",
  foreground: "#1a1a1a", insightBg: "linear-gradient(135deg, hsl(150 25% 96%), hsl(150 25% 92%))",
};

// ── Service types ───────────────────────────────────────────────────────────
type ServiceType = "residential" | "home_care" | "ndis" | "mixed";

const SERVICE_OPTIONS: { id: ServiceType; label: string; sub: string }[] = [
  { id: "residential", label: "Residential aged care", sub: "AN-ACC, care minutes, 24/7 RN obligation" },
  { id: "home_care", label: "Home care (HCP / CHSP)", sub: "Mobile workforce, service utilisation, continuity" },
  { id: "ndis", label: "NDIS-funded supports", sub: "Worker screening, behaviour support, plan reviews" },
  { id: "mixed", label: "Mixed (residential + community)", sub: "Both data sets, combined briefing" },
];

// ── Operational data fields ─────────────────────────────────────────────────
interface Field { key: string; label: string; unit: string; min: number; max: number; step: number; def: number; domain: string; sub?: string; }

const RESI: Field[] = [
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
  { key: "whsOpen", label: "Open WHS investigations", unit: "count", min: 0, max: 20, step: 1, def: 3, domain: "WHS" },
  { key: "manualHandling", label: "Manual handling compliance", unit: "%", min: 0, max: 100, step: 1, def: 78, domain: "Training" },
  { key: "medIncidents", label: "Medication incidents", unit: "/month", min: 0, max: 30, step: 1, def: 4, domain: "Clinical Quality" },
  { key: "falls", label: "Falls with injury", unit: "/1k res days", min: 0, max: 20, step: 0.5, def: 6.2, domain: "Clinical Quality" },
];

const HC: Field[] = [
  { key: "totalFte", label: "Total FTE", unit: "FTE", min: 10, max: 500, step: 5, def: 85, domain: "Workforce" },
  { key: "cwFte", label: "Care Worker FTE", unit: "FTE", min: 0, max: 200, step: 1, def: 52, domain: "Workforce" },
  { key: "rnFte", label: "RN FTE", unit: "FTE", min: 0, max: 30, step: 1, def: 8, domain: "Workforce" },
  { key: "coordFte", label: "Case Mgr / Support Coord FTE", unit: "FTE", min: 0, max: 30, step: 1, def: 12, domain: "Workforce" },
  { key: "agencyPct", label: "Agency / casual FTE", unit: "%", min: 0, max: 50, step: 1, def: 22, domain: "Workforce" },
  { key: "turnover", label: "Staff turnover rate", unit: "% ann.", min: 0, max: 60, step: 1, def: 32, domain: "Attrition" },
  { key: "turnoverCW", label: "Turnover (care workers)", unit: "% ann.", min: 0, max: 60, step: 1, def: 38, domain: "Attrition" },
  { key: "turnoverCoord", label: "Turnover (coordinators)", unit: "% ann.", min: 0, max: 60, step: 1, def: 24, domain: "Attrition" },
  { key: "newStaff", label: "New staff < 6 months", unit: "head", min: 0, max: 80, step: 1, def: 18, domain: "Workforce" },
  { key: "missed", label: "Missed service hours", unit: "/month", min: 0, max: 100, step: 2, def: 28, domain: "Rostering" },
  { key: "rosterStability", label: "Worker consistency index", unit: "%", min: 0, max: 100, step: 1, def: 64, domain: "Rostering", sub: "% visits with same worker as prior fortnight" },
  { key: "overtime", label: "Overtime hours (clinical)", unit: "hrs/mo", min: 0, max: 400, step: 10, def: 140, domain: "Rostering" },
  { key: "sickLeave", label: "Sick leave (clinical)", unit: "hrs/FTE/yr", min: 0, max: 120, step: 2, def: 68, domain: "Leave" },
  { key: "wcHours", label: "Workers comp hours", unit: "hrs/yr", min: 0, max: 400, step: 10, def: 90, domain: "Leave" },
  { key: "loneWorker", label: "Lone worker incidents", unit: "/month", min: 0, max: 20, step: 1, def: 3, domain: "WHS", sub: "Critical for mobile workforces" },
  { key: "vehicleIncidents", label: "Vehicle / travel incidents", unit: "/month", min: 0, max: 15, step: 1, def: 2, domain: "WHS" },
  { key: "aggression", label: "Aggression incidents", unit: "/month", min: 0, max: 30, step: 1, def: 4, domain: "WHS" },
  { key: "manualHandling", label: "Manual handling + First Aid", unit: "%", min: 0, max: 100, step: 1, def: 72, domain: "Training" },
  { key: "carePlanCurrency", label: "Care plan currency", unit: "% <12m", min: 0, max: 100, step: 1, def: 81, domain: "Clinical Quality" },
  { key: "serviceUtil", label: "Service utilisation rate", unit: "% del/fund", min: 30, max: 100, step: 1, def: 74, domain: "Client Experience", sub: "Under-utilisation = NDIA scrutiny + revenue loss" },
];

// ── Pulse fields ────────────────────────────────────────────────────────────
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

// ── Briefing generation ─────────────────────────────────────────────────────
interface Insight { domain: string; signal: string; severity: "critical" | "elevated" | "watch" | "strength"; detail: string; }
interface BriefingOutput {
  chrisInsight: string;
  story: string[];
  insights: Insight[];
  practices: typeof RESIDENTIAL_PRACTICES;
  conversationGuide: { opening: string; prompt: string; practiceIntro: string; closing: string };
  pshBadges: string[];
}

function generate(svc: ServiceType, o: Record<string, number>, p: Record<string, number>): BriefingOutput {
  const isResi = svc === "residential" || svc === "mixed";
  const insights: Insight[] = [];
  const pshBadges: string[] = [];

  // Turnover
  const turnover = o.turnover ?? 28;
  if (turnover > 35) { insights.push({ domain: "Attrition", signal: `Turnover at ${turnover}%, well above sector average`, severity: "critical", detail: `At ${turnover}% annualised, you are replacing roughly ${Math.round((o.totalFte ?? 100) * turnover / 100)} staff per year. Replacement cost at $50K per head: $${Math.round((o.totalFte ?? 100) * turnover / 100 * 50000 / 1000)}K.` }); pshBadges.push("PSH_01", "PSH_03", "PSH_06"); }
  else if (turnover > 25) insights.push({ domain: "Attrition", signal: `Turnover at ${turnover}%, at sector average`, severity: "elevated", detail: "Sector average is not a target. Every point reduction saves roughly $50K per avoided replacement." });
  else insights.push({ domain: "Attrition", signal: `Turnover at ${turnover}%, below sector average`, severity: "strength", detail: "Below sector average. Protect what is working. Identify the retention drivers." });

  // Agency
  if ((o.agencyPct ?? 18) > 25) { insights.push({ domain: "Workforce", signal: `Agency at ${o.agencyPct}% of FTE`, severity: "critical", detail: "Above 25% erodes continuity, inflates cost, and drives role clarity and trust signals." }); pshBadges.push("PSH_03", "PSH_05"); }
  else if ((o.agencyPct ?? 18) > 15) insights.push({ domain: "Workforce", signal: `Agency at ${o.agencyPct ?? 18}% of FTE`, severity: "watch", detail: "Moderate agency dependency. Monitor for concentration in specific shifts." });

  // Sick leave
  if ((o.sickLeave ?? 62) > 70) { insights.push({ domain: "Leave", signal: `Sick leave at ${o.sickLeave} hrs/FTE/yr, elevated`, severity: "elevated", detail: "Above 70 hrs/FTE signals burnout or workload mismatch. Correlate with overtime and aggression for convergence." }); pshBadges.push("PSH_01", "PSH_10"); }

  // Overtime
  const otPerFte = (o.overtime ?? 180) * 12 / (o.totalFte ?? 100);
  if (otPerFte > 20) { insights.push({ domain: "Rostering", signal: `Overtime at ${Math.round(otPerFte)} hrs/FTE/yr`, severity: "elevated", detail: "Sustained overtime drives fatigue and injury risk. The cycle is self-reinforcing." }); pshBadges.push("PSH_10"); }

  // Missed shifts
  if ((o.missed ?? 14) > 20) insights.push({ domain: "Rostering", signal: `${o.missed} unfilled shifts per month`, severity: "critical", detail: "Creates direct workload pressure on remaining staff." });

  // Residential
  if (isResi) {
    const cm = o.careMinTotal ?? 198;
    if (cm < 200) { insights.push({ domain: "Clinical", signal: `Care minutes at ${cm}/215, below target`, severity: "critical", detail: `${215 - cm} minutes short of target. Supplement factor: ${Math.max(0, Math.round(((Math.min(cm / 215, 1) - 0.85) / 0.15) * 100))}%.` }); }
    else if (cm < 215) insights.push({ domain: "Clinical", signal: `Care minutes at ${cm}/215, approaching`, severity: "elevated", detail: "Close but not compliant. One bad week drops you below." });

    if ((o.falls ?? 6.2) > 8) insights.push({ domain: "Quality", signal: `Falls at ${o.falls}/1k resident days`, severity: "critical", detail: "Above national benchmark. Correlate with agency usage and overtime." });
    if ((o.aggression ?? 6) > 5) { insights.push({ domain: "WHS", signal: `${o.aggression} aggression incidents per month`, severity: "elevated", detail: "Strongest PSH_11 anchor. Under-reporting common." }); pshBadges.push("PSH_11"); }
  }

  // HC/NDIS
  if (!isResi || svc === "mixed") {
    if ((o.serviceUtil ?? 74) < 80) insights.push({ domain: "Client", signal: `Utilisation at ${o.serviceUtil ?? 74}%, below target`, severity: "elevated", detail: `${100 - (o.serviceUtil ?? 74)}% of funded hours undelivered. NDIA scrutiny risk.` });
    if ((o.rosterStability ?? 64) < 70) insights.push({ domain: "Rostering", signal: `Worker consistency at ${o.rosterStability ?? 64}%`, severity: "elevated", detail: "Below 70% erodes client trust. NDIS quality standard requires continuity." });
    if ((o.loneWorker ?? 3) > 2) { insights.push({ domain: "WHS", signal: `${o.loneWorker ?? 3} lone worker incidents/month`, severity: "elevated", detail: "Fastest-growing WHS category. PSH_09 and PSH_11 converge." }); pshBadges.push("PSH_09", "PSH_11"); }
  }

  // Pulse
  if (p.psychSafety < 50) { insights.push({ domain: "Pulse", signal: `Psychological safety at ${p.psychSafety}%`, severity: "critical", detail: "Below 50% means staff do not feel safe raising concerns. This suppresses all other signals." }); pshBadges.push("PSH_06"); }
  if (p.fatigue > 65) { insights.push({ domain: "Pulse", signal: `Fatigue at ${p.fatigue}%`, severity: "elevated", detail: "Above 65% correlates with increased sick leave, injury, and turnover within 90 days." }); pshBadges.push("PSH_10"); }
  if (p.voice < 45) { insights.push({ domain: "Pulse", signal: `Voice willingness at ${p.voice}%`, severity: "elevated", detail: "Staff are not raising issues. Expect delayed signal detection across all domains." }); pshBadges.push("PSH_06"); }
  if (p.workload < 45) { insights.push({ domain: "Pulse", signal: `Workload sustainability at ${p.workload}%`, severity: "critical", detail: "Below 45% is a leading indicator of attrition within 6 months." }); pshBadges.push("PSH_01"); }
  if (p.trust < 50) insights.push({ domain: "Pulse", signal: `Trust in leadership at ${p.trust}%`, severity: "elevated", detail: "Below 50% undermines every intervention. Fix trust before investing in programs." });

  insights.sort((a, b) => ({ critical: 0, elevated: 1, watch: 2, strength: 3 }[a.severity] - { critical: 0, elevated: 1, watch: 2, strength: 3 }[b.severity]));

  // CHRIS Insight — one-sentence pattern observation
  const topSignal = insights[0];
  const chrisInsight = topSignal
    ? topSignal.severity === "critical"
      ? `Your team has a convergence pattern forming: ${topSignal.signal.toLowerCase()}. Cross-referencing with pulse data, this is not isolated. The signals are connected, and they are accelerating.`
      : topSignal.severity === "strength"
        ? `Your team is performing well on key indicators. ${topSignal.signal}. The focus this fortnight should be protecting what is working, not adding new initiatives.`
        : `Your team's data shows pressure building: ${topSignal.signal.toLowerCase()}. The pulse confirms what the operational data suggests. This is the fortnight to act, not observe.`
    : "Data loaded. Adjust your inputs to see how the briefing responds to your team's specific context.";

  // Story Behind the Data — 2-3 paragraphs
  const critCount = insights.filter((i) => i.severity === "critical").length;
  const elevCount = insights.filter((i) => i.severity === "elevated").length;
  const story: string[] = [];

  if (critCount > 0) {
    story.push(`This fortnight's data tells a clear story: ${critCount} critical signal${critCount > 1 ? "s" : ""} and ${elevCount} elevated signal${elevCount > 1 ? "s" : ""}. ${insights[0].detail}`);
    if (insights.length > 1) story.push(`Cross-referencing with ${insights[1].domain.toLowerCase()} data: ${insights[1].detail} When these signals converge, the risk compounds. A workforce under strain makes more errors, takes more leave, and disengages from upward communication.`);
    story.push(`The data suggests this is not about morale alone. Your team is carrying unresolved operational strain alongside genuine pulse signals. The risk is that the team moves from "raising issues" to "not raising issues at all."`);
  } else if (elevCount > 0) {
    story.push(`This fortnight's data shows ${elevCount} elevated signal${elevCount > 1 ? "s" : ""} that warrant attention. ${insights[0].detail}`);
    story.push(`These signals are not yet critical, but the trend direction matters more than the absolute number. If the pattern holds for another cycle, expect downstream effects on leave, incidents, and retention.`);
  } else {
    story.push(`Your team's data this fortnight is within acceptable ranges across key indicators. No critical or elevated signals detected.`);
    story.push(`This is the right moment to reinforce what is working. Stability is hard-won in aged care. Name the practices and behaviours that are driving the current position, and protect them deliberately.`);
  }

  // Practice selection — match to top PSH signals
  const topPSH = [...new Set(pshBadges)].slice(0, 3);
  const matched = RESIDENTIAL_PRACTICES.filter((pr) =>
    pr.psychosocial_hazard.some((h) => topPSH.includes(h))
  ).slice(0, 3);
  const practices = matched.length >= 2 ? matched : RESIDENTIAL_PRACTICES.slice(0, 3);

  // Conversation guide
  const conversationGuide = {
    opening: `"Thanks for being here. I want to share what the data is showing us this fortnight, and I want to hear from you."`,
    prompt: topSignal ? `"The data is telling us that ${topSignal.signal.toLowerCase()}. Before I share what I'm planning to try, I want to hear: does that match what you're experiencing on the floor?"` : `"The data this fortnight is stable. What I want to know is: what's one thing we should keep doing, and one thing that's quietly getting harder?"`,
    practiceIntro: practices[0] ? `"Based on what the data is showing, I'm going to try something this fortnight: ${practices[0].title.toLowerCase()}. Here's what that looks like in practice..."` : `"I'm going to try one specific thing this fortnight. Let me walk you through it."`,
    closing: `"I'll check back on this at our next huddle. If something changes before then, come find me. That's what I'm here for."`,
  };

  return { chrisInsight, story, insights, practices, conversationGuide, pshBadges: [...new Set(pshBadges)] };
}

// ── Components ──────────────────────────────────────────────────────────────
function Slider({ label, value, min, max, step, display, onChange, sub }: {
  label: string; value: number; min: number; max: number; step: number;
  display: string; onChange: (v: number) => void; sub?: string;
}) {
  return (
    <div className="mb-3">
      <div className="flex justify-between items-baseline mb-0.5">
        <div><span className="text-[12px] font-medium" style={{ color: P.foreground }}>{label}</span>
          {sub && <p className="text-[9px]" style={{ color: P.mutedText }}>{sub}</p>}
        </div>
        <span className="text-[13px] font-semibold tabular-nums" style={{ color: P.foreground }}>{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full cursor-pointer h-1.5" style={{ accentColor: P.forest }} />
    </div>
  );
}

function ChrisAvatar({ glow }: { glow?: boolean }) {
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${glow ? "shadow-[0_0_12px_rgba(27,67,50,0.3)]" : ""}`}
      style={{ background: `linear-gradient(135deg, ${P.forest}, ${P.gold})` }}>
      <span className="text-white text-sm font-semibold">C</span>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    critical: { bg: "rgba(196,112,74,0.12)", text: P.terracotta, label: "Critical" },
    elevated: { bg: "rgba(212,160,23,0.12)", text: P.amber, label: "Elevated" },
    watch: { bg: "rgba(212,160,23,0.08)", text: P.amber, label: "Watch" },
    strength: { bg: "rgba(45,125,115,0.12)", text: P.teal, label: "Strength" },
  };
  const s = map[severity] ?? map.watch;
  return <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>;
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function TeamBriefingTool() {
  const [step, setStep] = useState(0);
  const [svc, setSvc] = useState<ServiceType>("residential");
  const [teamName, setTeamName] = useState("Grevillea Wing");
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState("NFP");
  const [region, setRegion] = useState("Metropolitan");
  const [ops, setOps] = useState<Record<string, number>>({});
  const [pulse, setPulse] = useState<Record<string, number>>(() => {
    const d: Record<string, number> = {};
    PULSE.forEach((f) => { d[f.key] = f.def; });
    return d;
  });
  const [showEmail, setShowEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [emailName, setEmailName] = useState("");
  const [emailRole, setEmailRole] = useState("");
  const [emailOrg, setEmailOrg] = useState("");
  const [edits, setEdits] = useState<Record<string, string>>({});

  const fields = svc === "residential" ? RESI : HC;
  const eff = useMemo(() => {
    const d: Record<string, number> = {};
    fields.forEach((f) => { d[f.key] = ops[f.key] ?? f.def; });
    return d;
  }, [fields, ops]);

  const briefing = useMemo(() => generate(svc, eff, pulse), [svc, eff, pulse]);
  const critCount = briefing.insights.filter((i) => i.severity === "critical").length;
  const elevCount = briefing.insights.filter((i) => i.severity === "elevated").length;

  const trackEdit = useCallback((id: string, text: string) => {
    setEdits((prev) => ({ ...prev, [id]: text }));
  }, []);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    try { await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, name: emailName, role: emailRole, organisation: emailOrg, workflow_interest: "team_briefing", edits, calculator_data: { serviceType: svc, critCount, elevCount, topSignal: briefing.insights[0]?.signal, pshBadges: briefing.pshBadges } }) }); } catch {}
    setEmailSent(true);
  }

  const cycleDate = new Date();
  cycleDate.setDate(cycleDate.getDate() + 14);
  const nextBriefing = cycleDate.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50" style={{ backgroundColor: W.dark, borderBottom: "1px solid rgba(245,237,227,0.08)" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-16 py-4">
          <Link href="/v2" className="text-[15px] font-medium tracking-tight" style={{ color: W.ink }}>CHRIS<span style={{ color: W.copper }}>·</span>OS</Link>
          <a href="/v2#book" className="text-[13px] font-medium px-5 py-2 rounded" style={{ backgroundColor: W.copper, color: W.dark }}>Book a conversation</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ backgroundColor: W.dark }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-16 py-12 lg:py-16 text-center">
          <div className="text-[11px] font-medium tracking-[0.12em] uppercase mb-5" style={{ color: W.copper }}>EX Team Briefing · See what your leaders would receive</div>
          <h1 className="text-[clamp(1.3rem,3vw,2rem)] font-normal leading-[1.2] mb-4" style={{ fontFamily: "Georgia, serif", color: "#ffffff" }}>
            Enter your data. See your briefing.{" "}
            <em className="italic" style={{ color: W.copper }}>Share it with your team.</em>
          </h1>
          <p className="text-[14px] leading-[1.65] max-w-xl mx-auto" style={{ color: "rgba(245,237,227,0.65)" }}>
            Chris generates a Team Briefing from your operational and pulse data: prioritised signals, the story behind the data, micro-practices matched to your situation, and a conversation script for your next huddle. Defaults loaded. Refine or generate immediately.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section style={{ backgroundColor: P.cream }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 lg:gap-10">
            {/* ── Left: Inputs ── */}
            <div className="space-y-4">
              {/* Step tabs */}
              <div className="flex gap-1">
                {["Setup", "Operations", "Pulse"].map((s, i) => (
                  <button key={s} onClick={() => setStep(i)}
                    className="flex-1 text-center py-2 rounded-lg text-[11px] font-medium transition-all"
                    style={{ backgroundColor: step === i ? "#fff" : "transparent", color: step === i ? P.foreground : P.mutedText, boxShadow: step === i ? "0 1px 4px rgba(0,0,0,0.06)" : "none" }}>{s}</button>
                ))}
              </div>

              {/* Step 0 */}
              {step === 0 && (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-5 border" style={{ borderColor: P.border }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-3 pb-2 border-b" style={{ color: P.mutedText, borderColor: P.border }}>Service type</p>
                    <div className="space-y-2">
                      {SERVICE_OPTIONS.map((o) => (
                        <button key={o.id} onClick={() => setSvc(o.id)} className="w-full text-left px-4 py-3 rounded-lg border transition-all"
                          style={{ borderColor: svc === o.id ? P.forest : P.border, backgroundColor: svc === o.id ? "rgba(27,67,50,0.04)" : "#fff", borderWidth: svc === o.id ? 2 : 1 }}>
                          <p className="text-[13px] font-medium" style={{ color: P.foreground }}>{o.label}</p>
                          <p className="text-[11px]" style={{ color: P.mutedText }}>{o.sub}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-5 border" style={{ borderColor: P.border }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-3 pb-2 border-b" style={{ color: P.mutedText, borderColor: P.border }}>Team profile</p>
                    <div className="space-y-3">
                      <div>
                        <label className="text-[12px] font-medium" style={{ color: P.foreground }}>Team / wing name</label>
                        <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} className="w-full mt-1 px-3 py-2 rounded border text-[13px] focus:outline-none" style={{ borderColor: P.border }} />
                      </div>
                      <div>
                        <label className="text-[12px] font-medium" style={{ color: P.foreground }}>Organisation</label>
                        <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Optional" className="w-full mt-1 px-3 py-2 rounded border text-[13px] focus:outline-none" style={{ borderColor: P.border }} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-medium" style={{ color: P.mutedText }}>Type</label>
                          <select value={orgType} onChange={(e) => setOrgType(e.target.value)} className="w-full mt-1 px-2 py-2 rounded border text-[12px]" style={{ borderColor: P.border }}>
                            {["NFP", "For-profit", "Government", "Charity"].map((o) => <option key={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-[11px] font-medium" style={{ color: P.mutedText }}>Region</label>
                          <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full mt-1 px-2 py-2 rounded border text-[12px]" style={{ borderColor: P.border }}>
                            {["Metropolitan", "Regional", "Rural/Remote"].map((o) => <option key={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setStep(1)} className="w-full py-3 rounded-lg text-[13px] font-medium text-white" style={{ backgroundColor: P.forest }}>Next: Operational data →</button>
                </div>
              )}

              {/* Step 1: Ops */}
              {step === 1 && (
                <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
                  {Array.from(new Set(fields.map((f) => f.domain))).map((dom) => (
                    <div key={dom} className="bg-white rounded-xl p-5 border" style={{ borderColor: P.border }}>
                      <p className="text-[10px] font-semibold uppercase tracking-wider mb-3 pb-2 border-b" style={{ color: P.mutedText, borderColor: P.border }}>{dom}</p>
                      {fields.filter((f) => f.domain === dom).map((f) => (
                        <Slider key={f.key} label={f.label} value={eff[f.key]} min={f.min} max={f.max} step={f.step} sub={f.sub}
                          display={`${eff[f.key]}${f.unit.startsWith("%") ? "%" : ` ${f.unit}`}`}
                          onChange={(v) => setOps({ ...ops, [f.key]: v })} />
                      ))}
                    </div>
                  ))}
                  <div className="flex gap-3 sticky bottom-0 bg-[#faf7f2] pt-2">
                    <button onClick={() => setStep(0)} className="flex-1 py-3 rounded-lg text-[13px] font-medium border" style={{ borderColor: P.border, color: P.foreground }}>← Back</button>
                    <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-lg text-[13px] font-medium text-white" style={{ backgroundColor: P.forest }}>Next: Pulse →</button>
                  </div>
                </div>
              )}

              {/* Step 2: Pulse */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-5 border" style={{ borderColor: P.border }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-1 pb-2 border-b" style={{ color: P.mutedText, borderColor: P.border }}>Pulse survey data</p>
                    <p className="text-[10px] mb-4" style={{ color: P.mutedText }}>Representative cohort defaults. Adjust to match your team.</p>
                    {PULSE.map((f) => (
                      <Slider key={f.key} label={f.label} value={pulse[f.key]} min={0} max={100} step={1}
                        display={`${pulse[f.key]}%`} onChange={(v) => setPulse({ ...pulse, [f.key]: v })} />
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-lg text-[13px] font-medium border" style={{ borderColor: P.border, color: P.foreground }}>← Back</button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right: Live briefing preview ── */}
            <div className="space-y-4">
              {/* Header */}
              <div className="bg-white rounded-xl p-5 border" style={{ borderColor: P.border }}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: P.mutedText }}>Team Briefing</p>
                    <h2 className="text-[18px] font-semibold" style={{ color: P.foreground }}>{teamName}</h2>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: critCount > 0 ? "rgba(196,112,74,0.12)" : elevCount > 0 ? "rgba(212,160,23,0.12)" : "rgba(45,125,115,0.12)", color: critCount > 0 ? P.terracotta : elevCount > 0 ? P.amber : P.teal }}>
                      {critCount > 0 ? "Signals detected" : elevCount > 0 ? "Watch" : "Stable"}
                    </span>
                    <p className="text-[10px] mt-1" style={{ color: P.mutedText }}>Cycle 8 · Fortnight ending {new Date().toLocaleDateString("en-AU", { day: "numeric", month: "short" })}</p>
                  </div>
                </div>
              </div>

              {/* CHRIS Insight */}
              <div className="rounded-xl p-5" style={{ background: P.insightBg }}>
                <div className="flex items-start gap-3">
                  <ChrisAvatar glow />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: P.forest }}>CHRIS INSIGHT</p>
                    <p className="text-[14px] leading-relaxed" style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: P.foreground }}
                      contentEditable suppressContentEditableWarning
                      onBlur={(e) => trackEdit("insight", e.currentTarget.textContent ?? "")}>
                      {briefing.chrisInsight}
                    </p>
                  </div>
                </div>
              </div>

              {/* Story Behind the Data */}
              <div className="bg-white rounded-xl p-5 border" style={{ borderColor: P.border }}>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: P.mutedText }}>The Story Behind the Data</p>
                <div className="space-y-3">
                  {briefing.story.map((para, i) => (
                    <p key={i} className="text-[14px] leading-[1.75]" style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: "rgba(0,0,0,0.65)" }}
                      contentEditable suppressContentEditableWarning
                      onBlur={(e) => trackEdit(`story_${i}`, e.currentTarget.textContent ?? "")}>
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {/* Signal cards */}
              <div className="bg-white rounded-xl p-5 border" style={{ borderColor: P.border }}>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: P.mutedText }}>What is showing up</p>
                <div className="space-y-3">
                  {briefing.insights.slice(0, 5).map((ins, i) => (
                    <div key={i} className="flex items-start gap-3 py-2" style={{ borderTop: i > 0 ? `1px solid ${P.border}` : "none" }}>
                      <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: ins.severity === "critical" ? P.terracotta : ins.severity === "strength" ? P.teal : P.amber }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: P.mutedText }}>{ins.domain}</span>
                          <SeverityBadge severity={ins.severity} />
                        </div>
                        <p className="text-[13px] font-medium" style={{ color: P.foreground }}>{ins.signal}</p>
                        <p className="text-[12px] leading-relaxed mt-0.5" style={{ color: P.mutedText }}>{ins.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Micro-practices */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: P.mutedText }}>Micro-practices for inspiration</p>
                <div className="space-y-3">
                  {briefing.practices.slice(0, 3).map((pr) => (
                    <div key={pr.id} className="bg-white rounded-xl p-5 border" style={{ borderColor: P.border }}>
                      <p className="text-[14px] font-semibold mb-1" style={{ color: P.foreground }}>{pr.title}</p>
                      <p className="text-[12px] mb-3" style={{ color: P.mutedText }}>{pr.tagline}</p>
                      <p className="text-[12px] leading-relaxed mb-3" style={{ color: "rgba(0,0,0,0.6)" }}
                        contentEditable suppressContentEditableWarning
                        onBlur={(e) => trackEdit(`practice_${pr.id}`, e.currentTarget.textContent ?? "")}>
                        {pr.what_to_try}
                      </p>
                      <div className="flex items-center gap-4">
                        <span className="text-[11px] font-medium cursor-pointer" style={{ color: P.amber }}>Use as inspiration ✦</span>
                        <span className="text-[11px] font-medium cursor-pointer" style={{ color: P.teal }}>Learn from others →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Loop Conversation Guide */}
              <div className="bg-white rounded-xl p-5 border" style={{ borderColor: P.border }}>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: P.mutedText }}>Team Loop Conversation Guide</p>
                <div className="space-y-3">
                  {[
                    { label: "Opening", text: briefing.conversationGuide.opening },
                    { label: "Discussion prompt", text: briefing.conversationGuide.prompt },
                    { label: "Practice introduction", text: briefing.conversationGuide.practiceIntro },
                    { label: "Closing", text: briefing.conversationGuide.closing },
                  ].map((line) => (
                    <div key={line.label}>
                      <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: P.forest }}>{line.label}</p>
                      <p className="text-[13px] leading-relaxed italic" style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: "rgba(0,0,0,0.6)" }}
                        contentEditable suppressContentEditableWarning
                        onBlur={(e) => trackEdit(`guide_${line.label}`, e.currentTarget.textContent ?? "")}>
                        {line.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* PSH badges */}
              {briefing.pshBadges.length > 0 && (
                <div className="bg-white rounded-xl p-5 border" style={{ borderColor: P.border }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: P.mutedText }}>PSH hazards surfaced</p>
                  <div className="flex flex-wrap gap-2">
                    {briefing.pshBadges.map((b) => (
                      <span key={b} className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(212,160,23,0.1)", color: P.amber }}>{b}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Next briefing */}
              <div className="rounded-xl px-4 py-3 text-center" style={{ backgroundColor: "rgba(27,67,50,0.04)", border: "1px solid rgba(27,67,50,0.08)" }}>
                <p className="text-[12px]" style={{ color: P.forest }}>Suggested next briefing: <strong>{nextBriefing}</strong></p>
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <button onClick={() => setShowEmail(true)} className="block w-full text-center py-3.5 rounded-lg text-[14px] font-medium text-white hover:opacity-90" style={{ backgroundColor: P.terracotta }}>Download briefing PDF →</button>
                <a href="/v2#book" className="block w-full text-center py-3 rounded-lg text-[13px] font-medium border hover:opacity-80" style={{ borderColor: P.border, color: P.foreground }}>Book a 30-minute diagnostic</a>
              </div>

              <p className="text-[10px] text-center leading-relaxed" style={{ color: P.mutedText }}>
                Sample generated from representative inputs. To run on your real data, talk to us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Email modal */}
      {showEmail && !emailSent && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setShowEmail(false)}>
          <form onSubmit={handleEmail} className="bg-white rounded-xl p-6 max-w-md w-full space-y-3" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[16px] font-semibold" style={{ color: P.foreground }}>Download your Team Briefing</h3>
            <p className="text-[13px]" style={{ color: P.mutedText }}>Full briefing PDF styled as a real Chris Team Briefing. Includes signal prioritisation, narrative, micro-practices, and conversation guide.</p>
            <input required type="text" value={emailName} onChange={(e) => setEmailName(e.target.value)} placeholder="Name" className="w-full px-4 py-2.5 rounded border text-[13px] focus:outline-none" style={{ borderColor: P.border }} />
            <select value={emailRole} onChange={(e) => setEmailRole(e.target.value)} className="w-full px-4 py-2.5 rounded border text-[13px] focus:outline-none" style={{ borderColor: P.border }}>
              <option value="">Select role</option>
              {["CEO", "CFO", "COO", "DON", "HR Manager", "WHS Lead", "Quality Lead", "Facility Manager", "Team Leader", "Other"].map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <input required type="text" value={emailOrg} onChange={(e) => setEmailOrg(e.target.value)} placeholder="Organisation" className="w-full px-4 py-2.5 rounded border text-[13px] focus:outline-none" style={{ borderColor: P.border }} />
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Work email" className="w-full px-4 py-2.5 rounded border text-[13px] focus:outline-none" style={{ borderColor: P.border }} />
            <button type="submit" className="w-full py-3 rounded text-[14px] font-medium text-white hover:opacity-90" style={{ backgroundColor: P.terracotta }}>Send my briefing →</button>
          </form>
        </div>
      )}
      {showEmail && emailSent && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setShowEmail(false)}>
          <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
            <p className="text-[16px] font-semibold" style={{ color: P.foreground }}>Sent.</p>
            <p className="text-[13px] mt-2" style={{ color: P.mutedText }}>Check your inbox. Your Team Briefing is attached.</p>
          </div>
        </div>
      )}
    </div>
  );
}
