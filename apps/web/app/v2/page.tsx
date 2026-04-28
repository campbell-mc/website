"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import ChrisPublicChat from "@/components/ChrisPublicChat";
import { CareMinutesCard } from "@/components/marketing/cards/CareMinutesCard";
import { ReviewQueueCard } from "@/components/marketing/cards/ReviewQueueCard";
import { AgentActivityCard } from "@/components/marketing/cards/AgentActivityCard";

// ─── Visual identity: Ironstone ──────────────────────────────────────────────
// Paper canvas. Ironstone accent. Fraunces serif headlines. Inter sans body.
// Two-colour system: ironstone (voice) + sage (whisper, section eyebrows only).
const C = {
  // Paper
  paper: "#f3efe6",
  cardPaper: "#faf6ec",
  canvas: "#f3efe6",       // alias for sections that still reference C.canvas
  card: "#faf6ec",
  // Ink
  text: "#1a1a1a",
  textSoft: "#2a2a2a",
  textMuted: "#3a3a3a",
  textQuiet: "#4a4a4a",
  textFaint: "#6a6a6a",
  // Ironstone — the brand's voice
  ironstone: "#8b3a32",
  ironstoneDeep: "#6e2e28",
  // Sage — the brand's whisper (section eyebrows only, NOT in hero)
  sage: "#5d6b54",
  sageSoft: "#b8c0a8",
  // Rules
  ruleCharcoal: "rgba(26, 26, 26, 0.12)",
  ruleIronstone: "rgba(139, 58, 50, 0.3)",
  // Alert
  red: "#8b3a32",
  // Borders
  border: "rgba(26, 26, 26, 0.12)",
  borderSubtle: "rgba(26, 26, 26, 0.08)",
  // CTA
  ctaBg: "#1a1a1a",
  ctaText: "#f3efe6",
  // Section backgrounds
  canvasWarm: "#f3efe6",
  canvasLight: "#faf6ec",
  canvasDark: "#1a1a1a",
  textOnDark: "#f3efe6",
  textOnDarkMuted: "#B5B3AC",
  borderOnDark: "rgba(255,255,255,0.10)",
  // Inside-product tokens (briefing artefact ONLY)
  forest: "#1B4332",
  gold: "#D4A853",
  // Legacy aliases
  dark: "#1a1a1a", dark2: "#2a2a2a", cream: "#f3efe6", white: "#faf6ec",
  ink: "#f3efe6", inkDark: "#1a1a1a", inkMuted: "#3a3a3a", inkMutedLight: "#3a3a3a",
  copper: "#8b3a32", copperDark: "#6e2e28", warm: "#8b3a32", good: "#5d6b54", warn: "#8b3a32",
  teal: "#5d6b54", amber: "#8b3a32",
  // Accent alias for components that use C.accent
  accent: "#8b3a32",
  accentMuted: "rgba(139, 58, 50, 0.12)",
  successBg: "#E1F5EE", warningBg: "#FAEEDA", alertBg: "#FCEBEB",
};

// ─── Data ───────────────────────────────────────────────────────────────────

const TOOLS = [
  {
    title: "EX workforce ROI",
    blurb: "What is turnover, agency dependence, and burnout costing you? Modelled on your facility.",
    cta: "Calculate ROI →",
    href: "/tools/ex-roi",
    stat: "28%",
    statLabel: "average aged care turnover rate. What is yours costing?",
    accent: C.teal,
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 22 L10 14 L16 17 L24 6" stroke="#1F6F66" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="24" cy="6" r="3" fill="#1F6F66" fillOpacity="0.3"><animate attributeName="r" values="2.5;3.5;2.5" dur="2s" repeatCount="indefinite" /></circle>
      </svg>
    ),
  },
  {
    title: "Care minutes & supplement",
    blurb: "Are you meeting 215/44? See your compliance position and your financial exposure.",
    cta: "Run the check →",
    href: "/tools/care-minutes",
    stat: "45.9%",
    statLabel: "of services meeting both targets nationally",
    accent: C.red,
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="11" stroke="#A32D2D" strokeWidth="2.5" strokeDasharray="56 14" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" from="0 14 14" to="360 14 14" dur="20s" repeatCount="indefinite" /></circle>
        <text x="14" y="17" textAnchor="middle" fill="#A32D2D" fontSize="8" fontWeight="700" fontFamily="system-ui">215</text>
      </svg>
    ),
  },
  {
    title: "PSH self-assessment",
    blurb: "Score your facility across all 16 ISO 45003 psychosocial hazards. Get your convergence risk.",
    cta: "Start the assessment →",
    href: "/tools/psh-assessment",
    stat: "16",
    statLabel: "hazard domains. One conversation with Chris.",
    accent: C.amber,
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        {[0, 1, 2, 3, 4, 5].map((i) => { const a = (i * 60 - 90) * Math.PI / 180; return <circle key={i} cx={14 + 9 * Math.cos(a)} cy={14 + 9 * Math.sin(a)} r="3" fill="#BA7517" fillOpacity={0.15 + i * 0.12}><animate attributeName="fillOpacity" values={`${0.15 + i * 0.12};${0.5 + i * 0.08};${0.15 + i * 0.12}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" /></circle>; })}
        <circle cx="14" cy="14" r="4" fill="#BA7517" fillOpacity="0.3" />
      </svg>
    ),
  },
  {
    title: "Team Briefing demo",
    blurb: "See what your team leaders would receive. Operational data in, prioritised briefing out.",
    cta: "Generate a briefing →",
    href: "/tools/team-briefing",
    stat: "14",
    statLabel: "day cycle. One briefing. One practice. Measured.",
    accent: C.teal,
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="4" width="20" height="20" rx="4" stroke="#1F6F66" strokeWidth="2" />
        <path d="M9 10h10M9 14h7M9 18h4" stroke="#1F6F66" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="22" cy="8" r="3" fill="#1F6F66" fillOpacity="0.4"><animate attributeName="fillOpacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" /></circle>
      </svg>
    ),
  },
];

const STATS = [
  { number: "$1.5M", label: "Maximum corporate penalty, serious failure, Aged Care Act 2024", color: C.warn },
  { number: "549,000", label: "Aged care workers, no operational OS, until now", color: C.teal },
  { number: "16", label: "Mandated psychosocial hazards, one spreadsheet between them and you", color: C.teal },
];

const JOBS = [
  {
    n: "01", role: "DON", title: "Handle SIRS without missing a deadline",
    hook: "A Priority 1 incident. 11pm. The 24-hour clock is running.", accent: C.warm,
    chrisDoes: [
      "Classifies incident as Priority 1 or Priority 2 within minutes of ingestion",
      "Drafts the ACQSC notification with all mandatory fields populated",
      "Monitors the deadline countdown. Escalates via iMessage if unactioned",
      "Submits to GPMS portal after DON approval",
    ],
    humanDoes: ["Reviews the draft", "Approves and submits"],
    stakes: "Civil penalties and compliance action for late notifications. The 24-hour clock starts from when any staff member becomes aware.",
  },
  {
    n: "02", role: "DON", title: "Stay on the right side of care minutes every day",
    hook: "2pm. Your RN called in sick. Nobody's run the numbers.", accent: C.copper,
    chrisDoes: [
      "Pulls rostering data from Deputy / Humanforce every 2 hours",
      "Calculates total and RN minutes per resident against 215/44 thresholds",
      "Projects end-of-shift compliance based on current roster",
      "Alerts DON when breach risk detected, before the shift ends",
    ],
    humanDoes: ["Acts on the alert: calls agency, adjusts roster"],
    stakes: "AN-ACC funding risk + regulatory exposure across every reporting period. Only 45.9% of services meeting both targets nationally.",
  },
  {
    n: "03", role: "Quality Lead", title: "Submit QI without the quarterly scramble",
    hook: "The GPMS window opens. Someone has to pull 14 indicator domains from three systems.", accent: C.good,
    chrisDoes: [
      "Aggregates all 14 QI domains from connected clinical systems",
      "Flags data quality anomalies before submission",
      "Prepares the GPMS-ready submission package",
      "Notifies Quality Lead when ready for review",
    ],
    humanDoes: ["Reviews the submission", "Confirms and submits to ACQSC"],
    stakes: "Regulatory standing, star rating, accreditation readiness.",
  },
  {
    n: "04", role: "Quality Lead", title: "Track corrective actions so nothing falls through",
    hook: "A corrective action was opened six weeks ago. Nobody knows who owns it.", accent: C.dark,
    chrisDoes: [
      "Creates corrective actions from incidents, audits, or ACQSC findings",
      "Assigns owner, sets deadline, tracks status continuously",
      "Escalates overdue actions via iMessage to responsible leader",
      "Populates the evidence register automatically as actions close",
    ],
    humanDoes: ["Executes the corrective action", "Confirms completion"],
    stakes: "Audit readiness, accreditation, regulatory standing.",
  },
  {
    n: "05", role: "DON", title: "Give every leader their Monday briefing",
    hook: "Sunday night. Someone has to pull together what's happening across the facility.", accent: C.good,
    chrisDoes: [
      "Synthesises care minutes, SIRS status, workforce signals, and compliance data",
      "Generates a role-specific briefing for every leader (DON, CFO, WHS Lead, Team Leaders)",
      "Queues 3 specific actions with context and evidence",
      "Delivers via iMessage link before Monday morning",
    ],
    humanDoes: ["Reads the briefing", "Runs the week"],
    stakes: "3 hours per leader per week returned. 1,872 hours/year across a 12-leader facility.",
  },
  {
    n: "06", role: "CEO", title: "Produce board and committee packs from live data",
    hook: "Three days before the board meeting. Five systems. One Sunday lost.", accent: C.dark,
    chrisDoes: [
      "Assembles all 8 board pack sections from the canonical data layer",
      "Drafts the executive narrative, risk register, and decisions required",
      "Generates Quality & Risk, Finance, Clinical Governance, and P&C committee packs",
      "Notifies CEO when ready. Average review time under 30 minutes",
    ],
    humanDoes: ["Reviews the pack", "Approves and distributes"],
    stakes: "8 hours per pack returned to leadership per month.",
  },
  {
    n: "07", role: "WHS Lead", title: "Know which workforce risks are real before they become incidents",
    hook: "Three staff resigned in the same wing in four weeks. Nobody connected the signals.", accent: C.copper,
    chrisDoes: [
      "Runs fortnightly pulse survey across all teams, 16 PSH domains",
      "Correlates pulse signals with rostering, incident, and HR data",
      "Confirms real hazards vs noise using convergence detection",
      "Recommends a specific micro-practice for the team leader to implement",
    ],
    humanDoes: ["Delivers the practice", "Captures the outcome"],
    stakes: "Standard 2 compliance + >$1M penalty exposure across Victorian and NSW PSH regulations.",
  },
  {
    n: "08", role: "CFO", title: "Optimise AN-ACC funding without a consultant",
    hook: "Your revenue per bed is 8% below sector average. Nobody knows why.", accent: C.warm,
    chrisDoes: [
      "Monitors resident classifications continuously against AN-ACC funding rules",
      "Identifies reclassification opportunities before the quarter closes",
      "Benchmarks your funding performance against StewartBrown sector data",
      "Surfaces revenue uplift alerts with specific detail",
    ],
    humanDoes: ["Reviews opportunities", "Initiates reclassification with clinical team"],
    stakes: "$14K+ annual revenue uplift per facility at current pilot scale.",
  },
  {
    n: "09", role: "CEO", title: "See what's coming before it hits",
    hook: "A complaint pattern built for six weeks. In hindsight, the signals were there.", accent: C.dark,
    chrisDoes: [
      "Monitors patterns across clinical, workforce, financial, and compliance data simultaneously",
      "Detects precursor signatures that match historical incident patterns",
      "Alerts leadership queue before the pattern becomes a crisis",
      "Synthesises cross-domain intelligence into a single weekly Oracle report",
    ],
    humanDoes: ["Reviews the intelligence", "Decides how to act"],
    stakes: "Reputation, regulatory standing, resident safety, board confidence.",
  },
];

const AGENTS = [
  {
    name: "The Sentinel", cadence: "2-hr cycle", domain: "Clinical & compliance vigilance", color: C.good,
    summary: "The always-on orchestrator. Runs the fortnightly cascade: connector pulls, PSH cycle management, briefing generation, alert routing. The heartbeat of Chris.",
    watches: ["Care minutes compliance (215/44 targets)", "SIRS incident classification and deadline tracking", "Regulatory obligation countdowns", "Connector health and data freshness", "PSH convergence detection across wings"],
    delivers: ["Real-time compliance position every 2 hours", "Immediate escalation when thresholds breach", "Priority 1 SIRS alerts within minutes of event", "Connector stale-data warnings before gaps become blind spots"],
    example: "2:14pm. RN calls in sick. Sentinel detects projected care minutes drop to 188/215 within 12 minutes. Alerts DON with agency options priced. Chronicler drafts contingency roster note.",
  },
  {
    name: "The Oracle", cadence: "Weekly", domain: "Revenue & funding intelligence", color: C.copper,
    summary: "Scans AN-ACC classification, accommodation pricing, occupancy, and hotelling for revenue optimisation opportunities. Identifies and quantifies. Never acts without human approval.",
    watches: ["AN-ACC reclassification opportunities", "Accommodation pricing vs market benchmarks", "Occupancy gaps and vacancy cost", "Home care package utilisation rates", "Care minutes supplement entitlement (MM1)"],
    delivers: ["Monthly revenue uplift opportunities quantified in dollars", "Accommodation gap analysis against sector benchmarks", "Vacancy cost per day per bed", "Home care under-spend alerts before quarter-end"],
    example: "Sunday 9pm. Oracle identifies 3 residents whose clinical signals suggest higher AN-ACC classification. Estimated uplift: $11,400/month. Clinical reviews queued for Tuesday.",
  },
  {
    name: "The Steward", cadence: "Daily", domain: "Capacity & operational structure", color: C.good,
    summary: "Reads structural operational patterns: roster architecture gaps, care minutes compliance buffer, training capacity, operational flow. Distinguishes structural problems from one-off gaps.",
    watches: ["Roster architecture and structural gaps", "Shift-by-shift staffing adequacy", "Agency dependency patterns and cost", "Training and credential scheduling capacity", "Overtime concentration and fatigue risk"],
    delivers: ["Structural vs episodic gap classification", "Agency cost projections with permanent-hire alternatives", "Shift-level staffing recommendations", "Overtime alerts before they become WHS incidents"],
    example: "Sunday PM AIN gap detected 6 out of 8 weeks. Steward classifies as structural. Recommends permanent part-time hire. Saving: $4,940/year vs continued agency fill.",
  },
  {
    name: "The Chronicler", cadence: "Event-driven", domain: "Auto-documentation & evidence", color: C.copper,
    summary: "Fires on SIRS events, audit completions, complaints, voice sessions, PSH cycle close, monthly close. Drafts every document the moment the triggering event occurs. Leaders review and approve. Never auto-submits.",
    watches: ["SIRS incidents requiring notification", "Board pack deadlines and governance cycles", "QI submission windows", "Complaint and feedback documentation needs", "Audit evidence gaps"],
    delivers: ["SIRS notification drafts within minutes of classification", "Board packs pre-drafted 8 days before meeting", "QI submissions with evidence compiled", "Corrective action plans with regulatory cross-references"],
    example: "Fall logged at 11:04pm Friday. Sentinel classifies as SIRS Priority 1. Chronicler drafts the notification within 4 minutes. DON reviews on their phone Saturday morning. Submitted before the 24-hour deadline.",
  },
  {
    name: "The Keeper", cadence: "Fortnightly", domain: "Workforce intelligence & people health", color: C.warm,
    summary: "Owns the full workforce intelligence layer: culture health, engagement signals, retention risk, Leader Loop outcomes, PSH trend analysis, team dynamics, and ISO 45003 compliance evidence generation.",
    watches: ["16 PSH domains (ISO 45003) per team per cycle", "Turnover precursor signals (71% probability model)", "Absenteeism patterns and clustering", "AHPRA/credential expiry windows", "Leave liability accrual thresholds", "Leader Loop engagement and participation"],
    delivers: ["PSH convergence alerts when multiple hazards compound", "Turnover probability scores with intervention recommendations", "Micro-practice prescriptions matched to specific signals", "Team briefing content tailored to current PSH state", "WHS compliance evidence generated automatically"],
    example: "PSH_13 (Role Clarity) declining 3 cycles in Camelot team. Keeper flags 71% turnover probability. Root cause: new rostering system rollout. Prescribes role-clarity micro-practice for next team briefing.",
  },
  {
    name: "The Town Crier", cadence: "Continuous", domain: "Signal coordination & clarity", color: C.inkMutedLight,
    summary: "The coordination layer. When multiple agents detect related signals, Town Crier merges them into a single coherent insight. Prevents alert fatigue by combining related findings and routing the unified message to the right leader.",
    watches: ["Cross-agent signal overlap", "Alert volume and leader attention capacity", "Briefing compilation windows", "Escalation chains and routing logic"],
    delivers: ["Merged insights from 2+ agents into single actionable items", "Monday briefings compiled from all agent findings", "Role-appropriate routing: DON sees clinical, CFO sees financial", "De-duplicated alert streams that respect attention bandwidth"],
    example: "Steward detects overtime spike + Keeper detects fatigue PSH signal in same wing. Town Crier merges into one escalation: 'Grevillea Wing, overtime-driven fatigue risk. Two agents confirm.' Routed to DON as combined risk.",
  },
  {
    name: "The Curator", cadence: "2-hr cycle", domain: "Sector intelligence & regulatory watch", color: C.inkMutedLight,
    summary: "Monitors the external landscape: regulatory changes, sector news, compliance updates, funding announcements. Ensures Chris and your leadership team are never caught off-guard by a change in the operating environment.",
    watches: ["ACQSC regulatory updates and enforcement actions", "Department of Health funding announcements", "Aged Care Act amendments and subordinate instruments", "State WHS regulator bulletins", "Sector media and industry body publications"],
    delivers: ["Regulatory change alerts with impact assessment", "Sector news digest filtered to your care type", "Compliance obligation updates before they take effect", "Enforcement action pattern analysis across the sector"],
    example: "ACQSC publishes new guidance on psychosocial risk documentation. Curator flags within 2 hours. Impact assessment: your current PSH evidence satisfies 6 of 7 new requirements. Gap: worker consultation record needs updating, 2-minute fix.",
  },
];

const EXECUTION = [
  { icon: "✦", title: "Documents drafted", body: "SIRS notifications, QI submissions, corrective action plans, board packs. Written by Chris within minutes of the triggering event, reviewed and approved by you." },
  { icon: "⬡", title: "Actions queued", body: "Chris prioritises what needs your attention today. Not a list of 40 alerts: a ranked queue of 3 actions with context, evidence, and a single button to act." },
  { icon: "→", title: "Leaders briefed", body: "Every leader in your organisation receives a briefing tailored to their role (DON, CFO, Facility Manager, WHS Lead) before they walk in the door." },
  { icon: "↗", title: "Delivered via iMessage", body: "Chris reaches leaders where they already are. Not another portal to log into: a message on your phone with a link to act, approve, or respond." },
];

const ROLES = [
  { title: "CEO & Executive", desc: "Portfolio health, strategic risk, board reporting, sector benchmarking" },
  { title: "Director of Nursing", desc: "Care minutes, SIRS, clinical compliance, roster position, incident status" },
  { title: "Facility Manager", desc: "Operational architecture, staffing gaps, corrective actions, financial position" },
  { title: "CFO & Finance", desc: "AN-ACC revenue, care ratio, agency cost, benchmark comparison, financial risk" },
  { title: "WHS & Quality Lead", desc: "Psychosocial hazard status, convergence signals, ISO 45003 evidence trail" },
  { title: "Team Leaders", desc: "Team briefings, micro-practice recommendations, workforce health signals" },
];

// ─── Typography: Ironstone system ───────────────────────────────────────────
// Fraunces for headlines + italic emphasis. Inter for body + UI.
// Font stacks with commercial-face upgrade path.
const serif = "'GT Sectra Display', 'Fraunces', 'Iowan Old Style', Georgia, serif";
const sans = "'Söhne', 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif";
// Keep legacy aliases so existing components don't break
const fraunces = serif;
const inter = sans;

// Section eyebrow: Fraunces italic in sage (used on all sections EXCEPT hero)
function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[17px] mb-3" style={{ fontFamily: serif, fontStyle: "italic", letterSpacing: "-0.01em", color: C.sage }}>{children}</p>;
}

// ─── Components ─────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-sm" style={{ backgroundColor: "rgba(243,239,230,0.94)", borderBottom: `1px solid ${C.ruleCharcoal}` }}>
      <div className="max-w-[1240px] mx-auto flex items-center justify-between px-6 lg:px-14 py-3">
        <Link href="/v2" className="text-[15px] font-medium tracking-tight" style={{ fontFamily: sans, color: C.text }}>
          Chris<span style={{ color: C.ironstone }}>·</span>OS
        </Link>
        <div className="flex items-center gap-5">
          <a href="#what-chris-is" className="text-[13px] hidden lg:block hover:opacity-70" style={{ fontFamily: sans, color: C.textMuted }}>What Chris is</a>
          <a href="#tools" className="text-[13px] hidden lg:block hover:opacity-70" style={{ fontFamily: sans, color: C.textMuted }}>Your numbers</a>
          <a href="#how-it-works" className="text-[13px] hidden lg:block hover:opacity-70" style={{ fontFamily: sans, color: C.textMuted }}>How it works</a>
          <a href="#book" className="text-[14px] font-medium px-[20px] py-[12px]" style={{ fontFamily: sans, backgroundColor: C.ctaBg, color: C.ctaText, transition: "background 200ms" }}>
            Book a conversation
          </a>
        </div>
      </div>
    </nav>
  );
}

function HeroiPhone({ mobile }: { mobile?: boolean }) {
  const w = mobile ? 200 : 280;
  const h = mobile ? 414 : 582;
  const tilt = mobile ? -2 : -4;
  const r = mobile ? 40 : 56;
  const ir = r - 4;
  const dr = ir - 4;
  const ss = "'SF Pro Display', -apple-system, system-ui, sans-serif";

  return (
    <figure aria-label="Team briefing artefact" className="relative" style={{ padding: mobile ? 24 : 48 }}>
      {/* Morning warmth radial gradient */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 75% 25%, rgba(212,168,83,0.18) 0%, rgba(212,168,83,0.08) 25%, rgba(212,168,83,0.03) 45%, transparent 65%)" }} />

      <figcaption className="sr-only">Sarah Mitchell's Team Briefing for Monday morning, Cycle 8, delivered at 6:47am. Voice down 18% in the afternoon shift, two new starters without supervision, trust holding above sector. Three micro-practices for the fortnight.</figcaption>

      {/* Phone chassis */}
      <div className="relative z-10 transition-transform duration-600 hover:rotate-[-2deg]" style={{ width: w, height: h, borderRadius: r, background: "linear-gradient(135deg, #C8C8CA 0%, #A8A8AA 50%, #C8C8CA 100%)", padding: 4, transform: `rotate(${tilt}deg)`, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15), inset 0 0 0 2px rgba(0,0,0,0.05), 0 20px 60px rgba(0,0,0,0.12)" }}>

        {/* Side buttons (subtle) */}
        <div className="absolute" style={{ right: -2, top: "25%", width: 3, height: mobile ? 36 : 50, borderRadius: 2, background: "linear-gradient(180deg, #B0B0B2, #909092)" }} />
        <div className="absolute" style={{ left: -2, top: "18%", width: 3, height: mobile ? 16 : 22, borderRadius: 2, background: "#A0A0A2" }} />
        <div className="absolute" style={{ left: -2, top: "24%", width: 3, height: mobile ? 28 : 38, borderRadius: 2, background: "#A0A0A2" }} />
        <div className="absolute" style={{ left: -2, top: "32%", width: 3, height: mobile ? 28 : 38, borderRadius: 2, background: "#A0A0A2" }} />

        {/* Inner bezel */}
        <div style={{ width: "100%", height: "100%", borderRadius: ir, background: "#0A0A0A", padding: 0, overflow: "hidden" }}>
          {/* Display */}
          <div className="relative" style={{ width: "100%", height: "100%", borderRadius: dr, background: "#fff", overflow: "hidden" }}>

            {/* Dynamic Island */}
            <div className="absolute z-20" style={{ top: mobile ? 10 : 14, left: "50%", transform: "translateX(-50%)", width: mobile ? 72 : 100, height: mobile ? 22 : 30, borderRadius: mobile ? 13 : 18, background: "#0A0A0A" }}>
              <div className="absolute rounded-full" style={{ right: mobile ? 14 : 20, top: "50%", transform: "translateY(-50%)", width: mobile ? 6 : 8, height: mobile ? 6 : 8, background: "#1A1A1A" }}>
                <div className="absolute rounded-full" style={{ top: "30%", left: "30%", width: 3, height: 3, background: "#3A3A3A" }} />
              </div>
            </div>

            {/* Status bar */}
            <div className="absolute z-10 flex items-center justify-between px-4" style={{ top: mobile ? 10 : 16, left: 0, right: 0, height: mobile ? 20 : 24 }}>
              <span style={{ fontFamily: ss, fontSize: mobile ? 12 : 16, fontWeight: 600, color: "#0E0E0E" }}>6:47</span>
              <div className="flex items-center gap-1">
                {/* Signal bars */}
                <svg width={mobile ? 12 : 16} height={mobile ? 9 : 12} viewBox="0 0 16 12" fill="#0E0E0E">
                  <rect x="0" y="9" width="3" height="3" rx="0.5" /><rect x="4.5" y="6" width="3" height="6" rx="0.5" /><rect x="9" y="3" width="3" height="9" rx="0.5" /><rect x="13.5" y="0" width="2.5" height="12" rx="0.5" />
                </svg>
                {/* WiFi */}
                <svg width={mobile ? 12 : 14} height={mobile ? 10 : 12} viewBox="0 0 14 12" fill="none" stroke="#0E0E0E" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M1 4c3.5-3 8.5-3 12 0" /><path d="M3.5 7c2-2 5-2 7 0" /><circle cx="7" cy="10.5" r="1" fill="#0E0E0E" stroke="none" />
                </svg>
                {/* Battery */}
                <svg width={mobile ? 18 : 22} height={mobile ? 9 : 11} viewBox="0 0 22 11">
                  <rect x="0.5" y="0.5" width="18" height="10" rx="2" fill="none" stroke="#0E0E0E" strokeWidth="1" />
                  <rect x="2" y="2" width="13" height="7" rx="1" fill="#0E0E0E" />
                  <rect x="19.5" y="3" width="2" height="5" rx="1" fill="#0E0E0E" opacity="0.4" />
                </svg>
              </div>
            </div>

            {/* Briefing content */}
            <div className="absolute inset-0 overflow-hidden" style={{ top: mobile ? 36 : 50 }}>
              {/* Header band */}
              <div style={{ padding: mobile ? "8px 12px" : "12px 16px", background: C.forest }}>
                <p style={{ fontFamily: inter, fontSize: mobile ? 6 : 8, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)", marginBottom: 2 }}>Team Briefing · Sarah Mitchell</p>
                <p style={{ fontFamily: inter, fontSize: mobile ? 9 : 12, fontWeight: 500, color: "#fff" }}>Mt Gibraltar · Cycle 8 · Monday</p>
              </div>

              {/* CHRIS Insight */}
              <div style={{ padding: mobile ? "8px 12px" : "12px 16px", borderBottom: "0.5px solid rgba(15,23,42,0.06)" }}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="rounded-full flex items-center justify-center shrink-0" style={{ width: mobile ? 10 : 14, height: mobile ? 10 : 14, background: `linear-gradient(135deg, ${C.forest} 0%, ${C.gold} 100%)` }}>
                    <span style={{ color: "#fff", fontSize: mobile ? 5 : 8, fontWeight: 500 }}>C</span>
                  </div>
                  <span style={{ fontFamily: inter, fontSize: mobile ? 6 : 8, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase", color: "#5A5A57" }}>Chris Insight</span>
                </div>
                <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: mobile ? 9 : 12, lineHeight: 1.4, fontStyle: "italic", color: "#0E0E0E" }}>Your team's voice is under strain. Pattern matches December.</p>
              </div>

              {/* What's Showing Up */}
              <div style={{ padding: mobile ? "6px 12px" : "10px 16px", borderBottom: "0.5px solid rgba(15,23,42,0.06)" }}>
                <p style={{ fontFamily: inter, fontSize: mobile ? 6 : 8, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase", color: "#5A5A57", marginBottom: mobile ? 4 : 6 }}>What's showing up</p>
                {[
                  { bar: "#BA7517", text: "Voice down 18% afternoon shift" },
                  { bar: "#BA7517", text: "Two new starters · no supervision" },
                  { bar: "#1F6F66", text: "Trust holding above sector" },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-1.5 mb-1">
                    <div style={{ width: 2.5, height: mobile ? 10 : 14, borderRadius: 2, background: row.bar, flexShrink: 0 }} />
                    <p style={{ fontFamily: inter, fontSize: mobile ? 7.5 : 10, color: "#0E0E0E", lineHeight: 1.3 }}>{row.text}</p>
                  </div>
                ))}
              </div>

              {/* Three Micro-Practices */}
              <div style={{ padding: mobile ? "6px 12px" : "10px 16px" }}>
                <p style={{ fontFamily: inter, fontSize: mobile ? 6 : 8, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase", color: "#5A5A57", marginBottom: mobile ? 4 : 6 }}>Three micro-practices</p>
                {[
                  "Open the next huddle with a check-in",
                  "15-min supervision with each new starter",
                  "Name workload pressure in next message",
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-1 mb-1">
                    <span style={{ fontFamily: inter, fontSize: mobile ? 7.5 : 10, color: "#5A5A57", flexShrink: 0 }}>{i + 1}.</span>
                    <p style={{ fontFamily: inter, fontSize: mobile ? 7.5 : 10, color: "#0E0E0E", lineHeight: 1.4 }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}

function Hero() {
  return (
    <section style={{ backgroundColor: C.paper }}>
      <div className="max-w-[1240px] mx-auto px-6 lg:px-14">
        {/* Filed-at byline */}
        <div className="flex items-center gap-[14px] pt-14 pb-8">
          <span className="text-[10.5px] font-semibold tracking-[0.22em] uppercase" style={{ fontFamily: sans, color: C.ironstone }}>Filed Monday · NSW &amp; VIC · Cohort live</span>
          <div className="flex-1 h-px max-w-[280px]" style={{ backgroundColor: C.ruleIronstone }} />
        </div>

        {/* Two-column: headline left, image right */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12 mb-10">
          {/* Left: headline + subhead + CTAs */}
          <div className="flex-1 min-w-0">
            <h1 className="mb-8" style={{ fontFamily: serif, fontSize: "clamp(56px, 7.5vw, 92px)", lineHeight: 1.0, letterSpacing: "-0.028em", fontWeight: 400, color: C.text }}>
              <span className="block">Hold quality.</span>
              <span className="block">Protect margin.</span>
              <span className="block">Lead with confidence.</span>
            </h1>

            <p className="max-w-[560px] mb-10" style={{ fontFamily: sans, fontSize: "clamp(17px, 1.6vw, 20px)", lineHeight: 1.5, fontWeight: 400, color: C.textSoft }}>
              Operational intelligence for Australian aged care and NDIS.{" "}
              <em style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 400, fontSize: "1.05em", color: C.ironstone }}>Run the morning before the morning.</em>{" "}
              Chris reads every system you already run, drafts the work your team would otherwise stitch together by hand, and keeps your leaders ahead of compliance and cost.
            </p>

            <div className="flex items-center gap-7 flex-wrap">
              <a href="#book" className="inline-block text-[15px] font-medium px-[30px] py-[17px] transition-colors duration-200 hover:bg-[#8b3a32]" style={{ fontFamily: sans, backgroundColor: C.ctaBg, color: C.ctaText, textDecoration: "none" }}>
                Book 30 minutes with Campbell →
              </a>
              <a href="#how-it-works" className="text-[15px] font-medium pb-[3px] hover:border-[#1a1a1a]" style={{ fontFamily: sans, color: C.text, textDecoration: "none", borderBottom: "1px solid rgba(26,26,26,0.4)" }}>
                How Chris works, layer by layer
              </a>
            </div>
          </div>

          {/* Right: iPhone mockup with Team Briefing */}
          <div className="hidden lg:flex lg:w-[340px] shrink-0 items-center justify-center">
            <HeroiPhone />
          </div>
        </div>

        {/* Mobile phone mockup */}
        <div className="lg:hidden flex justify-center mb-10">
          <HeroiPhone mobile />
        </div>

        {/* Trust strip */}
        <div className="pb-14" style={{ borderTop: `1px solid ${C.ruleCharcoal}`, paddingTop: 36 }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[1040px]">
            {[
              { label: "Live cohort", value: "Harbison Care · Kinyara Health · 365 Care · Homewell" },
              { label: "Pilot pricing", value: "From $15,000. Partner-rate while we build in the open." },
              { label: "Australian residency", value: "Sydney region · australia-southeast1" },
              { label: "Human approved", value: "Every regulatory submission, by a named leader" },
            ].map((item) => (
              <div key={item.label}>
                <span className="block text-[10px] font-semibold tracking-[0.18em] uppercase mb-2" style={{ fontFamily: sans, color: C.ironstone }}>{item.label}</span>
                <span className="text-[13.5px] leading-[1.55]" style={{ fontFamily: sans, color: C.textSoft }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AgentRibbon() {
  const items = [
    { agent: "SENTINEL", color: C.teal, text: "Care minutes at 180. RN gap detected. Afternoon shift unfilled." },
    { agent: "ORACLE", color: C.amber, text: "3 AN-ACC reclassification opportunities. $11.4K/month identified." },
    { agent: "STEWARD", color: C.teal, text: "Sunday PM structural gap confirmed. 7th consecutive week." },
    { agent: "CHRONICLER", color: C.red, text: "SIRS Priority 1 draft ready. Awaiting DON review." },
    { agent: "KEEPER", color: C.amber, text: "Turnover precursor detected. Grevillea Wing. PSH_13 declining." },
    { agent: "TOWN CRIER", color: C.teal, text: "Oracle + Steward merged. 1 coordinated recommendation delivered." },
    { agent: "CURATOR", color: C.teal, text: "ACQSC compliance decision published. 2 new regulatory updates." },
  ];
  const doubled = [...items, ...items];

  return (
    <div style={{ backgroundColor: C.canvas, borderTop: `0.5px solid ${C.border}`, borderBottom: `0.5px solid ${C.border}` }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 overflow-hidden">
        <div className="flex items-center h-10 animate-ticker whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-[11px] mx-6 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="font-medium uppercase tracking-[0.06em] text-[10px]" style={{ color: C.text }}>{item.agent}</span>
            <span style={{ color: C.textFaint }}>·</span>
            <span style={{ color: C.textMuted }}>{item.text}</span>
          </span>
        ))}
        </div>
      </div>
    </div>
  );
}

// ── "What Chris is" architecture section ─────────────────────────────────────
const ARCH_ROLES = ["CEO", "COO", "DON", "Quality Lead", "WHS Lead", "Team Leader", "Facility Manager"];
const ARCH_AGENTS = [
  { name: "Sentinel", verb: "monitors", color: C.good },
  { name: "Chronicler", verb: "drafts", color: C.copper },
  { name: "Oracle", verb: "recommends", color: C.copper },
  { name: "Keeper", verb: "protects", color: C.warn },
  { name: "Steward", verb: "optimises", color: C.good },
];
const ARCH_SYSTEMS = [
  { name: "Leecare", color: "#464fa1" }, { name: "AutumnCare", color: "#4a8c5c" },
  { name: "PCS", color: "#00B28C" }, { name: "eCase", color: "#9966cc" },
  { name: "Carelink+", color: "#1a3a6b" }, { name: "Humanforce", color: "#50B848" },
  { name: "Manad+", color: "#009EFF" }, { name: "Xero", color: "#13B5EA" },
  { name: "Deputy", color: "#0c017b" }, { name: "EH", color: "#7622D7" },
  { name: "ELMO", color: "#2b5ea7" }, { name: "RiskMan", color: "#c0392b" },
];

// ── Timeline events (people-layer work, aligned to what is live today) ───────
const TIMELINE = [
  { time: "02:47", agent: "Sentinel", verb: "monitors", action: "Read pulse cycle 8 overnight. Detected sentiment drift in the afternoon shift team.", color: "#BA7517", filled: false },
  { time: "04:38", agent: "Keeper", verb: "protects", action: "Reviewed the PSH register. Two intervention review dates this week.", color: "#BA7517", filled: false },
  { time: "05:12", agent: "Oracle", verb: "recommends", action: "Surfaced workload and voice convergence. Pattern matches December cycle.", color: "#BA7517", filled: false, badge: 1 },
  { time: "05:33", agent: "Chronicler", verb: "drafts", action: "Drafted Sarah's team briefing. Pulse summary, three micro-practices, conversation guide.", color: "#BA7517", filled: false, badge: 2 },
  { time: "06:14", agent: "Steward", verb: "assembles", action: "Assembled and released to Sarah's phone before the huddle.", color: "#1F6F66", filled: false, badge: 3 },
  { time: "06:47", agent: "Delivered", verb: "→", action: "Sarah opens her team briefing.", color: "#1F6F66", filled: true, climax: true },
];

function WhatChrisIsSection() {

  const teal = "#1F6F66";
  const amber = "#BA7517";
  const red = "#A32D2D";
  const textPrimary = "#0E0E0E";
  const textSecondary = "#5A5A57";
  const canvas = C.canvasLight;
  const borderDefault = "rgba(15,23,42,0.08)";

  function Badge({ n }: { n: number }) {
    return <span className="w-[14px] h-[14px] rounded-full flex items-center justify-center text-[9px] font-medium shrink-0" style={{ backgroundColor: "#E1F5EE", color: teal }}>{n}</span>;
  }

  return (
    <section id="what-chris-is" style={{ backgroundColor: canvas }}>
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-14 lg:py-18">
        {/* Header */}
        <div className="mb-8 lg:mb-10">
          <p className="text-[17px] mb-3" style={{ fontFamily: fraunces, fontStyle: "italic", letterSpacing: "-0.01em", color: teal }}>What Chris is</p>
          <h2 className="mb-3 max-w-[700px]" style={{ fontSize: "clamp(34px, 4vw, 48px)", lineHeight: 1.08, letterSpacing: "-0.025em", fontWeight: 400, fontFamily: serif, color: textPrimary }}>
            A <span style={{ fontStyle: "italic" }}>morning</span> at Mt Gibraltar Gardens.
          </h2>
          <p className="text-[12.5px] leading-[1.55] max-w-[520px]" style={{ color: textSecondary }}>
            Monday morning. While Sarah&apos;s team finished the night shift, Chris built her team briefing. The agents that built it are on the left. The artefact she opened before the morning huddle is on the right.
          </p>
        </div>

        {/* Two-column body */}
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-5">
          {/* Left: Timeline */}
          <div className="w-full lg:w-[240px] shrink-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.08em] mb-4" style={{ color: teal }}>Overnight. Built by</p>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[42px] top-2 bottom-2 w-px" style={{ backgroundColor: "rgba(15,23,42,0.12)" }} />

              <div className="space-y-4">
                {TIMELINE.map((ev, i) => (
                  <div key={i} className="flex items-start gap-2.5 relative">
                    {/* Timestamp */}
                    <span className={`text-[10px] tabular-nums text-right shrink-0 mt-0.5 ${ev.climax ? "font-medium" : ""}`}
                      style={{ width: 30, color: ev.climax ? textPrimary : textSecondary }}>{ev.time}</span>

                    {/* Badge (if any) sits left of dot */}
                    <div className="relative flex items-start">
                      {ev.badge && <div className="absolute -left-[18px] top-0"><Badge n={ev.badge} /></div>}
                      {/* Dot */}
                      <span className="shrink-0 mt-1 rounded-full z-10"
                        style={{
                          width: ev.climax ? 11 : 9, height: ev.climax ? 11 : 9,
                          backgroundColor: ev.filled ? ev.color : canvas,
                          border: ev.filled ? "none" : `1.5px solid ${ev.color}`,
                        }} />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] leading-none mb-0.5">
                        <span className="font-medium uppercase tracking-[0.06em]" style={{ color: textPrimary }}>{ev.agent}</span>
                        {ev.verb !== "→" && <span style={{ color: textSecondary }}> · {ev.verb}</span>}
                        {ev.verb === "→" && <span style={{ color: teal }}> →</span>}
                      </p>
                      <p className={`text-[11px] leading-[1.45] ${ev.climax ? "font-medium" : ""}`}
                        style={{ color: ev.climax ? textPrimary : textSecondary }}>{ev.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Team Briefing artefact (people-layer, what is live today) */}
          <div className="flex-1 min-w-[300px]">
            <div className="rounded-[5px] overflow-hidden" style={{ backgroundColor: "#fff", border: `0.5px solid ${borderDefault}`, boxShadow: "0 0 0 4px rgba(31,111,102,0.08)" }}>
              {/* Forest header */}
              <div className="px-4 py-3" style={{ backgroundColor: "#1B4332" }}>
                <p className="text-[9px] font-medium uppercase tracking-[0.08em] mb-0.5" style={{ color: "rgba(255,255,255,0.85)" }}>Team Briefing · Sarah Mitchell, Team Leader</p>
                <p className="text-[13px] font-medium" style={{ color: "#ffffff" }}>Mt Gibraltar Gardens · Cycle 8 · Monday morning</p>
              </div>

              {/* Chris Insight */}
              <div className="px-4 py-3 relative" style={{ borderBottom: `0.5px solid ${borderDefault}` }}>
                <div className="absolute top-3 right-3"><Badge n={1} /></div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #1B4332 0%, #D4A853 100%)" }}>
                    <span className="text-white text-[9px] font-medium">C</span>
                  </div>
                  <span className="text-[9px] font-medium uppercase tracking-[0.08em]" style={{ color: textSecondary }}>Chris Insight</span>
                </div>
                <p className="text-[13px] leading-[1.4] italic" style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: textPrimary }}>
                  Your team&apos;s voice is under strain. The pattern matches what we saw in December: workload up, voice scores down, two new starters without supervision.
                </p>
              </div>

              {/* What's Showing Up */}
              <div className="px-4 py-3" style={{ borderBottom: `0.5px solid ${borderDefault}` }}>
                <p className="text-[9px] font-medium uppercase tracking-[0.08em] mb-2.5" style={{ color: textSecondary }}>What&apos;s showing up</p>
                <div className="space-y-2">
                  {[
                    { bar: amber, text: "Voice scores down 18% in the afternoon shift.", badge: null },
                    { bar: amber, text: "Two new starters without their first supervision yet.", badge: null },
                    { bar: teal, text: "Trust in leadership holding above sector benchmark.", badge: null },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-[3px] h-4 rounded-full shrink-0" style={{ backgroundColor: row.bar }} />
                      <p className="text-[11px] leading-[1.4] flex-1" style={{ color: textPrimary }}>{row.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Three Micro-Practices This Fortnight */}
              <div className="px-4 py-3 relative">
                <div className="absolute top-3 right-3"><Badge n={2} /></div>
                <p className="text-[9px] font-medium uppercase tracking-[0.08em] mb-2.5" style={{ color: textSecondary }}>Three micro-practices this fortnight</p>
                <div className="space-y-1.5">
                  {[
                    "Open the next huddle with one specific check-in question for the afternoon team.",
                    "Run a 15-minute supervision with each new starter this week.",
                    "Name the workload pressure in your next team message.",
                  ].map((action, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[11px] tabular-nums shrink-0 mt-px" style={{ color: textSecondary }}>{i + 1}.</span>
                      <p className="text-[11px] leading-[1.4]" style={{ color: textPrimary }}>{action}</p>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-3 right-3"><Badge n={3} /></div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer line */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 pt-4 gap-2" style={{ borderTop: `0.5px solid rgba(15,23,42,0.08)` }}>
          <p className="text-[11px]" style={{ color: textSecondary }}>
            This morning&apos;s briefing assembled itself overnight. The agents above are the cast for this scene.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-[7px] h-[7px] rounded-full animate-pulse" style={{ backgroundColor: teal }} />
            <span className="text-[11px]" style={{ color: textSecondary }}>Live with Harbison Care, Kinyara Health, 365 Care, Homewell. Cross-domain agents in build for clinical, workforce, finance, compliance and governance.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ToolsStrip() {
  return (
    <section id="tools" style={{ backgroundColor: C.canvas }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-14 lg:py-18">
        {/* Header */}
        <div className="max-w-[560px] mb-10">
          <p className="text-[17px] mb-3" style={{ fontFamily: fraunces, fontStyle: "italic", letterSpacing: "-0.01em", color: C.teal }}>
            See your own numbers
          </p>
          <h2 className="mb-3" style={{ fontSize: "clamp(34px, 4vw, 48px)", lineHeight: 1.08, letterSpacing: "-0.025em", fontWeight: 500, color: C.text }}>
            Run these on your facility. No email required.
          </h2>
          <p className="text-[14px] leading-[1.6] mb-2" style={{ color: C.textMuted }}>
            Each one models a question on the agenda of every aged care board right now: supplement exposure, psychosocial obligations, the cost of workforce instability, and the state of your leadership pipeline.
          </p>
          <p className="text-[13px] leading-[1.6]" style={{ color: C.textFaint }}>
            Built on the same intelligence layer Chris runs on. The numbers you see are the numbers we would model on day one.
          </p>
        </div>

        {/* Tool cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOOLS.map((tool) => (
            <Link key={tool.title} href={tool.href}
              className="group rounded-[5px] overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
              style={{ backgroundColor: C.card, border: `0.5px solid ${C.border}` }}>
              <div className="h-[2px]" style={{ backgroundColor: tool.accent }} />

              <div className="p-4">
                {/* Stat */}
                <div className="flex items-baseline justify-between mb-3">
                  <p className="text-[28px] font-medium tracking-[-0.02em] leading-none" style={{ color: tool.accent }}>{tool.stat}</p>
                  <div className="w-9 h-9 rounded-[5px] flex items-center justify-center" style={{ backgroundColor: `${tool.accent}10` }}>
                    {tool.icon}
                  </div>
                </div>

                <p className="text-[10px] mb-3 leading-relaxed" style={{ color: C.textFaint }}>{tool.statLabel}</p>

                <h3 className="text-[14px] font-medium mb-1 leading-snug" style={{ color: C.text }}>{tool.title}</h3>
                <p className="text-[12px] leading-[1.55] mb-4" style={{ color: C.textMuted }}>{tool.blurb}</p>

                <span className="text-[12px] font-medium group-hover:underline" style={{ color: tool.accent }}>{tool.cta}</span>
              </div>
            </Link>
          ))}
        </div>

        <p className="text-[11px] mt-6" style={{ color: C.textFaint }}>
          No email required. No demo. Just your numbers.
        </p>
      </div>
    </section>
  );
}

const INTEGRATIONS = [
  { name: "Leecare", sub: "Clinical & Care Planning", color: "#464fa1", wordmark: "Leecare", wordmarkSize: "14px", fontWeight: 700 },
  { name: "AutumnCare", sub: "Clinical", color: "#4a8c5c", wordmark: "autumn", wordmarkSize: "15px", letterSpacing: "0.04em", fontWeight: 500 },
  { name: "Person Centred Software", sub: "Clinical", color: "#00B28C", wordmark: "PCS", wordmarkSize: "18px", fontWeight: 700 },
  { name: "eCase", sub: "Compliance", color: "#9966cc", color2: "#007ba7", wordmark: "eCase", wordmarkSize: "14px", fontWeight: 600 },
  { name: "Carelink+", sub: "Resident Management", color: "#1a3a6b", wordmark: "Carelink+", wordmarkSize: "12px", fontWeight: 600 },
  { name: "Humanforce", sub: "Workforce & Rostering", color: "#50B848", color2: "#3C479D", wordmark: "hf", wordmarkSize: "20px", fontWeight: 800 },
  { name: "Manad Plus", sub: "Operations", color: "#009EFF", color2: "#00004B", wordmark: "manad+", wordmarkSize: "13px", fontWeight: 700 },
  { name: "Xero", sub: "Finance", color: "#13B5EA", wordmark: "xero", wordmarkSize: "18px", letterSpacing: "0.02em", fontWeight: 700 },
  { name: "Deputy", sub: "Rostering & Time", color: "#0c017b", color2: "#37cfcd", wordmark: "Deputy", wordmarkSize: "13px", fontWeight: 600 },
  { name: "Employment Hero", sub: "HR & Payroll", color: "#7622D7", wordmark: "EH", wordmarkSize: "20px", fontWeight: 800 },
  { name: "ELMO", sub: "HR & Payroll", color: "#2b5ea7", wordmark: "ELMO", wordmarkSize: "16px", letterSpacing: "0.08em", fontWeight: 800 },
  { name: "RiskMan", sub: "Incident Management", color: "#c0392b", wordmark: "RiskMan", wordmarkSize: "11px", fontWeight: 700 },
];

function IntegrationsSection() {
  return (
    <section style={{ backgroundColor: C.canvas, borderTop: "1px solid rgba(26,18,24,0.04)" }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-14 lg:py-20">
        <div className="text-center mb-10">
          <p className="text-[11px] font-medium tracking-[0.12em] uppercase mb-3" style={{ color: C.good }}>Integrations</p>
          <h2 className="mb-3" style={{ fontSize: "clamp(34px, 4vw, 48px)", lineHeight: 1.08, letterSpacing: "-0.025em", fontWeight: 400, color: C.text }}>
            Reads what you already run
          </h2>
          <p className="text-[15px] leading-[1.7] max-w-lg mx-auto" style={{ color: C.inkMutedLight }}>
            No migration. No re-platforming. Chris connects to the systems your teams use today.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {INTEGRATIONS.map((int) => (
            <div key={int.name} className="group flex flex-col items-center gap-3 px-3 py-5 rounded-2xl transition-all duration-300 hover:-translate-y-1"
              style={{ backgroundColor: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)" }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: int.color2 ? `linear-gradient(135deg, ${int.color}, ${int.color2})` : int.color,
                  boxShadow: `0 4px 12px ${int.color}25`,
                }}>
                <span style={{
                  color: "#fff", fontSize: int.wordmarkSize ?? "14px", fontWeight: int.fontWeight ?? 600,
                  letterSpacing: int.letterSpacing ?? "0", fontFamily: "system-ui, -apple-system, sans-serif",
                  lineHeight: 1, textShadow: "0 1px 2px rgba(0,0,0,0.15)",
                }}>{int.wordmark}</span>
              </div>
              <div className="text-center">
                <p className="text-[12px] font-semibold leading-tight" style={{ color: C.inkDark }}>{int.name}</p>
                <p className="text-[10px] mt-0.5 font-medium" style={{ color: C.textFaint }}>{int.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-[12px] leading-relaxed" style={{ color: C.textFaint }}>
            Plus ichris, AlayaCare, Tanda, Roubler, Visual Care, and any system with an API or structured export.
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.good, opacity: 0.5 }} />
            <span className="text-[11px] font-medium" style={{ color: C.good }}>New connectors added monthly</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function GPMSCallout() {
  return (
    <section style={{ backgroundColor: C.canvas }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 pb-14 lg:pb-20">
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#fff", border: "1px solid rgba(26,18,24,0.06)", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:gap-10 p-6 lg:p-8 items-center">
            <div>
              <p className="text-[10px] font-medium tracking-[0.12em] uppercase mb-2" style={{ color: C.good }}>Compliance, handled</p>
              <h3 className="text-[clamp(1.1rem,2.5vw,1.5rem)] font-normal leading-[1.2] mb-3" style={{ color: C.inkDark }}>
                Reports straight to GPMS via the B2G gateway
              </h3>
              <p className="text-[14px] leading-[1.7] max-w-2xl" style={{ color: C.inkMutedLight }}>
                Aligned with the Aged Care Act 2024. Chris connects to the Government Provider Management System through the Business-to-Government APIs. Mandatory reporting flows from your operation to the Department of Health, the Aged Care Quality and Safety Commission, and the NDIA without manual handling.
              </p>
            </div>
            {/* B2G flow diagram */}
            <div className="flex items-center gap-3 lg:gap-4 shrink-0">
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(45,106,79,0.08)" }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="3" width="16" height="14" rx="2" stroke={C.good} strokeWidth="1.5" /><path d="M6 7h8M6 10h5" stroke={C.good} strokeWidth="1.2" strokeLinecap="round" /></svg>
                </div>
                <span className="text-[9px] font-medium" style={{ color: C.inkMutedLight }}>Your data</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <svg width="32" height="12" viewBox="0 0 32 12" fill="none"><path d="M0 6h28M24 2l4 4-4 4" stroke={C.good} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" /></svg>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(200,154,60,0.08)" }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke={C.copper} strokeWidth="1.5" /><path d="M10 6v4l2.5 2.5" stroke={C.copper} strokeWidth="1.2" strokeLinecap="round" /></svg>
                </div>
                <span className="text-[9px] font-medium" style={{ color: C.inkMutedLight }}>B2G gateway</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <svg width="32" height="12" viewBox="0 0 32 12" fill="none"><path d="M0 6h28M24 2l4 4-4 4" stroke={C.copper} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" /></svg>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(26,18,24,0.05)" }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2L3 7v9h14V7L10 2z" stroke={C.inkDark} strokeWidth="1.5" strokeLinejoin="round" opacity="0.5" /><rect x="7.5" y="11" width="5" height="5" rx="0.5" stroke={C.inkDark} strokeWidth="1" opacity="0.3" /></svg>
                </div>
                <span className="text-[9px] font-medium" style={{ color: C.inkMutedLight }}>Government</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── How it works (4-stage tabbed component) ────────────────────────────────
const HIW_STAGES = [
  { num: "01", label: "Connect", title: "Your operation, in one view",
    body: "Chris connects to the systems you already run: clinical, rostering, finance, compliance, family. No migration. No re-platforming. No schema mapping. Your data stays where it is. Chris reads what's already there.",
    pills: ["Native Integrations", "Living Memory", "Zero Migration", "Genos EI integrated"], accent: C.good },
  { num: "02", label: "Watch", title: "Every domain, every shift",
    body: "Chris watches what's happening across the operation: workforce, clinical, compliance, finance, governance. Continuous, simultaneous, cross-domain. The signals that used to surface days late, surfaced before they land.",
    pills: ["Cross-Domain Watch", "Continuous Oversight", "Early Signals"], accent: C.good },
  { num: "03", label: "Support", title: "Leadership in the flow of work",
    body: "A roster gap on Sunday is a clinical risk on Monday is a Commission notification on Friday. Chris makes that chain legible. It surfaces what matters to the people who can act on it, in the flow of their work, with the context they need to lead.",
    pills: ["Chain Detection", "Leader Support", "Flow-of-Work"], accent: C.copper },
  { num: "04", label: "Act", title: "Routine work, handled",
    body: "When something is routine and the path is clear, Chris handles it. Drafting the response. Logging the action. Closing the loop. Your leaders spend their judgment on the work that actually needs them.",
    pills: ["Routine Automation", "Closed Loop", "Leader-Led"], accent: C.copper },
];

function HIWConnectSVG() {
  const t = C.teal;
  return (
    <svg viewBox="0 0 400 260" fill="none" className="w-full h-full">
      <rect width="400" height="260" rx="8" fill="#f5f5f0" />
      {/* Source systems on the left */}
      {[{ y: 30, l: "Clinical", w: 80 }, { y: 65, l: "Rostering", w: 88 }, { y: 100, l: "Finance", w: 72 }, { y: 135, l: "Compliance", w: 96 }, { y: 170, l: "Family", w: 68 }].map((s, i) => (
        <g key={i}>
          <rect x="20" y={s.y} width={s.w} height="24" rx="4" fill="#fff" stroke={t} strokeWidth="1" strokeOpacity="0.5" />
          <text x={20 + s.w / 2} y={s.y + 16} textAnchor="middle" fill={C.text} fontSize="10" fontWeight="500" fontFamily="system-ui">{s.l}</text>
          <line x1={20 + s.w} y1={s.y + 12} x2={240} y2={120} stroke={t} strokeWidth="1.5" strokeOpacity="0.35" strokeDasharray="4 3">
            <animate attributeName="stroke-dashoffset" from="7" to="0" dur={`${1.5 + i * 0.25}s`} repeatCount="indefinite" />
          </line>
        </g>
      ))}
      {/* Central Chris node */}
      <rect x="240" y="80" width="140" height="80" rx="6" fill="#fff" stroke={t} strokeWidth="1.5" />
      <rect x="240" y="80" width="140" height="24" rx="6" fill={t} fillOpacity="0.08" />
      <text x="310" y="96" textAnchor="middle" fill={t} fontSize="10" fontWeight="500" fontFamily="system-ui">Chris</text>
      <text x="310" y="120" textAnchor="middle" fill={C.text} fontSize="20" fontWeight="500" fontFamily="system-ui">One view</text>
      <text x="310" y="145" textAnchor="middle" fill={C.textFaint} fontSize="9" fontFamily="system-ui">All systems. Real time.</text>
      {/* Live dot */}
      <circle cx="370" cy="90" r="4" fill={t}><animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" /></circle>
      {/* Bottom labels */}
      <text x="60" y="220" fill={C.textFaint} fontSize="9" fontFamily="system-ui">No migration</text>
      <text x="160" y="220" fill={C.textFaint} fontSize="9" fontFamily="system-ui">No re-platforming</text>
      <text x="290" y="220" fill={C.textFaint} fontSize="9" fontFamily="system-ui">Zero schema mapping</text>
    </svg>
  );
}

function HIWWatchSVG() {
  const t = C.teal;
  const a = C.amber;
  const r = C.red;
  return (
    <svg viewBox="0 0 400 260" fill="none" className="w-full h-full">
      <rect width="400" height="260" rx="8" fill="#f5f5f0" />
      {/* Domain columns */}
      {[{ x: 20, l: "Workforce", signals: [{ y: 45, s: "Turnover 28%", c: a }, { y: 72, s: "Agency 18%", c: a }, { y: 99, s: "Sick leave +12%", c: r }] },
        { x: 145, l: "Clinical", signals: [{ y: 45, s: "Care mins 84%", c: r }, { y: 72, s: "Falls -12%", c: t }, { y: 99, s: "RN gap PM", c: a }] },
        { x: 270, l: "Compliance", signals: [{ y: 45, s: "SIRS on time", c: t }, { y: 72, s: "QI due 14d", c: a }, { y: 99, s: "PSH review", c: a }] },
      ].map((col, ci) => (
        <g key={ci}>
          <text x={col.x + 55} y={28} textAnchor="middle" fill={C.text} fontSize="10" fontWeight="500" fontFamily="system-ui">{col.l}</text>
          {col.signals.map((sig, si) => (
            <g key={si}>
              <rect x={col.x} y={sig.y} width="110" height="22" rx="3" fill="#fff" stroke={sig.c} strokeWidth="1" strokeOpacity="0.6" />
              <circle cx={col.x + 10} cy={sig.y + 11} r="3" fill={sig.c}>
                <animate attributeName="opacity" values="0.5;1;0.5" dur={`${1.8 + ci * 0.3 + si * 0.2}s`} repeatCount="indefinite" />
              </circle>
              <text x={col.x + 20} y={sig.y + 15} fill={C.text} fontSize="9" fontFamily="system-ui">{sig.s}</text>
            </g>
          ))}
        </g>
      ))}
      {/* Cross-domain connection lines */}
      <line x1="130" y1="83" x2="145" y2="56" stroke={a} strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.4" />
      <line x1="255" y1="83" x2="270" y2="83" stroke={a} strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.4" />
      {/* Convergence alert */}
      <rect x="80" y="145" width="240" height="36" rx="5" fill="#fff" stroke={a} strokeWidth="1.5" />
      <circle cx="100" cy="163" r="5" fill={a}><animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" /></circle>
      <text x="115" y="159" fill={C.text} fontSize="10" fontWeight="500" fontFamily="system-ui">Convergence detected</text>
      <text x="115" y="174" fill={C.textMuted} fontSize="9" fontFamily="system-ui">Workforce + Clinical signals correlating</text>
      {/* Continuous label */}
      <text x="200" y="215" textAnchor="middle" fill={C.textFaint} fontSize="9" fontFamily="system-ui">Continuous. Simultaneous. Cross-domain.</text>
    </svg>
  );
}

function HIWSupportSVG() {
  const t = C.teal;
  const a = C.amber;
  const r = C.red;
  return (
    <svg viewBox="0 0 400 260" fill="none" className="w-full h-full">
      <rect width="400" height="260" rx="8" fill="#f5f5f0" />
      {/* Leader's console frame */}
      <rect x="30" y="20" width="340" height="200" rx="6" fill="#fff" stroke={C.text} strokeWidth="1" strokeOpacity="0.15" />
      {/* Title bar */}
      <rect x="30" y="20" width="340" height="28" rx="6" fill={C.text} fillOpacity="0.04" />
      <text x="50" y="39" fill={C.text} fontSize="10" fontWeight="500" fontFamily="system-ui">DON Review Queue</text>
      <circle cx="348" cy="34" r="4" fill={t}><animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" /></circle>
      <text x="330" y="38" textAnchor="end" fill={C.textFaint} fontSize="8" fontFamily="system-ui">Live</text>
      {/* Queue items */}
      {[{ y: 58, bar: r, text: "SIRS Priority 1: review draft", right: "11:09pm", urgency: "Immediate" },
        { y: 88, bar: a, text: "Care minutes gap: tonight's RN shift", right: "2:14pm", urgency: "Urgent" },
        { y: 118, bar: a, text: "Board Pack Q3: awaiting approval", right: "8 days", urgency: "Urgent" },
        { y: 148, bar: t, text: "QI submission: data compiled", right: "14 days", urgency: "Routine" },
      ].map((item, i) => (
        <g key={i}>
          <line x1="45" y1={item.y + 2} x2="45" y2={item.y + 20} stroke={item.bar} strokeWidth="3" strokeLinecap="round" />
          <text x="55" y={item.y + 14} fill={C.text} fontSize="9.5" fontWeight="500" fontFamily="system-ui">{item.text}</text>
          <text x="355" y={item.y + 14} textAnchor="end" fill={C.textFaint} fontSize="8" fontFamily="system-ui">{item.right}</text>
        </g>
      ))}
      {/* Chain detection arrow */}
      <path d="M 50 180 L 50 195 L 350 195" stroke={a} strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.5">
        <animate attributeName="stroke-dashoffset" from="7" to="0" dur="2s" repeatCount="indefinite" />
      </path>
      <text x="200" y="210" textAnchor="middle" fill={a} fontSize="9" fontWeight="500" fontFamily="system-ui">Chain: roster gap → clinical risk → SIRS notification</text>
      {/* Bottom label */}
      <text x="200" y="245" textAnchor="middle" fill={C.textFaint} fontSize="9" fontFamily="system-ui">Surfaced to the leader who can act. In the flow of work.</text>
    </svg>
  );
}

function HIWActSVG() {
  const t = C.teal;
  return (
    <svg viewBox="0 0 400 260" fill="none" className="w-full h-full">
      <rect width="400" height="260" rx="8" fill="#f5f5f0" />
      {/* Four action rows */}
      {[{ icon: "✦", label: "Drafted", desc: "SIRS notification with all mandatory fields", status: "Ready for review", c: t },
        { icon: "⬡", label: "Queued", desc: "3 priority actions for the DON this morning", status: "Ranked by urgency", c: C.amber },
        { icon: "→", label: "Briefed", desc: "Monday briefing sent to every leader by 6am", status: "Delivered", c: t },
        { icon: "↗", label: "Closed", desc: "Supervision logged. Evidence trail updated.", status: "Complete", c: t },
      ].map((row, i) => (
        <g key={i}>
          <rect x="30" y={20 + i * 52} width="340" height="42" rx="5" fill="#fff" stroke={C.text} strokeWidth="0.5" strokeOpacity="0.1" />
          {/* Icon circle */}
          <circle cx="58" cy={41 + i * 52} r="12" fill={row.c} fillOpacity="0.1" />
          <text x="58" y={45 + i * 52} textAnchor="middle" fill={row.c} fontSize="11" fontFamily="system-ui">{row.icon}</text>
          {/* Label and desc */}
          <text x="80" y={36 + i * 52} fill={C.text} fontSize="11" fontWeight="500" fontFamily="system-ui">{row.label}</text>
          <text x="80" y={50 + i * 52} fill={C.textMuted} fontSize="9" fontFamily="system-ui">{row.desc}</text>
          {/* Status pill */}
          <rect x="290" y={30 + i * 52} width={row.status.length * 6 + 16} height="20" rx="10" fill={row.c} fillOpacity="0.08" />
          <text x={290 + (row.status.length * 6 + 16) / 2} y={44 + i * 52} textAnchor="middle" fill={row.c} fontSize="8" fontWeight="500" fontFamily="system-ui">{row.status}</text>
          {/* Animated completion tick for last two */}
          {i >= 2 && <circle cx="370" cy={41 + i * 52} r="6" fill={t} fillOpacity="0.15"><animate attributeName="fillOpacity" values="0.1;0.3;0.1" dur="3s" repeatCount="indefinite" /></circle>}
          {i >= 2 && <path d={`M ${367} ${41 + i * 52} L ${369} ${43 + i * 52} L ${373} ${39 + i * 52}`} stroke={t} strokeWidth="1.5" strokeLinecap="round" fill="none" />}
        </g>
      ))}
      {/* Summary bar */}
      <rect x="30" y="230" width="340" height="1" fill={C.text} fillOpacity="0.06" />
      <text x="200" y="250" textAnchor="middle" fill={C.textFaint} fontSize="9" fontFamily="system-ui">Your leaders review and approve. Chris handles the rest.</text>
    </svg>
  );
}

const HIW_ILLUSTRATIONS = [HIWConnectSVG, HIWWatchSVG, HIWSupportSVG, HIWActSVG];

function HowItWorksSection() {
  const [active, setActive] = useState(0);
  const outerRef = useRef<HTMLDivElement>(null);

  // Scroll-driven stage progression on desktop
  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;
    function onScroll() {
      if (!outer) return;
      const rect = outer.getBoundingClientRect();
      const sectionHeight = outer.offsetHeight;
      const viewportH = window.innerHeight;
      // How far we've scrolled into the section (0 = top just hit viewport, sectionHeight - viewportH = bottom)
      const scrolled = -rect.top;
      const scrollableRange = sectionHeight - viewportH;
      if (scrollableRange <= 0) return;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableRange));
      const stage = Math.min(3, Math.floor(progress * 4));
      setActive(stage);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const stage = HIW_STAGES[active];
  const Illus = HIW_ILLUSTRATIONS[active];

  return (
    <section id="how-it-works" ref={outerRef} style={{ backgroundColor: C.canvas, height: "300vh" }}>
      <div className="sticky top-0" style={{ height: "100vh", display: "flex", alignItems: "center" }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-16 w-full">
          {/* Header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 mb-10">
            <div>
              <SectionEyebrow>How it works</SectionEyebrow>
              <h2 className="mb-3" style={{ fontSize: "clamp(34px, 4vw, 48px)", lineHeight: 1.08, letterSpacing: "-0.025em", fontWeight: 400, fontFamily: serif, color: C.text }}>
                Aged care, with <span style={{ fontStyle: "italic" }}>intelligence</span> in every layer
              </h2>
            </div>
            <div className="lg:pt-8">
              <p className="text-[15px] leading-[1.6]" style={{ color: C.textMuted }}>
                Cross-domain intelligence working alongside your leaders. Reading every system you already run, catching what slips between domains, supporting the people running care, and handling the routine so they can lead.
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex gap-1 mb-8">
            {HIW_STAGES.map((s, i) => (
              <div key={s.num} className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-medium tracking-[0.08em] uppercase" style={{ fontFamily: inter, color: active === i ? C.ironstone : C.textFaint }}>{s.num}</span>
                  <span className="text-[13px] font-medium" style={{ fontFamily: inter, color: active === i ? C.text : C.textFaint }}>{s.label}</span>
                </div>
                <div className="h-[2px] rounded-full" style={{ backgroundColor: active >= i ? C.ironstone : C.border, transition: "background-color 300ms" }} />
              </div>
            ))}
          </div>

          {/* Content: illustration + copy */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
            <div className="order-2 lg:order-1 rounded-[8px] overflow-hidden" style={{ border: `0.5px solid ${C.border}` }}>
              <div className="p-2 lg:p-3"><Illus /></div>
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-[11px] font-medium tracking-[0.08em] uppercase mb-3" style={{ fontFamily: inter, color: C.ironstone }}>{stage.num} {stage.label}</p>
              <h3 className="mb-4" style={{ fontSize: "clamp(22px, 3vw, 28px)", lineHeight: 1.15, letterSpacing: "-0.01em", fontWeight: 500, fontFamily: serif, color: C.text }}>{stage.title}</h3>
              <p className="text-[15px] leading-[1.65] mb-5" style={{ fontFamily: inter, color: C.textMuted }}>{stage.body}</p>
              <div className="flex flex-wrap gap-2">
                {stage.pills.map((pill) => (
                  <span key={pill} className="px-3 py-1.5 rounded-full text-[11px] font-medium" style={{ backgroundColor: C.accentMuted, color: C.ironstone }}>{pill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatRow() {
  return (
    <section style={{ backgroundColor: C.canvas, borderTop: `0.5px solid ${C.border}` }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-12 lg:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-0">
          {STATS.map((stat, i) => (
            <div key={stat.label} className={`flex flex-col items-center text-center lg:py-0 ${i < STATS.length - 1 ? "sm:border-r" : ""}`} style={{ borderColor: C.border }}>
              <div className="text-[clamp(2rem,5vw,3rem)] font-medium leading-none tracking-[-0.02em] mb-2" style={{ color: stat.color }}>{stat.number}</div>
              <div className="text-[11px] uppercase tracking-[0.06em] leading-snug max-w-[200px]" style={{ color: C.textFaint }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function JobsSection() {
  const [selected, setSelected] = useState<number | null>(null);
  const job = selected !== null ? JOBS[selected] : null;

  return (
    <section style={{ backgroundColor: C.canvas }} id="jobs">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16 lg:py-24">
        <p className="text-[17px] mb-3" style={{ fontFamily: fraunces, fontStyle: "italic", letterSpacing: "-0.01em", color: C.teal }}>Where we start</p>
        <h2 className="mb-3" style={{ fontSize: "clamp(34px, 4vw, 48px)", lineHeight: 1.08, letterSpacing: "-0.025em", fontWeight: 500, color: C.text }}>
          We don&apos;t sell software. We fix a problem.<br />
          <em className="italic" style={{ color: C.copperDark }}>Then another. Then another.</em>
        </h2>
        <p className="text-[16px] leading-relaxed mb-3" style={{ color: C.inkMutedLight }}>
          Pick the one workflow that&apos;s costing you the most right now. Chris handles it end-to-end. You approve the outcome.
        </p>
        <p className="text-[15px] leading-relaxed mb-12" style={{ color: C.textMuted }}>
          These are the problems we see most often. Yours might be something else entirely. Either way, we&apos;ll find it in a single conversation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {JOBS.map((job, i) => (
            <button key={job.n} onClick={() => setSelected(i)}
              className="w-full text-left border rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
              style={{ backgroundColor: "#fff", borderColor: C.border, borderLeftWidth: 4, borderLeftColor: job.accent }}>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[12px] italic" style={{ color: C.textFaint }}>{job.n}</span>
                  <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(26,18,24,0.06)", color: C.inkDark }}>{job.role}</span>
                </div>
                <h3 className="text-[15px] font-medium mb-2" style={{ color: C.inkDark }}>{job.title}</h3>
                <p className="text-[13px] italic" style={{ color: C.inkMutedLight }}>{job.hook}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a href="#book" className="inline-block px-8 py-3.5 rounded text-[14px] font-medium transition-colors hover:opacity-90 mb-3" style={{ backgroundColor: C.dark, color: C.ink }}>
            Start with one conversation →
          </a>
          <p className="text-[13px]" style={{ color: C.textMuted }}>30 minutes. No demo. Just your operation and ours.</p>
        </div>
      </div>

      {/* Job detail popup */}
      {job && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 z-10 rounded-t-2xl px-6 py-5" style={{ backgroundColor: C.dark }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[12px] italic" style={{ color: "rgba(245,237,227,0.35)" }}>{job.n}</span>
                    <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(245,237,227,0.1)", color: C.inkMuted }}>{job.role}</span>
                  </div>
                  <h3 className="text-[20px] font-normal" style={{ color: C.ink }}>{job.title}</h3>
                </div>
                <button onClick={() => setSelected(null)} className="text-[20px] w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors" style={{ color: C.inkMuted }}>×</button>
              </div>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* The scenario */}
              <div className="rounded-lg px-4 py-3" style={{ backgroundColor: "rgba(26,18,24,0.02)", border: "1px solid rgba(26,18,24,0.06)" }}>
                <p className="text-[14px] italic leading-relaxed" style={{ color: C.textMuted }}>{job.hook}</p>
              </div>

              {/* CHRIS does */}
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider mb-3" style={{ color: C.copperDark }}>CHRIS does</p>
                <ul className="space-y-2">
                  {job.chrisDoes.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13px] leading-relaxed" style={{ color: C.textMuted }}>
                      <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium mt-0.5" style={{ backgroundColor: "rgba(200,154,60,0.1)", color: C.copperDark }}>{i + 1}</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* You do */}
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider mb-3" style={{ color: C.good }}>You do</p>
                <ul className="space-y-2">
                  {job.humanDoes.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13px] leading-relaxed" style={{ color: C.textMuted }}>
                      <span className="shrink-0 mt-1" style={{ color: C.good }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* What's at stake */}
              <div className="rounded-lg px-4 py-3" style={{ borderLeft: `3px solid ${job.accent}`, backgroundColor: "rgba(26,18,24,0.02)" }}>
                <p className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: C.textFaint }}>What&apos;s at stake</p>
                <p className="text-[13px] leading-relaxed" style={{ color: C.textMuted }}>{job.stakes}</p>
              </div>

              {/* CTA */}
              <a href="#book" onClick={() => setSelected(null)} className="block w-full text-center py-3.5 rounded-lg text-[14px] font-medium hover:opacity-90 transition-colors" style={{ backgroundColor: C.copper, color: C.dark }}>
                Start with this problem →
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function ScenarioSection() {
  const [openScenarios, setOpenScenarios] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scenarios = [
    {
      id: 0,
      clock: "23:04",
      tag: "Incident detected",
      tagColor: C.red,
      borderColor: C.red,
      title: "11:04pm Friday.",
      subtitle: "A Priority 1 incident. 24 hours to notify ACQSC.",
      lines: [
        { text: "Chris classified it in 4 minutes.", weight: true },
        { text: "The draft was waiting in the DON\u2019s inbox by 11:09.", italic: true },
        { text: "She approved it before midnight.", italic: true },
      ],
      punchline: "That is the difference between a penalty and a clean record.",
      footnote: "Documentation drafting, event-driven. Always watching. Zero missed deadlines at current pilots.",
    },
    {
      id: 1,
      clock: "09:14",
      tag: "Opportunity surfaced",
      tagColor: C.teal,
      borderColor: C.teal,
      title: "Tuesday morning, 9:14am.",
      subtitle: "Three residents flagged for AN-ACC reclassification.",
      lines: [
        { text: "Chris surfaced the opportunity overnight.", weight: true },
        { text: "Clinical evidence compiled. Classification uplift quantified.", italic: true },
        { text: "The CFO reviewed the numbers before morning tea.", italic: true },
      ],
      punchline: "$11,400 per month in revenue the facility was already entitled to.",
      footnote: "Revenue intelligence, running weekly. Every reclassification opportunity quantified before the quarter closes.",
    },
  ];

  return (
    <section ref={sectionRef} style={{ backgroundColor: C.canvasLight }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-12 lg:py-16">
        <p className="text-[17px] mb-8" style={{ fontFamily: fraunces, fontStyle: "italic", letterSpacing: "-0.01em", color: C.teal }}>Every facility. Every week.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {scenarios.map((sc) => {
            const isOpen = openScenarios.has(sc.id);
            return (
              <button key={sc.id}
                onClick={() => setOpenScenarios((prev) => { const next = new Set(prev); if (next.has(sc.id)) next.delete(sc.id); else next.add(sc.id); return next; })}
                className="text-left rounded-[8px] overflow-hidden transition-all duration-300"
                style={{
                  backgroundColor: C.canvasWarm,
                  border: `0.5px solid ${isOpen ? sc.borderColor : C.border}`,
                  borderLeftWidth: isOpen ? 3 : 0.5,
                  borderLeftColor: isOpen ? sc.borderColor : C.border,
                  boxShadow: isOpen ? `0 4px 20px rgba(0,0,0,0.06)` : "none",
                }}>
                <div className="p-6 lg:p-7">
                  {/* Header row: clock + tag + expand indicator */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] font-medium tracking-[0.12em] tabular-nums" style={{ fontFamily: "'Courier New', Consolas, monospace", color: sc.tagColor }}>{sc.clock}</span>
                      <span className="text-[9px] font-medium tracking-[0.15em] uppercase" style={{ color: C.textFaint }}>{sc.tag}</span>
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: sc.tagColor }} />
                    </div>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                      <path d="M8 3v10M3 8h10" stroke={sc.tagColor} strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>

                  {/* Title (always visible) */}
                  <h3 className="text-[clamp(1.5rem,3.5vw,2rem)] leading-[1.1] mb-2" style={{ fontFamily: fraunces, fontStyle: "italic", color: C.text, letterSpacing: "-0.02em" }}>{sc.title}</h3>
                  <p className="text-[14px]" style={{ color: C.textFaint }}>{sc.subtitle}</p>

                  {/* Expanded content */}
                  <div className={`overflow-hidden transition-all duration-500 ${isOpen ? "max-h-[400px] opacity-100 mt-5" : "max-h-0 opacity-0"}`}>
                    {sc.lines.map((line, i) => (
                      <div key={i} className="transition-all duration-500 ease-out mb-1"
                        style={{ opacity: isOpen && visible ? 1 : 0, transform: isOpen ? "translateY(0)" : "translateY(12px)", transitionDelay: `${i * 200}ms` }}>
                        <p style={{
                          fontSize: line.weight ? "clamp(1.1rem, 2vw, 1.3rem)" : "15px",
                          fontWeight: line.weight ? 500 : 400,
                          fontFamily: line.italic ? fraunces : inter,
                          fontStyle: line.italic ? "italic" : "normal",
                          color: line.weight ? C.text : C.textMuted,
                        }}>{line.text}</p>
                      </div>
                    ))}

                    <p className="text-[clamp(1.1rem,2vw,1.3rem)] font-medium mt-4" style={{ color: C.teal }}>{sc.punchline}</p>

                    <div className="mt-5 pt-4" style={{ borderTop: `0.5px solid ${C.border}` }}>
                      <p className="text-[12px]" style={{ color: C.textFaint }}>{sc.footnote}</p>
                    </div>
                  </div>

                  {!isOpen && <p className="text-[12px] mt-3" style={{ color: C.textFaint }}>Click to read the full scenario</p>}
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-[13px] mt-8" style={{ color: C.textFaint }}>Nine workflows live today, from SIRS handling to board pack generation. <a href="/workflows" className="font-medium hover:underline" style={{ color: C.text }}>See the full list →</a></p>
      </div>
    </section>
  );
}

function AgentsSection() {
  const [selected, setSelected] = useState<number | null>(null);
  const agent = selected !== null ? AGENTS[selected] : null;

  return (
    <section style={{ backgroundColor: C.canvas }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16 lg:py-24">
        <p className="text-[17px] mb-3" style={{ fontFamily: fraunces, fontStyle: "italic", letterSpacing: "-0.01em", color: C.teal }}>The intelligence layer</p>
        <h2 className="mb-3" style={{ fontSize: "clamp(34px, 4vw, 48px)", lineHeight: 1.08, letterSpacing: "-0.025em", fontWeight: 500, color: C.text }}>
          Named agents. Every domain. <span style={{ fontFamily: fraunces, fontStyle: "italic", letterSpacing: "-0.012em" }}>Always on.</span>
        </h2>
        <p className="text-[15px] leading-relaxed max-w-xl mb-12" style={{ color: C.inkMutedLight }}>
          Each agent has a domain, a cadence, and a job. Together they give every leader in your organisation a dedicated intelligence layer, working underneath them, 24 hours a day.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {AGENTS.map((agent, i) => (
            <button key={agent.name} onClick={() => setSelected(i)}
              className="border rounded-lg p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
              style={{ backgroundColor: "#fff", borderColor: C.border }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: agent.color }} />
                <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: C.copperDark }}>{agent.cadence}</span>
              </div>
              <p className="text-[14px] font-medium mb-1" style={{ color: C.inkDark }}>{agent.name}</p>
              <p className="text-[12px]" style={{ color: C.inkMutedLight }}>{agent.domain}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Agent detail popup */}
      {agent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 z-10 rounded-t-2xl px-6 py-5" style={{ backgroundColor: C.dark }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: agent.color }} />
                    <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: C.copper }}>{agent.cadence}</span>
                  </div>
                  <h3 className="text-[22px] font-normal" style={{ color: C.ink }}>{agent.name}</h3>
                  <p className="text-[13px] mt-0.5" style={{ color: C.inkMuted }}>{agent.domain}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-[20px] w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors" style={{ color: C.inkMuted }}>×</button>
              </div>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Summary */}
              <p className="text-[14px] leading-relaxed" style={{ color: C.inkDark }}>{agent.summary}</p>

              {/* What it watches */}
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider mb-2" style={{ color: C.textFaint }}>What it watches</p>
                <ul className="space-y-1.5">
                  {agent.watches.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px]" style={{ color: C.textMuted }}>
                      <span className="w-1 h-1 rounded-full shrink-0 mt-2" style={{ backgroundColor: agent.color }} />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>

              {/* What it delivers */}
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider mb-2" style={{ color: C.textFaint }}>What it delivers</p>
                <ul className="space-y-1.5">
                  {agent.delivers.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px]" style={{ color: C.textMuted }}>
                      <span className="shrink-0 mt-0.5" style={{ color: C.copper }}>→</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Example scenario */}
              <div className="rounded-lg p-4" style={{ backgroundColor: "rgba(26,18,24,0.02)", border: "1px solid rgba(26,18,24,0.06)" }}>
                <p className="text-[10px] font-medium uppercase tracking-wider mb-2" style={{ color: C.copperDark }}>Example</p>
                <p className="text-[13px] leading-relaxed italic" style={{ color: C.textMuted }}>{agent.example}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function AISupportSection() {
  return (
    <section style={{ backgroundColor: C.canvas, borderTop: `0.5px solid ${C.border}` }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-14 lg:py-18">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <div>
            <p className="text-[17px] mb-3" style={{ fontFamily: fraunces, fontStyle: "italic", letterSpacing: "-0.01em", color: C.teal }}>AI support</p>
            <h2 className="mb-4" style={{ fontSize: "clamp(34px, 4vw, 48px)", lineHeight: 1.08, letterSpacing: "-0.025em", fontWeight: 500, color: C.text }}>
              Ask the question you&apos;ve been <span style={{ fontFamily: fraunces, fontStyle: "italic", letterSpacing: "-0.012em" }}>sitting on.</span>
            </h2>
            <p className="text-[14px] leading-[1.6] mb-5" style={{ color: C.textMuted }}>
              Chris is an operational intelligence layer and AI support built specifically for aged care. Ask about compliance, workforce, funding, or bring a leadership challenge. Chris supports the way a trusted colleague would: direct, warm, and grounded in what actually works in this sector. No login. No signup.
            </p>
            <p className="text-[11px]" style={{ color: C.textFaint }}>
              You&apos;re talking to a public preview. The full version connects to your systems and knows your team.
            </p>
          </div>
          <div><ChrisPublicChat /></div>
        </div>
      </div>
    </section>
  );
}

// ── Founders section ────────────────────────────────────────────────────────
const FOUNDERS = [
  {
    initials: "CM", name: "Campbell McGlynn", title: "Cofounder",
    bio: "20+ years in HR leadership, including 6 years as Chief People Officer at IRT Group in aged care. The person who will be in your debrief and your fortnightly check-ins.",
    color: "#1B4332", linkedin: "https://www.linkedin.com/in/campbellmcglynn/",
  },
  {
    initials: "IS", name: "Ivan Sanchez", title: "Cofounder",
    bio: "Platform architecture and engineering. Makes sure the integrations, agents, and intelligence layer work reliably behind the scenes.",
    color: "#1F6F66", linkedin: "https://www.linkedin.com/in/ivsanchez/",
  },
  {
    initials: "AJ", name: "Abhinav Jain", title: "AI/ML Lead",
    bio: "AI and agentic lead engineer behind Chris. Builds the agentic systems, integrations, and intelligence that make the platform learn, remember, and respond in context.",
    color: "#BA7517", linkedin: "https://www.linkedin.com/in/abhinav-jain-ml/",
  },
  {
    initials: "BP", name: "Dr Ben Palmer", title: "Coventure partner",
    bio: "Internationally recognised CEO of Genos International. Developed Australia's first workplace model and measure of emotional intelligence through his PhD at Swinburne. 23+ years partnering with organisations from start-ups to Fortune 500.",
    color: "#5A5A57", linkedin: "https://www.linkedin.com/in/benjaminpalmer/",
  },
];

function FoundersSection() {
  return (
    <section style={{ backgroundColor: C.canvas }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-12 lg:py-16">
        <p className="text-[17px] mb-2" style={{ fontFamily: fraunces, fontStyle: "italic", letterSpacing: "-0.01em", color: C.teal }}>Your team</p>
        <h2 className="mb-10" style={{ fontSize: "clamp(34px, 4vw, 48px)", lineHeight: 1.08, letterSpacing: "-0.025em", fontWeight: 500, color: C.text }}>
          The humans behind Chris{" "}
          <span style={{ fontFamily: fraunces, fontStyle: "italic", letterSpacing: "-0.012em" }}>OS.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FOUNDERS.map((f) => (
            <div key={f.name} className="rounded-[8px] p-6" style={{ backgroundColor: C.canvasLight, border: `0.5px solid ${C.border}` }}>
              <div className="flex items-start gap-4">
                {/* Initial circle (replace with <img> when photos available) */}
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-[15px] font-medium" style={{ backgroundColor: f.color, color: "#fff" }}>
                  {f.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <a href={f.linkedin} target="_blank" rel="noopener noreferrer" className="text-[16px] font-medium hover:underline" style={{ color: C.text }}>{f.name}</a>
                  <p className="text-[12px] font-medium mb-3" style={{ color: C.teal }}>{f.title}</p>
                  <p className="text-[13px] leading-[1.6]" style={{ color: C.textMuted }}>{f.bio}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HonestAnswersSection() {
  const cards = [
    {
      eyebrow: "Data and system integration",
      headline: "Standalone today. APIs and MCP live in May 2026.",
      today: "Chris runs as a standalone SaaS. No integration with your internal systems, networks, or databases is required during pilot. Staff access via web browser and SMS links. We get exports from your roster, finance, clinical, and incident systems on whatever cadence works, and Chris reads from those. The architecture is deliberately lean. No VPN. No on-premises components. No inbound connections to your network.",
      coming: "APIs and MCP server connectors live in May 2026. The twelve named source systems prioritised by which pilot organisation runs them first.",
      cta: "If your stack matters: tell us your three biggest systems on the first call. We will tell you exactly when integration ships for them.",
    },
    {
      eyebrow: "Data privacy",
      headline: "Australian-resident, independently reviewed, defence in depth.",
      today: "All personally identifiable information stored in Sydney on AWS ap-southeast-2 via Supabase, SOC 2 Type 2 certified. Privacy Act 1988 compliant. All thirteen Australian Privacy Principles addressed. Notifiable Data Breaches scheme process documented. De-identified at the connector boundary. Pulse responses anonymous to leaders by default. No PII sent to the AI engine. Full review by a Tier 1 Australian aged care provider's IT security team passed in February 2026.",
      coming: "ISO 27001 certification scoped for 2027. Q2 2026 penetration test by named third party.",
      cta: "If your procurement requires ISO 27001 today: we can share the provider review and our internal controls documentation.",
    },
    {
      eyebrow: "Cyber security",
      headline: "Defence in depth across four layers. MFA enforced on every data-access account.",
      today: "Edge layer with WAF and DDoS protection. Application layer with input validation, CSRF, and Content Security Policy. Database layer with Row Level Security policies on every table and AES-256 encryption at rest. Auth layer with bcrypt password hashing, JWT tokens, and MFA enforced via TOTP for every account that can access team data. SOC 2 Type 2 certified vendors across Vercel, Supabase, Twilio, and Anthropic. Anthropic runs zero-retention API, so prompts containing aggregated team patterns are not stored or used for training.",
      coming: "Third-party penetration test in Q2 2026. STRIDE threat model alongside it. SIEM tooling in H2 2026 as we scale.",
      cta: "If your CISO requires a mature enterprise security org as the baseline to engage: read the full review at chris-os.io/trust first.",
    },
  ];

  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section style={{ backgroundColor: C.canvasLight }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-12 lg:py-16">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] mb-3" style={{ color: C.teal }}>Honest answers</p>
        <h2 className="mb-3" style={{ fontSize: "clamp(34px, 4vw, 48px)", lineHeight: 1.08, letterSpacing: "-0.025em", fontFamily: serif, fontWeight: 400, color: C.text }}>
          Yes, we know what you&apos;re{" "}
          <span style={{ color: C.teal }}>thinking.</span>
        </h2>
        <p className="text-[15px] leading-[1.6] max-w-[560px] mb-10" style={{ color: C.textMuted }}>
          Three questions every CFO and CIO asks before signing anything in aged care. We have already had this conversation with a Tier 1 Australian aged care provider. Here is the short version of how it went. The full review is at <a href="/trust" className="font-medium hover:underline" style={{ color: C.teal }}>chris-os.io/trust</a>.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {cards.map((card, i) => {
            const isOpen = expanded === i;
            return (
              <button key={card.eyebrow} onClick={() => setExpanded(isOpen ? null : i)}
                className="text-left rounded-[8px] transition-all duration-300"
                style={{ backgroundColor: C.canvasWarm, border: `0.5px solid ${isOpen ? C.teal : C.border}` }}>
                <div className="p-5 lg:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-[10px] font-medium uppercase tracking-[0.08em]" style={{ color: C.teal }}>{card.eyebrow}</p>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                      <path d="M8 3v10M3 8h10" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <h3 className="text-[15px] font-medium leading-snug mb-2" style={{ color: C.text }}>{card.headline}</h3>

                  <div className={`overflow-hidden transition-all duration-500 ${isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="mt-3 space-y-4">
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.08em] mb-1" style={{ color: C.teal }}>Today</p>
                        <p className="text-[13px] leading-[1.6]" style={{ color: C.textMuted }}>{card.today}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.08em] mb-1" style={{ color: C.amber }}>Coming</p>
                        <p className="text-[13px] leading-[1.6]" style={{ color: C.textMuted }}>{card.coming}</p>
                      </div>
                      <p className="text-[13px] leading-[1.6] font-medium" style={{ color: C.text }}>{card.cta}</p>
                    </div>
                  </div>

                  {!isOpen && <p className="text-[12px] mt-2" style={{ color: C.textFaint }}>Click to read</p>}
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-[14px] leading-[1.6] max-w-[560px] mb-3" style={{ color: C.textMuted }}>
          We will not be the right vendor for every aged care provider in 2026. We will be the right partner for the ones who want to build the integrated operating layer with us, in the open, while we ship.
        </p>
        <a href="/trust" className="text-[13px] font-medium hover:underline" style={{ color: C.teal }}>
          Read the full cybersecurity review summary and our position on every control area at chris-os.io/trust →
        </a>
      </div>
    </section>
  );
}

function ExecutionSection() {
  return (
    <section style={{ backgroundColor: C.canvas }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16 lg:py-24">
        <p className="text-[17px] mb-3" style={{ fontFamily: fraunces, fontStyle: "italic", letterSpacing: "-0.01em", color: C.teal }}>The execution layer</p>
        <h2 className="mb-3" style={{ fontSize: "clamp(34px, 4vw, 48px)", lineHeight: 1.08, letterSpacing: "-0.025em", fontWeight: 500, color: C.text }}>
          Chris doesn&apos;t just tell you. It <span style={{ fontFamily: fraunces, fontStyle: "italic", letterSpacing: "-0.012em" }}>acts.</span>
        </h2>
        <p className="text-[15px] leading-relaxed max-w-xl mb-12" style={{ color: C.inkMutedLight }}>
          Most analytics tools give you data to interpret. Chris delivers a drafted document, a specific action, or a coordinated recommendation, ready for your review and approval.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {EXECUTION.map((item) => (
            <div key={item.title} className="border rounded-lg p-6" style={{ backgroundColor: C.white, borderColor: C.border }}>
              <div className="text-[20px] mb-3">{item.icon}</div>
              <p className="text-[14px] font-medium mb-2" style={{ color: C.inkDark }}>{item.title}</p>
              <p className="text-[13px] leading-relaxed" style={{ color: C.inkMutedLight }}>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Genos EI competency data for collapsible cards
const EI_COMPETENCIES = [
  { name: "Self-Awareness", productive: "Present", unproductive: "Disconnected", description: "The ability to be aware of your own feelings and the impact they have on your thoughts, decisions, behaviour, and performance at work.", agedCare: "Leaders who are self-aware recognise when the shift is getting to them before their team does. They pause before reacting. In aged care, that pause is the difference between escalation and resolution." },
  { name: "Awareness of Others", productive: "Empathetic", unproductive: "Insensitive", description: "The ability to perceive, understand, and acknowledge the way others feel.", agedCare: "Frontline teams carry emotional weight that does not show up in roster data. Leaders who read the room accurately intervene earlier, retain longer, and catch psychosocial risk before it compounds." },
  { name: "Authenticity", productive: "Genuine", unproductive: "Untrustworthy", description: "The ability to openly and effectively express yourself, honour commitments, and encourage this behaviour in others.", agedCare: "Trust in leadership is the single strongest predictor of pulse engagement at the facilities running Chris OS. Authenticity is how trust is built. Not with announcements, but with follow-through." },
  { name: "Emotional Reasoning", productive: "Expansive", unproductive: "Limited", description: "The ability to use the information in feelings to enhance decision-making.", agedCare: "When agents surface convergence patterns across workforce, clinical, and compliance data, leaders need to weigh operational signals alongside team sentiment. Emotional reasoning is the capability that makes that synthesis possible." },
  { name: "Self-Management", productive: "Resilient", unproductive: "Temperamental", description: "The ability to manage your own mood and emotions, time and behaviour, and to continuously improve yourself.", agedCare: "Aged care leaders carry more concurrent operational, regulatory, and human pressures than almost any other leadership role. Self-management under that load is not a personality trait. It is a trainable capability." },
  { name: "Inspiring Performance", productive: "Empowering", unproductive: "Indifferent", description: "The ability to facilitate high performance in others through problem-solving, providing feedback, coaching, and creating conditions where people feel valued and committed.", agedCare: "Recognition deficit is the most common leading indicator of exit intention. The leader's ability to make staff feel seen is a measurable, trainable behaviour that directly reduces turnover." },
];

// Move 4: comparison data for hover-expand on card fourth paragraphs
const TEAM_LOOP_COMPARE = [
  { label: "Duration", consulting: "6 months, then ends", chris: "Continuous" },
  { label: "Cost", consulting: "$100,000 to $500,000", chris: "From $15,000 per site per year" },
  { label: "Cadence", consulting: "Workshops on a schedule", chris: "Every fortnight, in the flow of work" },
  { label: "Integration", consulting: "Runs beside the operating layer", chris: "Built into the operating layer" },
];
const LEADER_LOOP_COMPARE = [
  { label: "Duration", consulting: "Engagement-based, then ends", chris: "Continuous, alternating with Team Loop" },
  { label: "Cost", consulting: "$300 to $500 per hour", chris: "Included in pilot pricing" },
  { label: "Cadence", consulting: "Monthly or ad-hoc sessions", chris: "Every fortnight, tied to live signals" },
  { label: "Integration", consulting: "Disconnected from operations", chris: "Fed by operational and pulse data" },
];

function ComparePanel({ rows, open }: { rows: typeof TEAM_LOOP_COMPARE; open: boolean }) {
  return (
    <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[400px] opacity-100 mt-3" : "max-h-0 opacity-0"}`}>
      <div className="rounded-[5px] p-4" style={{ backgroundColor: C.canvasWarm, border: `0.5px solid ${C.borderSubtle}` }}>
        <div className="grid grid-cols-3 gap-2 text-[11px]" style={{ fontFamily: inter }}>
          <div />
          <p className="font-medium" style={{ color: C.textFaint }}>Consulting</p>
          <p className="font-medium" style={{ color: C.ironstone }}>Chris OS</p>
          {rows.map((r) => (
            <><div key={r.label} className="font-medium" style={{ color: C.text }}>{r.label}</div>
            <div style={{ color: C.textMuted }}>{r.consulting}</div>
            <div style={{ color: C.text }}>{r.chris}</div></>
          ))}
        </div>
      </div>
    </div>
  );
}

function GenosFramework() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="max-w-[700px]">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3 px-2">
        <span className="text-[9px] font-semibold uppercase tracking-[0.12em]" style={{ fontFamily: inter, color: C.red }}>Unproductive states</span>
        <span className="text-[9px] font-semibold uppercase tracking-[0.12em]" style={{ fontFamily: inter, color: C.text }}>Competency</span>
        <span className="text-[9px] font-semibold uppercase tracking-[0.12em]" style={{ fontFamily: inter, color: C.sage }}>Productive states</span>
      </div>

      {/* Competency rows */}
      <div className="space-y-2">
        {EI_COMPETENCIES.map((comp, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={comp.name}>
              <button onClick={() => setOpenIdx(isOpen ? null : i)} className="w-full group">
                <div className="flex items-center gap-0 rounded-[5px] overflow-hidden transition-all duration-200" style={{ border: `0.5px solid ${isOpen ? C.ironstone : C.border}` }}>
                  {/* Unproductive state */}
                  <div className="w-[28%] py-2.5 px-3 text-right" style={{ backgroundColor: "rgba(139,58,50,0.06)" }}>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.04em]" style={{ fontFamily: inter, color: C.red }}>{comp.unproductive}</span>
                  </div>
                  {/* Competency name (centre) */}
                  <div className="flex-1 py-2.5 px-3 flex items-center justify-center gap-2" style={{ backgroundColor: C.card }}>
                    <span className="text-[12px] font-semibold uppercase tracking-[0.06em]" style={{ fontFamily: inter, color: C.text }}>{comp.name}</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                      <path d="M3 5l3 3 3-3" stroke={C.textFaint} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {/* Productive state */}
                  <div className="w-[28%] py-2.5 px-3" style={{ backgroundColor: "rgba(93,107,84,0.08)" }}>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.04em]" style={{ fontFamily: inter, color: C.sage }}>{comp.productive}</span>
                  </div>
                </div>
              </button>

              {/* Expanded detail */}
              <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="rounded-b-[5px] px-5 py-4 mt-[-1px]" style={{ backgroundColor: C.card, border: `0.5px solid ${C.ironstone}`, borderTop: "none" }}>
                  <p className="text-[13px] leading-[1.6] mb-3" style={{ fontFamily: inter, color: C.textMuted }}>{comp.description}</p>
                  <div className="pl-3" style={{ borderLeft: `2px solid ${C.ironstone}` }}>
                    <p className="text-[12px] leading-[1.55] italic" style={{ fontFamily: inter, color: C.textMuted }}>{comp.agedCare}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LoopCard({ eyebrow, color, headline, paragraphs, pullQuote, comparison }: {
  eyebrow: string; color: string;
  headline: React.ReactNode;
  paragraphs: { text: string; size: number; primary: boolean }[];
  pullQuote: { before: string; emphasis: string; after: string };
  comparison: { text: string; rows: typeof TEAM_LOOP_COMPARE };
}) {
  const [open, setOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);

  return (
    <div className="rounded-[5px] overflow-hidden transition-all duration-200" style={{ backgroundColor: C.card, border: `0.5px solid ${open ? color : C.border}`, borderTopWidth: 3, borderTopColor: color }}>
      <button onClick={() => setOpen(!open)} className="w-full text-left p-6 lg:p-7">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.08em] mb-2" style={{ fontFamily: inter, color }}>{eyebrow}</p>
            <h3 className="text-[18px] font-medium" style={{ fontFamily: inter, color: C.text }}>{headline}</h3>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`shrink-0 mt-1 transition-transform duration-200 ${open ? "rotate-45" : ""}`}>
            <path d="M8 3v10M3 8h10" stroke={C.textFaint} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        {!open && <p className="text-[12px] mt-2" style={{ color: C.textFaint }}>Click to read more</p>}
      </button>

      <div className={`overflow-hidden transition-all duration-400 ${open ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-6 lg:px-7 pb-6 lg:pb-7 space-y-4" style={{ fontFamily: inter }}>
          {paragraphs.map((p, i) => (
            <p key={i} style={{ fontSize: p.size, lineHeight: 1.65, color: p.primary ? C.text : C.textMuted }}>{p.text}</p>
          ))}
          {/* Pull-quote */}
          <div className="my-5 pl-3" style={{ borderLeft: `2px solid ${C.ironstone}` }}>
            <p style={{ fontFamily: inter, fontSize: 17, lineHeight: 1.55, color: C.text }}>
              {pullQuote.before}<span style={{ fontFamily: fraunces, fontStyle: "italic", fontSize: "1.05em" }}>{pullQuote.emphasis}</span>{pullQuote.after}
            </p>
          </div>
          {/* Comparison expand */}
          <button onClick={(e) => { e.stopPropagation(); setCompareOpen(!compareOpen); }} className="w-full text-left">
            <div className="flex items-center justify-between">
              <p className="text-[13px] leading-[1.6] italic" style={{ color: C.textMuted }}>{comparison.text}</p>
              <span className={`text-[12px] shrink-0 ml-2 transition-transform duration-200 ${compareOpen ? "rotate-180" : ""}`} style={{ color: C.textFaint }}>↓</span>
            </div>
          </button>
          <ComparePanel rows={comparison.rows} open={compareOpen} />
        </div>
      </div>
    </div>
  );
}

function ChangeImplementationLayer() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  // Team/Leader compare state now lives inside LoopCard components

  // Move 3: scroll-reveal trigger
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Move 1: compute current day of fortnight for the now-indicator
  const dayOfFortnight = Math.floor((Date.now() / 86400000) % 14);
  const isTeamWeek = dayOfFortnight < 7;

  function reveal(delay: number) {
    return {
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(16px)",
      transition: `opacity 300ms ease-out ${delay}ms, transform 300ms ease-out ${delay}ms`,
    };
  }

  return (
    <section ref={sectionRef} style={{ backgroundColor: C.canvasWarm }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-14 lg:py-18">
        {/* Header with scroll-reveal */}
        <div style={reveal(0)}><SectionEyebrow>The change implementation layer</SectionEyebrow></div>
        <h2 className="mb-6 max-w-[700px]" style={{ fontSize: "clamp(34px, 4vw, 48px)", lineHeight: 1.08, letterSpacing: "-0.025em", fontWeight: 500, color: C.text, ...reveal(100) }}>
          Where software ends, <span style={{ fontFamily: fraunces, fontStyle: "italic" }}>leadership</span> begins.
        </h2>

        {/* Positioning intro with staggered reveal */}
        <div className="max-w-[660px] mb-12 space-y-4">
          <p style={{ fontFamily: inter, fontSize: 16, lineHeight: 1.65, color: C.text, ...reveal(200) }}>
            Aged care is in the middle of the largest operational change since the Royal Commission. The change is not another technology rollout. It is a shift in what work is, who does it, and what leaders need to know how to do.
          </p>
          <p style={{ fontFamily: inter, fontSize: 15, lineHeight: 1.65, color: C.textMuted, ...reveal(350) }}>
            Most organisations meet that change with consulting. A six-month engagement, a workshop series, a final report, a sign-off. The consultant leaves, the operating layer carries on as before, and the capability gap stays open. Most AI vendors meet it the other way. Install the platform, train on the features, hand the leadership development to someone else.
          </p>
          <p style={{ fontFamily: inter, fontSize: 15, lineHeight: 1.65, color: C.textMuted, ...reveal(500) }}>
            Chris OS does both. The agent layer does the operational work that used to fill leaders' weeks. The change implementation layer develops the human capability to lead in the hybrid environment the agents create. Both, every fortnight, in the same operating system.
          </p>
          <p style={{ fontFamily: inter, fontSize: 15, lineHeight: 1.65, color: C.textMuted, ...reveal(650) }}>
            Human-centred. AI-supported. Built on the Genos emotional intelligence model, founded by Dr Ben Palmer (virtual co-founder of Chris OS) and grounded in over twenty years of peer-reviewed research. Genos is among the most widely deployed EI assessments in healthcare and aged care globally.
          </p>
        </div>

        {/* Genos EI framework — integrated visual + expandable detail */}
        <div className="mb-12" style={reveal(750)}>
          <p className="text-[10px] font-medium uppercase tracking-[0.08em] mb-2" style={{ fontFamily: inter, color: C.sage }}>The Genos EI framework</p>
          <p className="text-[13px] mb-6" style={{ fontFamily: inter, color: C.textFaint }}>Six competencies. Each measurable, each trainable, each integrated into Team Loop and Leader Loop.</p>
          <GenosFramework />
        </div>

        {/* Two cards — collapsible, with simultaneous reveal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6" style={reveal(850)}>
          {/* Team Loop */}
          <LoopCard
            eyebrow="Team Loop" color={C.sage}
            headline={<>Fortnightly. <span style={{ fontFamily: fraunces, fontStyle: "italic" }}>Measured.</span> In the flow of work.</>}
            paragraphs={[
              { text: "One pulse, one briefing, one practice, every fortnight. Chris delivers each team leader a briefing on their phone before the morning huddle. The leader runs the practice with the team. The next pulse measures the shift.", size: 15, primary: true },
              { text: "Pulse questions drawn from a library of fourteen domains covering team voice, trust, psychological safety, recognition, role clarity, and the dimensions Genos research shows predict team performance under change.", size: 14, primary: false },
            ]}
            pullQuote={{ before: "When agents start drafting SIRS notifications, surfacing convergence patterns, and queueing actions for review, frontline teams need a ", emphasis: "different relationship", after: " with information, with their leader, and with each other. The Team Loop builds that relationship in the flow of work, every fortnight, calibrated to what the team is actually carrying." }}
            comparison={{ text: "The change consulting alternative: a six-month engagement that ends. Team Loop runs continuously, integrated with the operating layer.", rows: TEAM_LOOP_COMPARE }}
          />

          {/* Leader Loop */}
          <LoopCard
            eyebrow="Leader Loop" color={C.sage}
            headline={<>Continuous. Tied to <span style={{ fontFamily: fraunces, fontStyle: "italic" }}>live</span> operational signals.</>}
            paragraphs={[
              { text: "Each leader gets a Leader Loop briefing on the alternate fortnight. Their personal practice is tied to the operational signals their team is showing this week, not to a generic competency framework.", size: 15, primary: true },
              { text: "Powered by Genos psychometrics. The Emotional Culture Index reads the team's lived experience. The Genos Leader's 360 reads how the leader shows up. Both feed into Chris's support prompts.", size: 14, primary: false },
            ]}
            pullQuote={{ before: "Leaders in AI-augmented organisations are doing different work. Less drafting, more interpreting. Less reporting, more deciding. Less data-pulling, more pattern-reading. The capability shift is ", emphasis: "real and it is uncomfortable.", after: " The Leader Loop develops the EI capability that lets leaders sit with the discomfort, lead through it, and bring their teams with them." }}
            comparison={{ text: "The change consulting alternative: an executive coaching engagement at $300 to $500 per hour, disconnected from the work. Leader Loop runs every fortnight, alternating with Team Loop, at a fraction of executive coaching cost across the leader headcount.", rows: LEADER_LOOP_COMPARE }}
          />
        </div>

        {/* Move 1: fortnightly cadence visualisation */}
        <div className="mb-10 rounded-[5px] p-5 lg:p-6" style={{ backgroundColor: C.card, border: `0.5px solid ${C.border}`, ...reveal(1000) }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              { label: "Week 1: Team Loop", items: ["Pulse opens", "Briefing delivered", "Practice runs", "Pulse closes"], active: isTeamWeek },
              { label: "Week 2: Leader Loop", items: ["Briefing delivered", "Personal practice week", "", ""], active: !isTeamWeek },
            ].map((week) => (
              <div key={week.label}>
                <p className="text-[10px] font-medium uppercase tracking-[0.08em] mb-3" style={{ fontFamily: inter, color: C.sage }}>{week.label}</p>
                <div className="flex items-center gap-0">
                  {[0, 1, 2, 3, 4, 5, 6].map((d) => {
                    const dayIndex = week.active ? d : d + 7;
                    const isToday = dayIndex === dayOfFortnight;
                    const hasLabel = week.items[Math.floor(d * week.items.filter(Boolean).length / 7)];
                    return (
                      <div key={d} className="flex-1 flex flex-col items-center">
                        <div className="w-full h-[2px] mb-1.5" style={{ backgroundColor: d <= (week.active ? dayOfFortnight % 7 : (dayOfFortnight - 7) % 7) && week.active === isTeamWeek ? C.ironstone : C.border, transition: "background-color 600ms" }} />
                        {isToday ? (
                          <span className="w-[6px] h-[6px] rounded-full animate-pulse" style={{ backgroundColor: C.ironstone }} />
                        ) : (
                          <span className="w-[3px] h-[3px] rounded-full" style={{ backgroundColor: C.border }} />
                        )}
                        {d < week.items.length && week.items[d] && (
                          <span className="text-[9px] mt-1 text-center leading-tight" style={{ color: C.textFaint }}>{week.items[d]}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why this matters now — with reveal */}
        <div className="max-w-[660px] mb-6" style={reveal(1200)}>
          <p className="text-[10px] font-medium uppercase tracking-[0.08em] mb-3" style={{ fontFamily: inter, color: C.sage }}>Why this matters now</p>
          <div className="space-y-4">
            <p className="text-[15px] leading-[1.65]" style={{ fontFamily: inter, color: C.text }}>Twenty years of EI research tells us emotional intelligence is the strongest predictor of how leaders and teams adapt to change. AI is not an exception to that. It is the test case.</p>
            <p className="text-[15px] leading-[1.65]" style={{ fontFamily: inter, color: C.text }}>The leaders who develop the EI capability to lead in the hybrid environment build the cultures that absorb AI adoption successfully. The ones who do not burn out, attrition out, or hold the change back.</p>
            <p className="text-[15px] leading-[1.65]" style={{ fontFamily: inter, color: C.text }}>Chris OS is the operating layer that does the work and develops the capability. Operationalised. Continuous. Tied to actual operations rather than to a generic transformation playbook. Genos-grounded and peer-reviewed where the consulting alternative is anecdote and PowerPoint.</p>
          </div>
          <p className="text-[14px] italic mt-4" style={{ fontFamily: inter, color: C.textMuted }}>Pilot pricing from $15,000.</p>
        </div>

        {/* Move 5: live cohort indicator */}
        <div className="flex items-center gap-2 justify-center" style={reveal(1400)}>
          <span className="w-[6px] h-[6px] rounded-full animate-pulse" style={{ backgroundColor: C.ironstone }} />
          <span className="text-[11px]" style={{ fontFamily: inter, color: C.textFaint }}>Cohort live: 4 organisations · 312 residents across the network · next pulse cycle: Monday morning</span>
        </div>
      </div>
    </section>
  );
}

function RolesSection() {
  return (
    <section style={{ backgroundColor: C.canvas }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16 lg:py-24">
        <p className="text-[17px] mb-3" style={{ fontFamily: fraunces, fontStyle: "italic", letterSpacing: "-0.01em", color: C.teal }}>Built for every leader</p>
        <h2 className="mb-3" style={{ fontSize: "clamp(34px, 4vw, 48px)", lineHeight: 1.08, letterSpacing: "-0.025em", fontWeight: 500, color: C.text }}>
          Operational intelligence, in the flow of leadership work. <span style={{ fontFamily: fraunces, fontStyle: "italic", letterSpacing: "-0.012em" }}>Every leader.</span>
        </h2>
        <p className="text-[15px] leading-relaxed max-w-xl mb-12" style={{ color: C.inkMutedLight }}>
          Chris adapts to the role looking at it. The CEO sees the portfolio view. The DON sees clinical and operational signals. The CFO sees the financial intelligence. The WHS Lead sees the psychosocial picture.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {ROLES.map((r) => (
            <div key={r.title} className="border rounded-lg p-5" style={{ backgroundColor: C.white, borderColor: C.border }}>
              <p className="text-[14px] font-medium mb-1" style={{ color: C.inkDark }}>{r.title}</p>
              <p className="text-[13px]" style={{ color: C.inkMutedLight }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [org, setOrg] = useState("");
  const [homes, setHomes] = useState("");
  const [exposure, setExposure] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isLeaderRole = ["CEO", "CFO", "COO", "DON"].includes(role);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email, name, role, organisation: org, homes,
          exposure: exposure || undefined,
          routing: isLeaderRole ? "diagnostic-call" : "waitlist",
          source: "v2_cta_form",
        }),
      });
    } catch {}
    setSubmitted(true);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-white rounded-[8px] max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[17px]" style={{ fontFamily: fraunces, fontStyle: "italic", letterSpacing: "-0.01em", color: C.teal }}>Start a conversation</p>
              <p className="text-[13px] mt-1" style={{ color: C.textMuted }}>No demo deck. No sales pitch. Just your operation and ours.</p>
            </div>
            <button onClick={onClose} className="text-[18px] w-8 h-8 flex items-center justify-center rounded hover:bg-black/5" style={{ color: C.textFaint }}>×</button>
          </div>

          <p className="text-[13px] font-medium mb-5" style={{ color: C.text }}>Pilot pricing from $15,000. Scaled rollouts on application.</p>

          {submitted ? (
            <div className="rounded-[5px] p-5" style={{ border: `0.5px solid ${C.border}` }}>
              <p className="text-[15px] font-medium mb-1" style={{ color: C.teal }}>Received.</p>
              <p className="text-[13px]" style={{ color: C.textMuted }}>
                {isLeaderRole ? "We will be in touch within 48 hours to schedule a diagnostic conversation." : "You are on the list. We onboard in order and will be in touch when there is room."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="px-4 py-2.5 rounded-[4px] text-[13px] focus:outline-none" style={{ border: `0.5px solid ${C.border}`, color: C.text }} />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Work email" className="px-4 py-2.5 rounded-[4px] text-[13px] focus:outline-none" style={{ border: `0.5px solid ${C.border}`, color: C.text }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" required value={org} onChange={(e) => setOrg(e.target.value)} placeholder="Organisation" className="px-4 py-2.5 rounded-[4px] text-[13px] focus:outline-none" style={{ border: `0.5px solid ${C.border}`, color: C.text }} />
                <select required value={role} onChange={(e) => setRole(e.target.value)} className="px-4 py-2.5 rounded-[4px] text-[13px] focus:outline-none" style={{ border: `0.5px solid ${C.border}`, color: role ? C.text : C.textFaint }}>
                  <option value="">Role</option>
                  {["CEO", "CFO", "COO", "DON", "Quality Lead", "WHS Lead", "Facility Manager", "Other"].map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <input type="text" value={homes} onChange={(e) => setHomes(e.target.value)} placeholder="Number of homes (optional)" className="w-full px-4 py-2.5 rounded-[4px] text-[13px] focus:outline-none" style={{ border: `0.5px solid ${C.border}`, color: C.text }} />
              <textarea value={exposure} onChange={(e) => setExposure(e.target.value)} placeholder="What is your single biggest exposure right now? (optional)" rows={2} className="w-full px-4 py-2.5 rounded-[4px] text-[13px] focus:outline-none resize-none" style={{ border: `0.5px solid ${C.border}`, color: C.text }} />
              <button type="submit" className="w-full py-3 rounded-[4px] text-[14px] font-medium" style={{ backgroundColor: C.ctaBg, color: C.ctaText }}>
                Start a conversation →
              </button>
              <p className="text-[11px]" style={{ color: C.textFaint }}>No spam. No sales calls. Just a conversation about your facility.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Client proof section ────────────────────────────────────────────────────
const CLIENTS = [
  { name: "Harbison Care", logo: "/logos/harbison.png", fact: "Leading residential aged care innovator. 2 large sites, 350 staff." },
  { name: "Kinyara Health", logo: "/logos/kinyara.png", fact: "PE-backed home care and NDIS operator. Five brands along the East Coast." },
  { name: "365 Care", logo: "/logos/365care.png", fact: "Home care and NDIS provider. Western Sydney." },
  { name: "Homewell", logo: "/logos/homewell.png", fact: "Home care and NDIS provider. Melbourne." },
];

function LiveFacilityView() {
  return (
    <section style={{ backgroundColor: C.canvasLight }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-14 lg:py-18">
        <p className="text-[12px] mb-6" style={{ color: C.textFaint }}>Three live panels from a 60-bed NSW facility, captured Monday morning.</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ReviewQueueCard />
          <CareMinutesCard />
          <AgentActivityCard />
        </div>
      </div>
    </section>
  );
}

function ClientProof() {
  return (
    <section style={{ backgroundColor: "#FFFFFF" }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-14 lg:py-18">
        {/* Eyebrow + lead */}
        <p className="text-[17px] mb-2" style={{ fontFamily: fraunces, fontStyle: "italic", letterSpacing: "-0.01em", color: C.teal }}>6 months from the first idea. Four organisations.</p>
        <p className="text-[15px] leading-[1.6] max-w-[560px] mb-10" style={{ color: C.textMuted }}>
          6 months from the first idea. Four organisations across residential, home care and NDIS, including a multi-brand provider group.
        </p>

        {/* Logo cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {CLIENTS.map((client) => (
            <div key={client.name} className="flex flex-col items-start">
              <div className="h-[36px] flex items-center mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={client.logo} alt={client.name} className="h-full w-auto max-w-[140px] object-contain" style={{ filter: "grayscale(0.2)" }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden"); }}
                />
                <span className="hidden text-[16px] font-medium" style={{ color: C.text }}>{client.name}</span>
              </div>
              <p className="text-[12px] leading-[1.5]" style={{ color: C.textFaint }}>{client.fact}</p>
            </div>
          ))}
        </div>

        {/* Outcomes strip hidden until we have verified data. Uncomment when ready.
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          {[
            { value: "Zero", label: "missed regulatory deadlines across all pilots" },
            { value: "$X", label: "AN-ACC uplift identified" },
            { value: "Y", label: "hours per week returned to facility leadership" },
            { value: "Z", label: "workflows live in production" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-[5px] p-4" style={{ border: `0.5px solid ${C.border}` }}>
              <p className="text-[18px] font-medium tracking-[-0.02em] mb-1" style={{ color: C.teal }}>{stat.value}</p>
              <p className="text-[12px] leading-[1.5]" style={{ color: C.textMuted }}>{stat.label}</p>
            </div>
          ))}
        </div>
        */}
      </div>
    </section>
  );
}

function VictorianHook() {
  return (
    <section style={{ backgroundColor: C.canvas }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 pb-10">
        <Link href="/tools/psh-assessment?jurisdiction=victoria"
          className="block rounded-[5px] p-5 lg:p-6 transition-all hover:-translate-y-0.5"
          style={{ backgroundColor: C.card, border: `0.5px solid ${C.border}` }}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: C.warn }} />
              <span className="text-[11px] font-medium uppercase tracking-[0.08em]" style={{ color: C.warn }}>Regulatory update</span>
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-medium" style={{ color: C.text }}>Victorian providers: see your December 2025 amendment exposure.</p>
              <p className="text-[12px] mt-0.5" style={{ color: C.textMuted }}>The Victorian Occupational Health and Safety Amendment (Psychosocial Hazards) commenced December 2025. Run the PSH self-assessment with the Victorian filter applied.</p>
            </div>
            <span className="text-[13px] font-medium shrink-0" style={{ color: C.teal }}>Check your exposure →</span>
          </div>
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ backgroundColor: C.canvas, borderTop: `0.5px solid ${C.border}` }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider mb-3" style={{ color: C.textFaint }}>Product</p>
            <div className="space-y-2">
              {[["Tools", "/tools/care-minutes"], ["Technology", "/technology"], ["Newsroom", "/newsroom"], ["Book a conversation", "#book"]].map(([label, href]) => (
                <Link key={label} href={href} className="block text-[13px] hover:opacity-70" style={{ color: C.textMuted }}>{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider mb-3" style={{ color: C.textFaint }}>Company</p>
            <div className="space-y-2">
              <a href="mailto:hello@culturecrunch.io" className="block text-[13px] hover:opacity-70" style={{ color: C.textMuted }}>Contact</a>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider mb-3" style={{ color: C.textFaint }}>Legal</p>
            <div className="space-y-2">
              {[["Privacy", "/legal"], ["Security & trust", "/trust"], ["Sources & references", "/dashboard/references"]].map(([label, href]) => (
                <Link key={label} href={href} className="block text-[13px] hover:opacity-70" style={{ color: C.textMuted }}>{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider mb-3" style={{ color: C.textFaint }}>Status</p>
            <p className="text-[13px]" style={{ color: C.textMuted }}>Live in NSW & VIC</p>
            <p className="text-[11px] mt-1" style={{ color: C.textFaint }}>australia-southeast1</p>
          </div>
        </div>
        <div className="pt-6 flex items-center justify-between flex-wrap gap-3" style={{ borderTop: `0.5px solid ${C.border}` }}>
          <div>
            <span className="text-[14px] font-medium" style={{ color: C.text }}>Chris<span style={{ color: C.teal }}>·</span>OS</span>
            <p className="text-[12px] mt-1" style={{ color: C.textFaint }}>Operational intelligence and execution for Australian aged care. Built by Culture Crunch.</p>
          </div>
          <span className="text-[11px]" style={{ color: C.textFaint }}>© 2026 Culture Crunch Pty Ltd</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function V2Page() {
  const [showBooking, setShowBooking] = useState(false);

  // Global click handler for all booking CTAs
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href="#book"]');
      if (anchor) { e.preventDefault(); setShowBooking(true); }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div style={{ fontFamily: sans, backgroundColor: C.paper, position: "relative" }}>
      {/* Paper texture overlay */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: `radial-gradient(circle at 25% 30%, rgba(120,110,90,0.05) 1px, transparent 1.5px), radial-gradient(circle at 75% 70%, rgba(120,110,90,0.04) 1px, transparent 1.5px), radial-gradient(circle at 50% 50%, rgba(120,110,90,0.03) 1px, transparent 1px)`,
        backgroundSize: "7px 7px, 11px 11px, 5px 5px",
        mixBlendMode: "multiply",
        opacity: 0.5,
      }} />
      <div className="relative z-[1]">
      {/* Font loading: Fraunces (variable, ital) + Inter 400-600 */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..500;1,9..144,300..500&family=Inter:wght@400;500;600&display=swap" />
      <Nav />
      <Hero />
      {/* Section 2: Mt Gibraltar morning narrative */}
      <WhatChrisIsSection />
      {/* Section 3: Customer proof */}
      <ClientProof />
      {/* Section 4: Live facility view (cards moved from hero) */}
      <LiveFacilityView />
      {/* Section 5: Self-service tools */}
      <StatRow />
      <ToolsStrip />
      <VictorianHook />
      {/* Section 6: Scenarios */}
      <ScenarioSection />
      <FoundersSection />
      <HonestAnswersSection />
      <HowItWorksSection />
      <JobsSection />
      <ExecutionSection />
      <ChangeImplementationLayer />
      <Footer />
      </div>{/* close relative z-[1] wrapper */}

      {/* Currently watching indicator — fixed bottom-right, desktop only */}
      <div className="fixed bottom-[22px] right-[28px] z-50 hidden lg:flex items-center gap-[11px] px-[15px] py-[9px] backdrop-blur-[8px]"
        style={{ fontFamily: sans, fontSize: 11, fontWeight: 400, letterSpacing: "0.04em", color: C.textSoft, backgroundColor: "rgba(243,239,230,0.94)", border: `1px solid ${C.ruleCharcoal}` }}>
        <span className="w-[6px] h-[6px] rounded-full animate-pulse" style={{ backgroundColor: C.ironstone }} />
        <span>4 facilities · 312 residents · 0 immediate findings</span>
      </div>

      <BookingModal open={showBooking} onClose={() => setShowBooking(false)} />
    </div>
  );
}
