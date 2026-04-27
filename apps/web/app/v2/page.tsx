"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import ChrisPublicChat from "@/components/ChrisPublicChat";
import { CareMinutesCard } from "@/components/marketing/cards/CareMinutesCard";
import { ReviewQueueCard } from "@/components/marketing/cards/ReviewQueueCard";
import { AgentActivityCard } from "@/components/marketing/cards/AgentActivityCard";

// ─── Brand tokens (Direction F — aubergine) ─────────────────────────────────
const C = {
  dark: "#1a1218",
  dark2: "#2d1f2a",
  cream: "#faf7f2",
  white: "#ffffff",
  ink: "#f5ede3",
  inkMuted: "rgba(245,237,227,0.78)",
  inkDark: "#1a1218",
  inkMutedLight: "rgba(26,18,24,0.78)",
  copper: "#c89a3c",
  copperDark: "#8b6914",
  warm: "#c4674a",
  good: "#2d6a4f",
  warn: "#b5572a",
};

// ─── Data ───────────────────────────────────────────────────────────────────

const TOOLS = [
  {
    title: "Care minutes & supplement",
    blurb: "Are you meeting 215/44? See your compliance position and your financial exposure.",
    cta: "Run the check →",
    href: "/tools/care-minutes",
    stat: "45.9%",
    statLabel: "of services meeting both targets nationally",
    accent: C.warm,
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="11" stroke="#b5572a" strokeWidth="2.5" strokeDasharray="56 14" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" from="0 14 14" to="360 14 14" dur="20s" repeatCount="indefinite" /></circle>
        <text x="14" y="17" textAnchor="middle" fill="#b5572a" fontSize="8" fontWeight="700" fontFamily="system-ui">215</text>
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
    accent: C.good,
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        {[0, 1, 2, 3, 4, 5].map((i) => { const a = (i * 60 - 90) * Math.PI / 180; return <circle key={i} cx={14 + 9 * Math.cos(a)} cy={14 + 9 * Math.sin(a)} r="3" fill="#2d6a4f" fillOpacity={0.15 + i * 0.12}><animate attributeName="fillOpacity" values={`${0.15 + i * 0.12};${0.5 + i * 0.08};${0.15 + i * 0.12}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" /></circle>; })}
        <circle cx="14" cy="14" r="4" fill="#2d6a4f" fillOpacity="0.3" />
      </svg>
    ),
  },
  {
    title: "EX workforce ROI",
    blurb: "What's turnover, agency dependence, and burnout costing you? Modelled on your facility.",
    cta: "Calculate ROI →",
    href: "/tools/ex-roi",
    stat: "28%",
    statLabel: "average aged care turnover rate. What's yours costing?",
    accent: C.copper,
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 22 L10 14 L16 17 L24 6" stroke="#c89a3c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="24" cy="6" r="3" fill="#c89a3c" fillOpacity="0.3"><animate attributeName="r" values="2.5;3.5;2.5" dur="2s" repeatCount="indefinite" /></circle>
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
    accent: "#2D7D73",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="4" width="20" height="20" rx="4" stroke="#2D7D73" strokeWidth="2" />
        <path d="M9 10h10M9 14h7M9 18h4" stroke="#2D7D73" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="22" cy="8" r="3" fill="#2D7D73" fillOpacity="0.4"><animate attributeName="fillOpacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" /></circle>
      </svg>
    ),
  },
];

const STATS = [
  { number: "$1.5M", label: "Maximum corporate penalty · serious failure · Aged Care Act 2024", color: C.warm },
  { number: "549,000", label: "Aged care workers · no operational OS · until now", color: C.copper },
  { number: "16", label: "Mandated psychosocial hazards · one spreadsheet between them and you", color: C.good },
  { number: "$159K", label: "Spent annually per facility · leaders stitching together 8 systems that should talk to each other", color: C.copper },
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

// ─── Components ─────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav className="sticky top-0 z-50 transition-colors" style={{ backgroundColor: C.dark, borderBottom: `1px solid rgba(245,237,227,0.08)` }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 lg:px-16 py-4">
        <Link href="/v2" className="text-[15px] font-medium tracking-tight" style={{ color: C.ink }}>
          Chris<span style={{ color: C.copper }}>·</span>OS
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/tools/care-minutes" className="text-[13px] hidden md:block transition-colors hover:opacity-80" style={{ color: C.inkMuted }}>Tools</Link>
          <Link href="/technology" className="text-[13px] hidden md:block transition-colors hover:opacity-80" style={{ color: C.inkMuted }}>Technology</Link>
          <Link href="/newsroom" className="text-[13px] hidden md:block transition-colors hover:opacity-80" style={{ color: C.inkMuted }}>Newsroom</Link>
          <a href="#book" className="text-[13px] font-medium px-5 py-2 rounded transition-colors" style={{ backgroundColor: C.copper, color: C.dark }}>
            Book a conversation
          </a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: C.dark }}>
      {/* Grain texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "200px 200px" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-16 pt-16 lg:pt-24 pb-20 lg:pb-28">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-[11px] font-medium tracking-[0.15em] uppercase mb-8" style={{ color: C.copper }}>
            Live with providers in NSW and VIC
          </div>

          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.12] tracking-[-0.02em] mb-5" style={{ color: "#ffffff" }}>
            Hold quality. Protect margin. Lead with confidence.
          </h1>

          <p className="text-[17px] leading-[1.65] max-w-[540px] mx-auto mb-10" style={{ color: "rgba(245,237,227,0.7)" }}>
            In aged care, problems chain across domains. Rosters into clinical into compliance into cost. Chris makes the chain legible, supports your leaders today, and extends across clinical, workforce, finance, compliance and governance.
          </p>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <a href="#book" className="px-7 py-3.5 rounded text-[14px] font-medium transition-colors hover:opacity-90" style={{ backgroundColor: C.warm, color: "#ffffff" }}>
              Book a 30-min conversation
            </a>
            <a href="#how-it-works" className="px-7 py-3.5 rounded text-[14px] transition-colors" style={{ border: `1px solid rgba(245,237,227,0.25)`, color: "rgba(245,237,227,0.65)" }}>
              How Chris works, layer by layer →
            </a>
          </div>
        </div>
      </div>

      {/* Product cards — 3 live UI cards, symmetric, Care Minutes centre + tallest */}
      <div className="relative z-10 max-w-[1060px] mx-auto px-6 lg:px-8 mt-6 lg:mt-8 pb-10 lg:pb-14">
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-center gap-5">
          {/* Left — Review Queue (same width, aligned to bottom) */}
          <div className="w-full lg:w-[300px] shrink-0">
            <ReviewQueueCard />
          </div>
          {/* Centre — Care Minutes (wider + taller, rises above sides) */}
          <div className="w-full lg:w-[380px] lg:-mb-8 shrink-0">
            <CareMinutesCard />
          </div>
          {/* Right — Agent Activity (same width as left, aligned to bottom) */}
          <div className="w-full lg:w-[300px] shrink-0">
            <AgentActivityCard />
          </div>
        </div>
      </div>
    </section>
  );
}

function AgentRibbon() {
  const items = [
    { agent: "SENTINEL", color: "#2d6a4f", text: "Care minutes at 180 · RN gap detected · afternoon shift unfilled" },
    { agent: "ORACLE", color: "#c89a3c", text: "3 AN-ACC reclassification opportunities · $11.4K/month identified" },
    { agent: "STEWARD", color: "#2d6a4f", text: "Sunday PM structural gap confirmed · 7th consecutive week" },
    { agent: "CHRONICLER", color: "#c4674a", text: "SIRS Priority 1 draft ready · awaiting DON review" },
    { agent: "KEEPER", color: "#c4674a", text: "Turnover precursor detected · Grevillea Wing · PSH_13 declining" },
    { agent: "TOWN CRIER", color: "#2d6a4f", text: "Oracle + Steward merged · 1 coordinated recommendation delivered" },
    { agent: "CURATOR", color: "#8aa888", text: "ACQSC compliance decision published · 2 new regulatory updates" },
  ];
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden" style={{ backgroundColor: C.copper, borderTop: `1px solid rgba(255,255,255,0.15)`, borderBottom: `1px solid rgba(255,255,255,0.15)` }}>
      <div className="flex items-center h-11 animate-ticker whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-[11px] tracking-wide mx-6 shrink-0" style={{ color: "rgba(26,18,24,0.55)" }}>
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="font-semibold uppercase tracking-wider text-[10px]" style={{ color: C.dark }}>{item.agent}</span>
            <span style={{ color: "rgba(26,18,24,0.3)" }}>·</span>
            <span style={{ color: "rgba(26,18,24,0.7)" }}>{item.text}</span>
          </span>
        ))}
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

function WhatChrisIsSection() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const cards = [
    {
      eyebrow: "Agentic AI",
      headline: "Software that doesn\u2019t wait to be asked.",
      body: "Chris reads what's happening across your operation, decides what matters, and takes the next step. Drafts the SIRS notification. Logs the supervision check-in. Flags the roster gap before it becomes a clinical incident. Built for the work aged care leaders actually do, not for generic enterprise.",
    },
    {
      eyebrow: "Reads",
      headline: "Connects to your existing stack.",
      body: "Chris reads from the systems your operators already use: clinical, rostering, finance, compliance, family. No migration. No re-platforming. No schema mapping. Your data stays where it is.",
    },
    {
      eyebrow: "Acts",
      headline: "Productivity, not paperwork.",
      body: "Chris doesn't just see. It acts. Drafts briefings, logs actions, sends follow-ups, prepares board materials, surfaces convergence patterns to the leaders who can act on them. The work your operators do not have time for, handled by agents working alongside them.",
    },
    {
      eyebrow: "Compliance",
      headline: "Reports straight to GPMS via the B2G gateway.",
      body: "Aligned with the Aged Care Act 2024. Chris connects to the Government Provider Management System through the Business-to-Government APIs. Mandatory reporting flows from your operation to the Department of Health, the Aged Care Quality and Safety Commission, and the NDIA without manual handling.",
    },
  ];

  return (
    <section style={{ backgroundColor: C.dark }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-14 lg:py-20">
        {/* Headline block */}
        <div className="text-center max-w-[60ch] mx-auto mb-12 lg:mb-16">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: C.copper }}>What Chris is</p>
          <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-bold leading-[1.08] tracking-[-0.02em] mb-5" style={{ color: "#ffffff" }}>
            The intelligence layer between your stack and your leaders.
          </h2>
          <p className="text-[17px] leading-[1.7]" style={{ color: "rgba(245,237,227,0.6)" }}>
            Chris reads what your systems already capture, surfaces what matters, and acts on the productivity work your operators don&apos;t have time for. Cross-domain agents, built for aged care.
          </p>
        </div>

        {/* Vertical architecture diagram: Systems → Chris → Leaders */}
        <div className="max-w-lg mx-auto mb-14 lg:mb-18">
          {/* Band 1: Systems (bottom of stack, shown first = top visually for vertical reading) */}
          <div className="rounded-2xl p-5 lg:p-6" style={{ backgroundColor: C.cream, border: "1px solid rgba(26,18,24,0.06)", boxShadow: "0 2px 12px rgba(0,0,0,0.03)" }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] mb-3 text-center" style={{ color: "rgba(26,18,24,0.4)" }}>The systems you already run</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {ARCH_SYSTEMS.map((sys) => (
                <span key={sys.name} className="text-[11px] font-bold px-3 py-1.5 rounded-lg" style={{ backgroundColor: `${sys.color}12`, color: sys.color }}>{sys.name}</span>
              ))}
            </div>
          </div>

          {/* Arrow: READS ↓ */}
          <div className="flex flex-col items-center py-3">
            <span className="text-[9px] font-bold uppercase tracking-[0.15em] mb-1" style={{ color: C.good }}>Reads</span>
            <svg width="14" height="28" viewBox="0 0 14 28" fill="none"><path d="M7 0v24M3 20l4 4 4-4" stroke={C.good} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>

          {/* Band 2: Chris (the intelligence layer) */}
          <div className="rounded-2xl p-5 lg:p-6 relative" style={{ background: `linear-gradient(180deg, ${C.dark2}, rgba(45,106,79,0.2))`, border: "1px solid rgba(200,154,60,0.2)", boxShadow: "0 0 40px rgba(200,154,60,0.06)" }}>
            <p className="text-[13px] font-bold uppercase tracking-[0.12em] mb-4 text-center" style={{ color: C.copper }}>Chris</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {ARCH_AGENTS.map((agent) => (
                <div key={agent.name} className="flex flex-col items-center gap-1">
                  <span className="text-[13px] font-bold px-4 py-2 rounded-lg" style={{ backgroundColor: `${agent.color}20`, color: agent.color, boxShadow: `0 0 12px ${agent.color}15` }}>{agent.name}</span>
                  <span className="text-[10px] font-medium" style={{ color: "rgba(245,237,227,0.4)" }}>{agent.verb}</span>
                </div>
              ))}
              <div className="flex flex-col items-center gap-1">
                <span className="text-[13px] font-medium px-4 py-2 rounded-lg" style={{ backgroundColor: "rgba(245,237,227,0.06)", color: "rgba(245,237,227,0.3)" }}>+ 6 more</span>
                <span className="text-[10px]" style={{ color: "rgba(245,237,227,0.2)" }}>in build</span>
              </div>
            </div>
          </div>

          {/* Arrows: SUPPORTS + ACTS ↓ */}
          <div className="flex items-center justify-center gap-10 py-3">
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold uppercase tracking-[0.15em] mb-1" style={{ color: C.good }}>Supports</span>
              <svg width="14" height="28" viewBox="0 0 14 28" fill="none"><path d="M7 0v24M3 20l4 4 4-4" stroke={C.good} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold uppercase tracking-[0.15em] mb-1" style={{ color: C.copper }}>Acts</span>
              <svg width="14" height="28" viewBox="0 0 14 28" fill="none"><path d="M7 0v24M3 20l4 4 4-4" stroke={C.copper} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>

          {/* Band 3: Leaders */}
          <div className="rounded-2xl p-5 lg:p-6" style={{ backgroundColor: C.cream, border: "1px solid rgba(45,106,79,0.12)", boxShadow: "0 2px 12px rgba(0,0,0,0.03)" }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] mb-3 text-center" style={{ color: "rgba(26,18,24,0.4)" }}>Your leaders</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {ARCH_ROLES.map((role) => (
                <span key={role} className="text-[12px] font-semibold px-3 py-1.5 rounded-lg" style={{ backgroundColor: "rgba(26,18,24,0.04)", color: "rgba(26,18,24,0.6)" }}>{role}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Four explainer cards with progressive disclosure */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {cards.map((card, i) => {
            const isOpen = expanded === i;
            return (
              <button key={card.eyebrow} onClick={() => setExpanded(isOpen ? null : i)}
                className="rounded-xl text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ backgroundColor: "#fff", boxShadow: isOpen ? "0 4px 20px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)" }}>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: C.copper }}>{card.eyebrow}</p>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                      <path d="M8 3v10M3 8h10" stroke={C.copper} strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <h3 className="text-[16px] font-bold mb-1 leading-snug" style={{ color: C.inkDark }}>{card.headline}</h3>
                  <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[200px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
                    <p className="text-[13px] leading-[1.65]" style={{ color: "rgba(26,18,24,0.55)" }}>{card.body}</p>
                  </div>
                  {!isOpen && <p className="text-[11px] mt-1" style={{ color: "rgba(26,18,24,0.3)" }}>Tap to read more</p>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Live status line */}
        <div className="text-center">
          <p className="text-[13px]" style={{ color: "rgba(245,237,227,0.45)" }}>
            <span className="inline-flex items-center gap-1.5 mr-1"><span className="w-2 h-2 rounded-full bg-[#2d6a4f] animate-pulse" /></span>
            Eleven agents already running with leaders in NSW and VIC. Seven cross-domain agents in build for clinical, workforce, finance, compliance and governance.
          </p>
        </div>
      </div>
    </section>
  );
}

function ToolsStrip() {
  return (
    <section style={{ backgroundColor: C.dark }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16 lg:py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[11px] font-medium tracking-[0.15em] uppercase mb-4" style={{ color: C.copper }}>
            See your own numbers · 3 minutes · No signup
          </p>
          <h2 className="text-[clamp(1.5rem,3.5vw,2.5rem)] font-normal leading-[1.1] tracking-[-0.01em] mb-4" style={{ fontFamily: "Georgia, serif", color: "#ffffff" }}>
            Three tools. Run them on your facility{" "}
            <em className="italic" style={{ color: C.copper }}>before we ever talk.</em>
          </h2>
          <p className="text-[15px] leading-[1.7] max-w-xl mx-auto" style={{ color: "rgba(245,237,227,0.65)" }}>
            Built on the same intelligence layer Chris runs on. The numbers you see are the numbers we would model on day one.
          </p>
        </div>

        {/* Tool cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TOOLS.map((tool) => (
            <Link key={tool.title} href={tool.href}
              className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
              style={{ backgroundColor: "rgba(245,237,227,0.06)", border: "1px solid rgba(245,237,227,0.1)" }}>
              {/* Accent top bar */}
              <div className="h-1" style={{ background: `linear-gradient(90deg, ${tool.accent}, ${tool.accent}88)` }} />

              <div className="p-6">
                {/* Icon + stat row */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${tool.accent}18` }}>
                    {tool.icon}
                  </div>
                  <div className="text-right">
                    <p className="text-[28px] font-light tracking-tight leading-none" style={{ fontFamily: "Georgia, serif", color: tool.accent }}>{tool.stat}</p>
                  </div>
                </div>

                {/* Stat context */}
                <p className="text-[11px] mb-4 leading-relaxed" style={{ color: "rgba(245,237,227,0.5)" }}>{tool.statLabel}</p>

                {/* Title + blurb */}
                <h3 className="text-[17px] font-semibold mb-2 leading-tight" style={{ color: "#ffffff" }}>{tool.title}</h3>
                <p className="text-[14px] leading-[1.65] mb-5" style={{ color: "rgba(245,237,227,0.7)" }}>{tool.blurb}</p>

                {/* CTA */}
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold transition-colors duration-300" style={{ color: tool.accent }}>{tool.cta}</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M5 3l4 4-4 4" stroke={tool.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 50% 0%, ${tool.accent}0a, transparent 70%)` }} />
            </Link>
          ))}
        </div>

        {/* Trust line */}
        <p className="text-center text-[12px] mt-8" style={{ color: "rgba(245,237,227,0.4)" }}>
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
    <section style={{ backgroundColor: C.cream, borderTop: "1px solid rgba(26,18,24,0.04)" }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-14 lg:py-20">
        <div className="text-center mb-10">
          <p className="text-[11px] font-medium tracking-[0.12em] uppercase mb-3" style={{ color: C.good }}>Integrations</p>
          <h2 className="text-[clamp(1.3rem,3vw,2rem)] font-normal leading-[1.15] tracking-[-0.01em] mb-3" style={{ fontFamily: "Georgia, serif", color: C.inkDark }}>
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
                <p className="text-[10px] mt-0.5 font-medium" style={{ color: "rgba(26,18,24,0.4)" }}>{int.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-[12px] leading-relaxed" style={{ color: "rgba(26,18,24,0.4)" }}>
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
    <section style={{ backgroundColor: C.cream }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 pb-14 lg:pb-20">
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#fff", border: "1px solid rgba(26,18,24,0.06)", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:gap-10 p-6 lg:p-8 items-center">
            <div>
              <p className="text-[10px] font-medium tracking-[0.12em] uppercase mb-2" style={{ color: C.good }}>Compliance, handled</p>
              <h3 className="text-[clamp(1.1rem,2.5vw,1.5rem)] font-normal leading-[1.2] mb-3" style={{ fontFamily: "Georgia, serif", color: C.inkDark }}>
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
    pills: ["Native Integrations", "Living Memory", "Zero Migration"], accent: C.good },
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
  return (
    <svg viewBox="0 0 400 300" fill="none" className="w-full h-full">
      <rect width="400" height="300" rx="16" fill="rgba(45,106,79,0.04)" />
      {[{ cx: 60, cy: 60, l: "Clinical" }, { cx: 60, cy: 150, l: "Roster" }, { cx: 60, cy: 240, l: "Finance" }, { cx: 170, cy: 45, l: "Compliance" }, { cx: 170, cy: 255, l: "Family" }].map((n, i) => (
        <g key={i}>
          <line x1={n.cx + 30} y1={n.cy} x2={280} y2={150} stroke={C.good} strokeWidth="1.5" strokeOpacity="0.2" strokeDasharray="4 4"><animate attributeName="stroke-dashoffset" from="8" to="0" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" /></line>
          <circle cx={n.cx} cy={n.cy} r="22" fill="#fff" stroke={C.good} strokeWidth="1.5" strokeOpacity="0.3" />
          <circle cx={n.cx} cy={n.cy} r="3" fill={C.good} fillOpacity="0.6" />
          <text x={n.cx} y={n.cy + 36} textAnchor="middle" fill="rgba(26,18,24,0.35)" fontSize="9" fontFamily="system-ui">{n.l}</text>
        </g>
      ))}
      <circle cx="300" cy="150" r="48" fill="#fff" stroke={C.good} strokeWidth="2" strokeOpacity="0.3" />
      <circle cx="300" cy="150" r="32" fill="rgba(45,106,79,0.08)" />
      <circle cx="300" cy="150" r="6" fill={C.good}><animate attributeName="r" values="5;7;5" dur="3s" repeatCount="indefinite" /></circle>
      <text x="300" y="215" textAnchor="middle" fill={C.inkDark} fontSize="11" fontWeight="500" fontFamily="system-ui">One view</text>
    </svg>
  );
}

function HIWWatchSVG() {
  return (
    <svg viewBox="0 0 400 300" fill="none" className="w-full h-full">
      <rect width="400" height="300" rx="16" fill="rgba(45,106,79,0.03)" />
      {[[140, 75], [200, 75], [260, 75], [110, 130], [170, 130], [230, 130], [290, 130], [140, 185], [200, 185], [260, 185], [170, 240], [230, 240]].map(([cx, cy], i) => {
        const on = [1, 4, 5, 8, 10].includes(i);
        return (
          <g key={i}>
            <polygon points={`${cx},${cy! - 22} ${cx! + 19},${cy! - 11} ${cx! + 19},${cy! + 11} ${cx},${cy! + 22} ${cx! - 19},${cy! + 11} ${cx! - 19},${cy! - 11}`}
              fill={on ? "rgba(45,106,79,0.08)" : "rgba(26,18,24,0.02)"} stroke={on ? C.good : "rgba(26,18,24,0.08)"} strokeWidth="1" strokeOpacity={on ? "0.4" : "1"} />
            {on && <circle cx={cx} cy={cy} r="4" fill={C.good} fillOpacity="0.5"><animate attributeName="fillOpacity" values="0.3;0.7;0.3" dur={`${2 + i * 0.2}s`} repeatCount="indefinite" /></circle>}
          </g>
        );
      })}
      {[[200, 75, 170, 130], [200, 75, 230, 130], [170, 130, 200, 185], [230, 130, 200, 185], [200, 185, 230, 240]].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.good} strokeWidth="1" strokeOpacity="0.2"><animate attributeName="strokeOpacity" values="0.1;0.35;0.1" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" /></line>
      ))}
      {[[55, 90, "Workforce"], [55, 150, "Clinical"], [55, 210, "Finance"], [330, 90, "Compliance"], [330, 150, "Governance"], [330, 210, "Quality"]].map(([x, y, label], i) => (
        <text key={i} x={x as number} y={y as number} textAnchor={i < 3 ? "end" : "start"} fill="rgba(26,18,24,0.35)" fontSize="9" fontFamily="system-ui">{label as string}</text>
      ))}
    </svg>
  );
}

function HIWSupportSVG() {
  return (
    <svg viewBox="0 0 400 300" fill="none" className="w-full h-full">
      <rect width="400" height="300" rx="16" fill="rgba(200,154,60,0.04)" />
      <rect x="60" y="45" width="280" height="210" rx="12" fill="#fff" stroke="rgba(26,18,24,0.08)" strokeWidth="1" />
      <rect x="60" y="45" width="280" height="32" rx="12" fill="rgba(26,18,24,0.03)" />
      <rect x="60" y="65" width="280" height="12" fill="rgba(26,18,24,0.03)" />
      <circle cx="78" cy="61" r="4" fill={C.good} fillOpacity="0.4" />
      <circle cx="90" cy="61" r="4" fill={C.copper} fillOpacity="0.4" />
      <circle cx="102" cy="61" r="4" fill="rgba(26,18,24,0.1)" />
      {[{ y: 90, w: 250, color: C.warm, label: "RN gap detected. Sunday PM." },
        { y: 130, w: 220, color: C.good, label: "Care minutes: 188/215. Action needed." },
        { y: 170, w: 240, color: C.good, label: "SIRS Cat 1 draft ready. Review." }].map((c, i) => (
        <g key={i}>
          <rect x="80" y={c.y} width={c.w} height="30" rx="6" fill={c.color} fillOpacity="0.1" stroke={c.color} strokeWidth="1" strokeOpacity="0.15" />
          <circle cx="94" cy={c.y + 15} r="4" fill={c.color} fillOpacity="0.4"><animate attributeName="fillOpacity" values="0.25;0.5;0.25" dur={`${2.5 + i * 0.4}s`} repeatCount="indefinite" /></circle>
          <text x="106" y={c.y + 19} fill="rgba(26,18,24,0.5)" fontSize="9" fontFamily="system-ui">{c.label}</text>
        </g>
      ))}
      <path d="M 94 120 L 94 130 L 94 160 L 94 170" stroke={C.copper} strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.3"><animate attributeName="stroke-dashoffset" from="6" to="0" dur="2s" repeatCount="indefinite" /></path>
      <rect x="80" y="215" width="100" height="24" rx="12" fill="rgba(200,154,60,0.1)" />
      <text x="130" y="231" textAnchor="middle" fill={C.copper} fontSize="9" fontWeight="500" fontFamily="system-ui">DON, Monday 7am</text>
    </svg>
  );
}

function HIWActSVG() {
  return (
    <svg viewBox="0 0 400 300" fill="none" className="w-full h-full">
      <rect width="400" height="300" rx="16" fill="rgba(200,154,60,0.03)" />
      <circle cx="200" cy="150" r="90" fill="none" stroke={C.good} strokeWidth="2" strokeOpacity="0.1" />
      <circle cx="200" cy="150" r="90" fill="none" stroke={C.good} strokeWidth="2.5" strokeOpacity="0.35" strokeDasharray="480 85">
        <animateTransform attributeName="transform" type="rotate" from="0 200 150" to="360 200 150" dur="12s" repeatCount="indefinite" />
      </circle>
      <circle cx="200" cy="150" r="70" fill="none" stroke={C.copper} strokeWidth="2" strokeOpacity="0.15" />
      <circle cx="200" cy="150" r="70" fill="none" stroke={C.copper} strokeWidth="2.5" strokeOpacity="0.4" strokeDasharray="380 60" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" from="360 200 150" to="0 200 150" dur="16s" repeatCount="indefinite" />
      </circle>
      {[{ a: -90, l: "Trigger", c: C.good }, { a: 0, l: "Draft", c: C.good }, { a: 90, l: "Log", c: C.copper }, { a: 180, l: "Close", c: C.copper }].map((m, i) => {
        const rad = (m.a * Math.PI) / 180;
        const cx = 200 + 90 * Math.cos(rad);
        const cy = 150 + 90 * Math.sin(rad);
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r="14" fill="#fff" stroke={m.c} strokeWidth="1.5" strokeOpacity="0.3" />
            <circle cx={cx} cy={cy} r="5" fill={m.c} fillOpacity="0.35" />
            <text x={cx} y={cy + 28} textAnchor="middle" fill="rgba(26,18,24,0.35)" fontSize="9" fontFamily="system-ui">{m.l}</text>
          </g>
        );
      })}
      <circle cx="200" cy="150" r="28" fill="rgba(45,106,79,0.08)" />
      <path d="M 188 150 L 196 158 L 214 140" stroke={C.good} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

const HIW_ILLUSTRATIONS = [HIWConnectSVG, HIWWatchSVG, HIWSupportSVG, HIWActSVG];

function HowItWorksSection() {
  const [active, setActive] = useState(0);
  const [userTouched, setUserTouched] = useState(false);
  const stage = HIW_STAGES[active];
  const Illus = HIW_ILLUSTRATIONS[active];

  useEffect(() => {
    if (userTouched) return;
    const t = setInterval(() => setActive((p) => (p + 1) % 4), 6000);
    return () => clearInterval(t);
  }, [userTouched]);

  return (
    <section id="how-it-works" style={{ backgroundColor: C.cream }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16 lg:py-24">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 mb-14 lg:mb-18">
          <div>
            <p className="text-[11px] font-medium tracking-[0.12em] uppercase mb-4" style={{ color: C.good }}>How it works</p>
            <h2 className="text-[clamp(1.5rem,3.5vw,2.5rem)] font-normal leading-[1.1] tracking-[-0.01em]" style={{ fontFamily: "Georgia, serif", color: C.inkDark }}>
              Aged care, with intelligence in every layer
            </h2>
          </div>
          <div className="lg:pt-8">
            <p className="text-[16px] leading-[1.7]" style={{ color: C.inkMutedLight }}>
              Cross-domain intelligence working alongside your leaders. Reading every system you already run, catching what slips between domains, supporting the people running care, and handling the routine so they can lead.
            </p>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 mb-10 lg:mb-14 overflow-x-auto pb-1">
          {HIW_STAGES.map((s, i) => (
            <button key={s.num} onClick={() => { setActive(i); setUserTouched(true); }}
              className="relative flex-1 min-w-[130px] text-left px-5 py-4 rounded-xl transition-all duration-300"
              style={{
                backgroundColor: active === i ? "#fff" : "transparent",
                boxShadow: active === i ? "0 2px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)" : "none",
              }}>
              <p className="text-[10px] font-medium tracking-[0.1em] uppercase mb-1 transition-colors duration-300"
                style={{ color: active === i ? s.accent : "rgba(26,18,24,0.3)" }}>{s.num}</p>
              <p className="text-[14px] font-medium transition-colors duration-300"
                style={{ color: active === i ? C.inkDark : "rgba(26,18,24,0.35)" }}>{s.label}</p>
              {active === i && <div className="absolute bottom-0 left-5 right-5 h-[2px] rounded-full" style={{ backgroundColor: s.accent }} />}
            </button>
          ))}
        </div>

        {/* Content: illustration + copy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="order-2 lg:order-1 rounded-2xl overflow-hidden" style={{ backgroundColor: "rgba(26,18,24,0.02)", border: "1px solid rgba(26,18,24,0.04)" }}>
            <div className="p-4 lg:p-6"><Illus /></div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-[11px] font-medium tracking-[0.1em] uppercase mb-3" style={{ color: stage.accent }}>{stage.num} {stage.label}</p>
            <h3 className="text-[clamp(1.3rem,3vw,1.8rem)] font-normal leading-[1.15] tracking-[-0.01em] mb-5" style={{ fontFamily: "Georgia, serif", color: C.inkDark }}>{stage.title}</h3>
            <p className="text-[15px] leading-[1.75] mb-6" style={{ color: C.inkMutedLight }}>{stage.body}</p>
            <div className="flex flex-wrap gap-2">
              {stage.pills.map((pill) => (
                <span key={pill} className="px-4 py-2 rounded-full text-[12px] font-medium"
                  style={{
                    backgroundColor: stage.accent === C.copper ? "rgba(200,154,60,0.1)" : "rgba(45,106,79,0.08)",
                    color: stage.accent === C.copper ? C.copperDark : C.good,
                  }}>{pill}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatRow() {
  return (
    <section style={{ backgroundColor: C.dark }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 pt-14 lg:pt-20 pb-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0">
          {STATS.map((stat, i) => (
            <div key={stat.label} className={`flex flex-col items-center text-center lg:py-0 ${i < STATS.length - 1 ? "lg:border-r" : ""}`} style={{ borderColor: "rgba(245,237,227,0.1)" }}>
              <div className="text-[clamp(2.2rem,5vw,3.5rem)] font-bold leading-none mb-2" style={{ color: stat.color }}>{stat.number}</div>
              <div className="text-[11px] uppercase tracking-[0.06em] leading-snug max-w-[200px]" style={{ color: "rgba(245,237,227,0.4)" }}>{stat.label}</div>
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
    <section style={{ backgroundColor: C.cream }} id="jobs">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16 lg:py-24">
        <div className="text-[11px] font-medium tracking-[0.08em] uppercase mb-4" style={{ color: C.copperDark }}>Where we start</div>
        <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-normal leading-[1.1] tracking-[-0.01em] mb-3" style={{ fontFamily: "Georgia, serif", color: C.inkDark }}>
          We don&apos;t sell a platform. We fix a problem.<br />
          <em className="italic" style={{ color: C.copperDark }}>Then another. Then another.</em>
        </h2>
        <p className="text-[16px] leading-relaxed mb-3" style={{ color: C.inkMutedLight }}>
          Pick the one workflow that&apos;s costing you the most right now. Chris handles it end-to-end. You approve the outcome.
        </p>
        <p className="text-[15px] leading-relaxed mb-12" style={{ color: "rgba(26,18,24,0.5)" }}>
          These are the problems we see most often. Yours might be something else entirely. Either way, we&apos;ll find it in a single conversation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {JOBS.map((job, i) => (
            <button key={job.n} onClick={() => setSelected(i)}
              className="w-full text-left border rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
              style={{ backgroundColor: "#fff", borderColor: "rgba(26,18,24,0.08)", borderLeftWidth: 4, borderLeftColor: job.accent }}>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[12px] italic" style={{ fontFamily: "Georgia, serif", color: "rgba(26,18,24,0.3)" }}>{job.n}</span>
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
          <p className="text-[13px]" style={{ color: "rgba(26,18,24,0.45)" }}>30 minutes. No demo. Just your operation and ours.</p>
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
                    <span className="text-[12px] italic" style={{ fontFamily: "Georgia, serif", color: "rgba(245,237,227,0.35)" }}>{job.n}</span>
                    <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(245,237,227,0.1)", color: C.inkMuted }}>{job.role}</span>
                  </div>
                  <h3 className="text-[20px] font-normal" style={{ fontFamily: "Georgia, serif", color: C.ink }}>{job.title}</h3>
                </div>
                <button onClick={() => setSelected(null)} className="text-[20px] w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors" style={{ color: C.inkMuted }}>×</button>
              </div>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* The scenario */}
              <div className="rounded-lg px-4 py-3" style={{ backgroundColor: "rgba(26,18,24,0.02)", border: "1px solid rgba(26,18,24,0.06)" }}>
                <p className="text-[14px] italic leading-relaxed" style={{ fontFamily: "Georgia, serif", color: "rgba(26,18,24,0.55)" }}>{job.hook}</p>
              </div>

              {/* CHRIS does */}
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider mb-3" style={{ color: C.copperDark }}>CHRIS does</p>
                <ul className="space-y-2">
                  {job.chrisDoes.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13px] leading-relaxed" style={{ color: "rgba(26,18,24,0.65)" }}>
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
                    <li key={i} className="flex items-start gap-2.5 text-[13px] leading-relaxed" style={{ color: "rgba(26,18,24,0.65)" }}>
                      <span className="shrink-0 mt-1" style={{ color: C.good }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* What's at stake */}
              <div className="rounded-lg px-4 py-3" style={{ borderLeft: `3px solid ${job.accent}`, backgroundColor: "rgba(26,18,24,0.02)" }}>
                <p className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: "rgba(26,18,24,0.35)" }}>What&apos;s at stake</p>
                <p className="text-[13px] leading-relaxed" style={{ color: "rgba(26,18,24,0.6)" }}>{job.stakes}</p>
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
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: C.dark, padding: "clamp(80px, 10vh, 140px) clamp(24px, 5vw, 80px)" }}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "200px 200px" }} />
      <div className="relative z-10 max-w-[720px] mx-auto">
        <div className="text-[11px] font-medium tracking-[0.18em] uppercase mb-10" style={{ color: C.copper }}>A real scenario. Every facility. Every week.</div>
        <div className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.1] mb-6" style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: "#ffffff" }}>11:04pm Friday.</div>
        <div className="space-y-1 mb-8">
          <p className="text-[clamp(1.05rem,1.8vw,1.3rem)]" style={{ color: "rgba(245,237,227,0.55)" }}>A Priority 1 incident. 24 hours to notify ACQSC.</p>
        </div>
        <p className="text-[clamp(1.3rem,2.2vw,1.8rem)] font-medium mb-2" style={{ color: "#ffffff" }}>Chris classified it in 4 minutes.</p>
        <div className="space-y-1 mb-8">
          <p className="text-[clamp(1.1rem,2vw,1.5rem)] italic" style={{ fontFamily: "Georgia, serif", color: "rgba(255,255,255,0.9)" }}>The draft was waiting in the DON&apos;s inbox by 11:09.</p>
          <p className="text-[clamp(1.1rem,2vw,1.5rem)] italic" style={{ fontFamily: "Georgia, serif", color: "rgba(255,255,255,0.9)" }}>She approved it before midnight.</p>
        </div>
        <p className="text-[clamp(1rem,1.6vw,1.2rem)] mb-1" style={{ color: "rgba(245,237,227,0.6)" }}>That&apos;s not a feature.</p>
        <p className="text-[clamp(1.3rem,2.2vw,1.8rem)] font-medium" style={{ color: C.copper }}>That&apos;s the difference between a penalty and a clean record.</p>

        <div className="mt-10 mb-6" style={{ width: 60, height: 2, backgroundColor: C.copper }} />
        <p className="text-[13px]" style={{ color: "rgba(245,237,227,0.55)" }}>The Chronicler agent · event-driven · always watching</p>
      </div>
    </section>
  );
}

function AgentsSection() {
  const [selected, setSelected] = useState<number | null>(null);
  const agent = selected !== null ? AGENTS[selected] : null;

  return (
    <section style={{ backgroundColor: C.cream }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16 lg:py-24">
        <div className="text-[11px] font-medium tracking-[0.08em] uppercase mb-4" style={{ color: C.copperDark }}>The intelligence layer</div>
        <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-normal leading-[1.1] mb-3" style={{ fontFamily: "Georgia, serif", color: C.inkDark }}>
          Seven agents. Every domain. <em className="italic" style={{ color: C.copperDark }}>Always on.</em>
        </h2>
        <p className="text-[15px] leading-relaxed max-w-xl mb-12" style={{ color: C.inkMutedLight }}>
          Each agent has a domain, a cadence, and a job. Together they give every leader in your organisation a dedicated intelligence layer, working underneath them, 24 hours a day.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {AGENTS.map((agent, i) => (
            <button key={agent.name} onClick={() => setSelected(i)}
              className="border rounded-lg p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
              style={{ backgroundColor: "#fff", borderColor: "rgba(26,18,24,0.08)" }}>
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
                  <h3 className="text-[22px] font-normal" style={{ fontFamily: "Georgia, serif", color: C.ink }}>{agent.name}</h3>
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
                <p className="text-[10px] font-medium uppercase tracking-wider mb-2" style={{ color: "rgba(26,18,24,0.35)" }}>What it watches</p>
                <ul className="space-y-1.5">
                  {agent.watches.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px]" style={{ color: "rgba(26,18,24,0.65)" }}>
                      <span className="w-1 h-1 rounded-full shrink-0 mt-2" style={{ backgroundColor: agent.color }} />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>

              {/* What it delivers */}
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider mb-2" style={{ color: "rgba(26,18,24,0.35)" }}>What it delivers</p>
                <ul className="space-y-1.5">
                  {agent.delivers.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px]" style={{ color: "rgba(26,18,24,0.65)" }}>
                      <span className="shrink-0 mt-0.5" style={{ color: C.copper }}>→</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Example scenario */}
              <div className="rounded-lg p-4" style={{ backgroundColor: "rgba(26,18,24,0.02)", border: "1px solid rgba(26,18,24,0.06)" }}>
                <p className="text-[10px] font-medium uppercase tracking-wider mb-2" style={{ color: C.copperDark }}>Example</p>
                <p className="text-[13px] leading-relaxed italic" style={{ fontFamily: "Georgia, serif", color: "rgba(26,18,24,0.6)" }}>{agent.example}</p>
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
    <section style={{ backgroundColor: C.dark }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <div className="text-[11px] font-medium tracking-[0.08em] uppercase mb-4" style={{ color: C.copper }}>Operational intelligence + AI support</div>
            <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-normal leading-[1.1] mb-5" style={{ fontFamily: "Georgia, serif", color: "#ffffff" }}>
              Ask the question <em className="italic" style={{ color: C.copper }}>you&apos;ve been sitting on.</em>
            </h2>
            <p className="text-[15px] leading-relaxed mb-6" style={{ color: "rgba(245,237,227,0.7)" }}>
              Chris is an operational intelligence layer and AI support built specifically for aged care. Ask about compliance, workforce, funding, or bring a leadership challenge. Preparing for a difficult conversation, navigating team conflict, managing the pressure of the role. Chris supports the way a trusted colleague would: direct, warm, and grounded in what actually works in this sector. No login. No signup.
            </p>
            <p className="text-[12px]" style={{ color: "rgba(245,237,227,0.5)" }}>
              You&apos;re talking to a public preview of Chris. The full platform connects to your systems and knows your team.
            </p>
          </div>
          <div><ChrisPublicChat /></div>
        </div>
      </div>
    </section>
  );
}

function ExecutionSection() {
  return (
    <section style={{ backgroundColor: C.cream }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16 lg:py-24">
        <div className="text-[11px] font-medium tracking-[0.08em] uppercase mb-4" style={{ color: C.copperDark }}>The execution layer</div>
        <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-normal leading-[1.1] mb-3" style={{ fontFamily: "Georgia, serif", color: C.inkDark }}>
          Chris doesn&apos;t just tell you. <em className="italic" style={{ color: C.copperDark }}>It acts.</em>
        </h2>
        <p className="text-[15px] leading-relaxed max-w-xl mb-12" style={{ color: C.inkMutedLight }}>
          Most analytics tools give you data to interpret. Chris delivers a drafted document, a specific action, or a coordinated recommendation, ready for your review and approval.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {EXECUTION.map((item) => (
            <div key={item.title} className="border rounded-lg p-6" style={{ backgroundColor: C.white, borderColor: "rgba(26,18,24,0.08)" }}>
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

function RolesSection() {
  return (
    <section style={{ backgroundColor: C.cream }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16 lg:py-24">
        <div className="text-[11px] font-medium tracking-[0.08em] uppercase mb-4" style={{ color: C.copperDark }}>Built for every leader</div>
        <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-normal leading-[1.1] mb-3" style={{ fontFamily: "Georgia, serif", color: C.inkDark }}>
          One platform. <em className="italic" style={{ color: C.copperDark }}>Every leader in your organisation.</em>
        </h2>
        <p className="text-[15px] leading-relaxed max-w-xl mb-12" style={{ color: C.inkMutedLight }}>
          Chris adapts to the role looking at it. The CEO sees the portfolio view. The DON sees clinical and operational signals. The CFO sees the financial intelligence. The WHS Lead sees the psychosocial picture.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {ROLES.map((r) => (
            <div key={r.title} className="border rounded-lg p-5" style={{ backgroundColor: C.white, borderColor: "rgba(26,18,24,0.08)" }}>
              <p className="text-[14px] font-medium mb-1" style={{ color: C.inkDark }}>{r.title}</p>
              <p className="text-[13px]" style={{ color: C.inkMutedLight }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [org, setOrg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    try { await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, name, role, organisation: org }) }); } catch {}
    setSubmitted(true);
  }

  return (
    <section style={{ backgroundColor: C.dark }} id="book">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16 lg:py-24">
        <div className="text-[11px] font-medium tracking-[0.08em] uppercase mb-6" style={{ color: "rgba(245,237,227,0.4)" }}>Two ways in</div>
        <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-normal leading-[1.1] mb-10" style={{ fontFamily: "Georgia, serif", color: "#ffffff" }}>
          Pick the one that fits where you are.
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Book */}
          <div className="rounded-lg p-6 lg:p-8" style={{ backgroundColor: C.dark2, border: `1px solid ${C.copper}40` }}>
            <h3 className="text-[18px] font-semibold mb-3" style={{ color: "#ffffff" }}>Book a 30-min conversation</h3>
            <p className="text-[14px] leading-relaxed mb-6" style={{ color: "rgba(245,237,227,0.65)" }}>
              For CEOs, CFOs, DONs ready to see Chris modelled against their actual facility data. No demo. Just your operation and ours.
            </p>
            <a href="mailto:hello@culturecrunch.io?subject=Chris-OS%20Diagnostic" className="inline-block px-6 py-3 rounded text-[14px] font-medium transition-colors hover:opacity-90" style={{ backgroundColor: C.copper, color: C.dark }}>
              Book now →
            </a>
          </div>

          {/* Waitlist */}
          <div className="rounded-lg p-6 lg:p-8" style={{ backgroundColor: C.dark2, border: "1px solid rgba(245,237,227,0.12)" }}>
            <h3 className="text-[18px] font-semibold mb-3" style={{ color: "#ffffff" }}>Join the waitlist</h3>
            <p className="text-[14px] leading-relaxed mb-6" style={{ color: "rgba(245,237,227,0.65)" }}>
              For organisations that want to be in the next cohort. We onboard in order. We&apos;ll be in touch when there&apos;s room.
            </p>
            {submitted ? (
              <p className="text-[14px]" style={{ color: C.copper }}>You&apos;re on the list. We&apos;ll be in touch.</p>
            ) : (
              <form onSubmit={handleWaitlist} className="space-y-3">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Work email" className="w-full px-4 py-2.5 rounded text-[13px] bg-transparent focus:outline-none" style={{ border: "1px solid rgba(245,237,227,0.15)", color: C.ink }} />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="px-4 py-2.5 rounded text-[13px] bg-transparent focus:outline-none" style={{ border: "1px solid rgba(245,237,227,0.15)", color: C.ink }} />
                  <input type="text" value={org} onChange={(e) => setOrg(e.target.value)} placeholder="Organisation" className="px-4 py-2.5 rounded text-[13px] bg-transparent focus:outline-none" style={{ border: "1px solid rgba(245,237,227,0.15)", color: C.ink }} />
                </div>
                <button type="submit" className="w-full py-2.5 rounded text-[13px] font-medium transition-colors" style={{ border: `1px solid ${C.copper}`, color: C.copper }}>
                  Join the waitlist
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="text-[12px] text-center mt-6" style={{ color: "rgba(245,237,227,0.3)" }}>No spam. No sales calls. Just a conversation about your facility.</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ backgroundColor: C.dark, borderTop: "1px solid rgba(245,237,227,0.06)" }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider mb-3" style={{ color: "rgba(245,237,227,0.35)" }}>Product</p>
            <div className="space-y-2">
              {[["Tools", "/tools/care-minutes"], ["Technology", "/technology"], ["Newsroom", "/newsroom"], ["Book a conversation", "#book"]].map(([label, href]) => (
                <Link key={label} href={href} className="block text-[13px] transition-colors hover:opacity-80" style={{ color: "rgba(245,237,227,0.55)" }}>{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider mb-3" style={{ color: "rgba(245,237,227,0.35)" }}>Company</p>
            <div className="space-y-2">
              <a href="mailto:hello@culturecrunch.io" className="block text-[13px]" style={{ color: "rgba(245,237,227,0.55)" }}>Contact</a>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider mb-3" style={{ color: "rgba(245,237,227,0.35)" }}>Legal</p>
            <div className="space-y-2">
              {[["Privacy", "/legal"], ["Sources & references", "/dashboard/references"]].map(([label, href]) => (
                <Link key={label} href={href} className="block text-[13px] transition-colors hover:opacity-80" style={{ color: "rgba(245,237,227,0.55)" }}>{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider mb-3" style={{ color: "rgba(245,237,227,0.35)" }}>Status</p>
            <p className="text-[13px]" style={{ color: "rgba(245,237,227,0.55)" }}>Live in NSW & VIC</p>
            <p className="text-[12px] mt-1" style={{ color: "rgba(245,237,227,0.3)" }}>australia-southeast1</p>
          </div>
        </div>
        <div className="pt-6 flex items-center justify-between flex-wrap gap-3" style={{ borderTop: "1px solid rgba(245,237,227,0.06)" }}>
          <div>
            <span className="text-[14px] font-medium" style={{ color: C.ink }}>Chris<span style={{ color: C.copper }}>·</span>OS</span>
            <p className="text-[12px] mt-1" style={{ color: "rgba(245,237,227,0.35)" }}>Operational intelligence and execution for Australian aged care. Built by Culture Crunch.</p>
          </div>
          <span className="text-[11px]" style={{ color: "rgba(245,237,227,0.25)" }}>© 2026 Culture Crunch Pty Ltd</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function V2Page() {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <Nav />
      <Hero />
      <AgentRibbon />
      <WhatChrisIsSection />
      <StatRow />
      <ToolsStrip />
      <HowItWorksSection />
      <JobsSection />
      <ScenarioSection />
      <AgentsSection />
      <AISupportSection />
      <ExecutionSection />
      <RolesSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}
