"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import ChrisPublicChat from "@/components/ChrisPublicChat";
import { CareMinutesCard } from "@/components/marketing/cards/CareMinutesCard";
import { ReviewQueueCard } from "@/components/marketing/cards/ReviewQueueCard";
import { AgentActivityCard } from "@/components/marketing/cards/AgentActivityCard";

// ─── Marketing visual identity v5 (operator-grade hybrid) ───────────────────
// Mercury/Ramp density + Anthropic/Stripe accent discipline.
// Warm Culture Crunch palette (forest/amber) ONLY inside the briefing artefact.
const C = {
  // Canvas
  canvas: "#FAFAF6",
  card: "#FFFFFF",
  // Text
  text: "#0E0E0E",
  textMuted: "#5A5A57",
  textFaint: "#8A8A85",
  // Accents
  teal: "#1F6F66",
  amber: "#BA7517",
  red: "#A32D2D",
  // Surfaces
  successBg: "#E1F5EE",
  warningBg: "#FAEEDA",
  alertBg: "#FCEBEB",
  // Borders
  border: "rgba(15,23,42,0.10)",
  borderSubtle: "rgba(15,23,42,0.07)",
  // CTA
  ctaBg: "#0E0E0E",
  ctaText: "#FAFAF6",
  // Inside-product tokens (briefing artefact ONLY)
  forest: "#1B4332",
  gold: "#D4A853",
  // Legacy aliases for components not yet migrated
  dark: "#0E0E0E", dark2: "#1a1a1a", cream: "#FAFAF6", white: "#FFFFFF",
  ink: "#FAFAF6", inkDark: "#0E0E0E", inkMuted: "#5A5A57", inkMutedLight: "#5A5A57",
  copper: "#1F6F66", copperDark: "#1F6F66", warm: "#A32D2D", good: "#1F6F66", warn: "#BA7517",
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

// ─── Typography ─────────────────────────────────────────────────────────────
// Fraunces Italic for display emphasis. Inter for everything else.
// Load via @fontsource CDN: Fraunces 400i, Inter 400/500.
const fraunces = "'Fraunces', Georgia, serif";
const inter = "'Inter', system-ui, -apple-system, sans-serif";

// Italic eyebrow for section openers (replaces all-caps .chris-label on section openers)
function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[17px] mb-3" style={{ fontFamily: fraunces, fontStyle: "italic", letterSpacing: "-0.01em", color: C.teal }}>{children}</p>;
}

// ─── Components ─────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav className="sticky top-0 z-50" style={{ backgroundColor: C.canvas, borderBottom: `0.5px solid ${C.borderSubtle}` }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 lg:px-16 py-3">
        <Link href="/v2" className="text-[15px] font-medium tracking-tight" style={{ color: C.text }}>
          Chris<span style={{ color: C.teal }}>·</span>OS
        </Link>
        <div className="flex items-center gap-5">
          <a href="#what-chris-is" className="text-[13px] hidden lg:block hover:opacity-70" style={{ color: C.textMuted }}>What Chris is</a>
          <a href="#tools" className="text-[13px] hidden lg:block hover:opacity-70" style={{ color: C.textMuted }}>Your numbers</a>
          <a href="#how-it-works" className="text-[13px] hidden lg:block hover:opacity-70" style={{ color: C.textMuted }}>How it works</a>
          <a href="#jobs" className="text-[13px] hidden lg:block hover:opacity-70" style={{ color: C.textMuted }}>Where we start</a>
          <a href="#book" className="text-[14px] font-medium px-[20px] py-[12px] rounded-[4px]" style={{ backgroundColor: C.ctaBg, color: C.ctaText }}>
            Book a conversation
          </a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section style={{ backgroundColor: C.canvas }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 pt-14 lg:pt-20 pb-16 lg:pb-24">
        <div className="max-w-[580px]">
          <p className="text-[11px] font-medium tracking-[0.08em] uppercase mb-6" style={{ color: C.teal }}>
            Live with Harbison Care, Kinyara Health, Homewell, 365 Care.
          </p>

          <h1 className="text-[clamp(2.5rem,6vw,52px)] font-medium leading-[1.02] tracking-[-0.030em] mb-6" style={{ color: C.text }}>
            Hold quality. Protect margin. Lead with{" "}
            <span style={{ fontFamily: fraunces, fontStyle: "italic", letterSpacing: "-0.012em" }}>confidence.</span>
          </h1>

          <p className="text-[16px] leading-[1.6] max-w-[520px] mb-8" style={{ color: C.textMuted }}>
            In aged care, problems chain across domains. Rosters into clinical into compliance into cost. Chris makes the chain legible, supports your leaders today, and extends across clinical, workforce, finance, compliance and governance.
          </p>

          <div className="flex items-center gap-5">
            <a href="#book" className="text-[14px] font-medium px-[20px] py-[12px] rounded-[4px]" style={{ backgroundColor: C.ctaBg, color: C.ctaText }}>
              Book a 30-min conversation
            </a>
            <a href="#how-it-works" className="text-[14px] font-medium" style={{ color: C.text }}>
              How Chris works, layer by layer →
            </a>
          </div>
        </div>
      </div>

      {/* Setup line above mockups */}
      <div className="max-w-6xl mx-auto px-6 lg:px-16 mt-8">
        <div className="max-w-[560px]">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] mb-1.5" style={{ color: C.teal }}>A facility using Chris, right now</p>
          <p className="text-[14px] leading-[1.5] mb-3" style={{ color: C.textMuted }}>Three live views from Mt Gibraltar Gardens, Monday morning. The DON&apos;s review queue, today&apos;s care minutes, and Chris&apos;s agents working in the background.</p>
          {/* NOTE: The three product mockup cards below show operational dashboards (review queue, care minutes, agent activity). These need reworking to people-layer surfaces in a follow-up pass to fully resolve live-vs-in-build consistency. The architecture section below is already aligned to people-layer work. */}
          <p className="text-[13px] leading-[1.55]" style={{ color: C.textFaint }}>Agentic AI means software that does the productivity work without being asked. Each agent has one job. Sentinel monitors. Chronicler drafts. Oracle recommends. Keeper protects. Steward optimises. They read your systems and act in the flow of work, while your leaders run care.</p>
        </div>
      </div>

      {/* Product cards — 3-up operator-grade layout */}
      <div className="max-w-6xl mx-auto px-6 lg:px-16 mt-4 lg:mt-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ReviewQueueCard />
          <CareMinutesCard />
          <AgentActivityCard />
        </div>
      </div>

      {/* Bridge link to architecture section */}
      <div className="max-w-6xl mx-auto px-6 lg:px-16 mt-5 pb-14 lg:pb-18">
        <a href="#what-chris-is" className="text-[13px] font-medium hover:underline" style={{ color: C.text }}>
          See how this morning was built →
        </a>
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
  const canvas = "#FAFAF6";
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
          <h2 className="text-[clamp(1.75rem,4vw,34px)] font-medium leading-[1.08] tracking-[-0.025em] mb-3 max-w-[540px]" style={{ color: textPrimary }}>
            A <span style={{ fontFamily: fraunces, fontStyle: "italic", letterSpacing: "-0.012em" }}>morning</span> at Mt Gibraltar Gardens.
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
    <section id="tools" style={{ backgroundColor: C.canvas, borderTop: `0.5px solid ${C.border}` }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-14 lg:py-18">
        {/* Header */}
        <div className="max-w-[560px] mb-10">
          <p className="text-[17px] mb-3" style={{ fontFamily: fraunces, fontStyle: "italic", letterSpacing: "-0.01em", color: C.teal }}>
            See your own numbers
          </p>
          <h2 className="text-[clamp(1.75rem,4vw,34px)] font-medium leading-[1.08] tracking-[-0.025em] mb-3" style={{ color: C.text }}>
            Four tools. Run them on your facility before we ever talk.
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
          <h2 className="text-[clamp(1.3rem,3vw,2rem)] font-normal leading-[1.15] tracking-[-0.01em] mb-3" style={{ color: C.inkDark }}>
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
    <section id="how-it-works" style={{ backgroundColor: C.canvas }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16 lg:py-24">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 mb-14 lg:mb-18">
          <div>
            <p className="text-[17px] mb-3" style={{ fontFamily: fraunces, fontStyle: "italic", letterSpacing: "-0.01em", color: C.teal }}>How it works</p>
            <h2 className="text-[clamp(1.75rem,4vw,34px)] font-medium leading-[1.08] tracking-[-0.025em]" style={{ color: C.text }}>
              Aged care, with <span style={{ fontFamily: fraunces, fontStyle: "italic", letterSpacing: "-0.012em" }}>intelligence</span> in every layer
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
            <h3 className="text-[clamp(1.3rem,3vw,1.8rem)] font-normal leading-[1.15] tracking-[-0.01em] mb-5" style={{ color: C.inkDark }}>{stage.title}</h3>
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
        <h2 className="text-[clamp(1.75rem,4vw,34px)] font-medium leading-[1.08] tracking-[-0.025em] mb-3" style={{ color: C.text }}>
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

  const lines: { text: string; style: string; delay: number }[] = [
    { text: "11:04pm Friday.", style: "timestamp", delay: 0 },
    { text: "A Priority 1 incident.", style: "setup", delay: 200 },
    { text: "24 hours to notify ACQSC.", style: "setup", delay: 400 },
    { text: "Chris classified it in 4 minutes.", style: "action", delay: 800 },
    { text: "The draft was waiting in the DON\u2019s inbox by 11:09.", style: "resolution", delay: 1200 },
    { text: "She approved it before midnight.", style: "resolution", delay: 1600 },
    { text: "That\u2019s not a feature.", style: "pause", delay: 2200 },
    { text: "That\u2019s the difference between a penalty", style: "punchline", delay: 2800 },
    { text: "and a clean record.", style: "punchline", delay: 3200 },
  ];

  const styles: Record<string, React.CSSProperties> = {
    timestamp: { fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontFamily: fraunces, fontStyle: "italic", fontWeight: 400, color: C.canvas, marginBottom: "0.8em", letterSpacing: "-0.02em" },
    setup: { fontSize: "clamp(1.05rem, 1.8vw, 1.3rem)", fontWeight: 400, color: "rgba(250,250,246,0.5)", marginBottom: "0.3em" },
    action: { fontSize: "clamp(1.3rem, 2.2vw, 1.9rem)", fontWeight: 500, color: C.canvas, marginBottom: "0.3em" },
    resolution: { fontSize: "clamp(1.15rem, 2vw, 1.6rem)", fontFamily: fraunces, fontStyle: "italic", fontWeight: 400, color: "rgba(250,250,246,0.9)", marginBottom: "0.3em" },
    pause: { fontSize: "clamp(1rem, 1.6vw, 1.2rem)", fontWeight: 400, color: "rgba(250,250,246,0.45)", marginBottom: "0.8em" },
    punchline: { fontSize: "clamp(1.3rem, 2.2vw, 1.9rem)", fontWeight: 500, color: C.teal, marginBottom: "0.15em" },
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden"
      style={{ background: C.text, backgroundImage: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(31,111,102,0.1) 0%, transparent 70%)", padding: "clamp(80px, 10vh, 140px) clamp(24px, 5vw, 80px)" }}>
      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "200px 200px" }} />

      <div className="relative z-[2] max-w-[720px] mx-auto">
        {/* Clock */}
        <div className="flex items-center gap-3 mb-10">
          <div className="text-[13px] font-medium tracking-[0.15em] tabular-nums" style={{ fontFamily: "'Courier New', Consolas, monospace", color: C.teal }}>23:04</div>
          <div className="text-[9px] font-medium tracking-[0.2em] uppercase" style={{ color: "rgba(31,111,102,0.5)" }}>Incident detected</div>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: C.warn }} />
        </div>

        {/* Label */}
        <p className="text-[11px] font-medium tracking-[0.15em] uppercase mb-10 transition-all duration-700"
          style={{ color: C.teal, opacity: visible ? 0.8 : 0, transform: visible ? "translateY(0)" : "translateY(12px)" }}>
          Every facility. Every week.
        </p>

        {/* Lines with staggered fade-in */}
        {lines.map((line, i) => {
          const s = styles[line.style];
          const lastSetup = line.style === "setup" && lines[i + 1]?.style !== "setup";
          return (
            <div key={i} className="transition-all duration-700 ease-out"
              style={{ ...s, marginBottom: lastSetup ? "1.2em" : s.marginBottom, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transitionDelay: `${line.delay}ms` }}>
              {line.text}
            </div>
          );
        })}

        {/* Separator */}
        <div className="transition-all duration-700" style={{ width: 60, height: 2, backgroundColor: C.teal, margin: "2.5rem 0 2rem 0", opacity: visible ? 1 : 0, transitionDelay: "3600ms" }} />

        {/* Footnote */}
        <div className="transition-all duration-700 space-y-1" style={{ opacity: visible ? 1 : 0, transitionDelay: "3800ms" }}>
          <p className="text-[14px]" style={{ color: "rgba(250,250,246,0.7)" }}>The Chronicler agent. Event-driven. Always watching.</p>
          <p className="text-[13px]" style={{ color: "rgba(250,250,246,0.45)" }}>Civil penalties for late SIRS notifications. Zero missed deadlines at current pilots.</p>
        </div>
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
        <h2 className="text-[clamp(1.75rem,4vw,34px)] font-medium leading-[1.08] tracking-[-0.025em] mb-3" style={{ color: C.text }}>
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
            <h2 className="text-[clamp(1.75rem,4vw,34px)] font-medium leading-[1.08] tracking-[-0.025em] mb-4" style={{ color: C.text }}>
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

function ExecutionSection() {
  return (
    <section style={{ backgroundColor: C.canvas }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16 lg:py-24">
        <p className="text-[17px] mb-3" style={{ fontFamily: fraunces, fontStyle: "italic", letterSpacing: "-0.01em", color: C.teal }}>The execution layer</p>
        <h2 className="text-[clamp(1.75rem,4vw,34px)] font-medium leading-[1.08] tracking-[-0.025em] mb-3" style={{ color: C.text }}>
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

function RolesSection() {
  return (
    <section style={{ backgroundColor: C.canvas }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16 lg:py-24">
        <p className="text-[17px] mb-3" style={{ fontFamily: fraunces, fontStyle: "italic", letterSpacing: "-0.01em", color: C.teal }}>Built for every leader</p>
        <h2 className="text-[clamp(1.75rem,4vw,34px)] font-medium leading-[1.08] tracking-[-0.025em] mb-3" style={{ color: C.text }}>
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

function FinalCTA() {
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

  return (
    <section style={{ backgroundColor: C.canvas, borderTop: `0.5px solid ${C.border}` }} id="book">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-14 lg:py-18">
        <div className="max-w-lg">
          <p className="text-[17px] mb-3" style={{ fontFamily: fraunces, fontStyle: "italic", letterSpacing: "-0.01em", color: C.teal }}>Start a conversation</p>
          <h2 className="text-[clamp(1.75rem,4vw,34px)] font-medium leading-[1.08] tracking-[-0.025em] mb-3" style={{ color: C.text }}>
            See Chris modelled against your facility.
          </h2>
          <p className="text-[14px] leading-[1.6] mb-2" style={{ color: C.textMuted }}>
            No demo deck. No sales pitch. We walk through your data, your pain points, and what Chris would surface in week one.
          </p>
          <p className="text-[14px] font-medium mb-6" style={{ color: C.text }}>
            Pilot pricing from $15,000. Scaled rollouts on application.
          </p>
        </div>

        {submitted ? (
          <div className="max-w-lg rounded-[5px] p-6" style={{ backgroundColor: C.card, border: `0.5px solid ${C.border}` }}>
            <p className="text-[15px] font-medium mb-1" style={{ color: C.teal }}>Received.</p>
            <p className="text-[13px]" style={{ color: C.textMuted }}>
              {isLeaderRole ? "We will be in touch within 48 hours to schedule a diagnostic conversation." : "You are on the list. We onboard in order and will be in touch when there is room."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-lg space-y-3">
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
    </section>
  );
}

// ── Client proof section ────────────────────────────────────────────────────
const CLIENTS = [
  { name: "Harbison Care", logo: "/logos/harbison.png", fact: "Leading residential aged care innovator. 2 large sites, 350 staff." },
  { name: "Kinyara Health", logo: "/logos/kinyara.png", fact: "PE-backed home care and NDIS operator. Five brands along the East Coast." },
  { name: "365 Care", logo: "/logos/365care.png", fact: "Home care and NDIS provider. Western Sydney." },
  { name: "Homewell", logo: "/logos/homewell.png", fact: "Home care and NDIS provider. Melbourne." },
];

function ClientProof() {
  return (
    <section style={{ backgroundColor: C.canvas, borderTop: `0.5px solid ${C.border}` }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-12 lg:py-16">
        <p className="text-[17px] mb-6" style={{ fontFamily: fraunces, fontStyle: "italic", letterSpacing: "-0.01em", color: C.teal }}>We started in October 2025. We&apos;re now live with the following.</p>
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
              {[["Privacy", "/legal"], ["Sources & references", "/dashboard/references"]].map(([label, href]) => (
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
  return (
    <div style={{ fontFamily: inter }}>
      {/* Font loading: Inter 400/500 + Fraunces 400 italic */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/inter@5/400.css" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/inter@5/500.css" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/fraunces@5/400-italic.css" />
      <Nav />
      <Hero />
      <AgentRibbon />
      <WhatChrisIsSection />
      <StatRow />
      <ToolsStrip />
      <ClientProof />
      <VictorianHook />
      <JobsSection />
      <ScenarioSection />
      <FinalCTA />
      <HowItWorksSection />
      <AgentsSection />
      <ExecutionSection />
      <RolesSection />
      <Footer />
    </div>
  );
}
