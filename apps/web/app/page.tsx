"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Agent data ──────────────────────────────────────────────────────────────

const AGENTS = [
  {
    id: "sentinel",
    name: "The Sentinel",
    role: "Clinical & compliance vigilance",
    cadence: "2-hr cycle",
    cadenceColor: "bg-emerald-50 text-[#1B4332]",
    position: { top: "10%", left: "50%" },
    detail: {
      title: "The Sentinel — Clinical & Compliance",
      body: "Always on, running every 2 hours. Monitors care minutes, SIRS thresholds, clinical compliance, and roster gaps. The first agent to know when something requires attention — and the first to act.",
      example:
        '"Care minutes at 197 tonight — 3 short of target. The gap is in Grevillea Wing afternoon. One AIN shift unfilled. Want me to generate the agency brief?"',
    },
  },
  {
    id: "oracle",
    name: "The Oracle",
    role: "Revenue & funding intelligence",
    cadence: "Weekly",
    cadenceColor: "bg-amber-50 text-amber-800",
    position: { top: "28%", left: "85%" },
    detail: {
      title: "The Oracle — Revenue & Funding",
      body: "Runs every Sunday night. Scans AN-ACC classifications, accommodation pricing, and HELF opportunities. Benchmarks financial performance against StewartBrown sector data and surfaces what revenue is being left on the table.",
      example:
        '"3 AN-ACC reclassification opportunities identified — $11,400/month in additional funding. Optimal scheduling window is Tuesday morning. CFO has been notified."',
    },
  },
  {
    id: "steward",
    name: "The Steward",
    role: "Capacity & operational structure",
    cadence: "Daily",
    cadenceColor: "bg-emerald-50 text-[#1B4332]",
    position: { top: "72%", left: "85%" },
    detail: {
      title: "The Steward — Operational Architecture",
      body: "Daily. Watches staffing composition, roster patterns, and structural gaps. Turns a repeating Sunday PM agency cost into a corrective recommendation before it becomes a budget problem.",
      example:
        '"Sunday PM agency cost has repeated 6 consecutive weeks — $1,440 cumulative. Root cause: 1 permanent AIN recurring rostered leave. Recommendation: targeted recruitment for this shift window."',
    },
  },
  {
    id: "chronicler",
    name: "The Chronicler",
    role: "Auto-documentation & evidence",
    cadence: "Event-driven",
    cadenceColor: "bg-amber-50 text-amber-800",
    position: { top: "90%", left: "50%" },
    detail: {
      title: "The Chronicler — Auto-Documentation",
      body: "Event-driven. When something happens — a fall, a complaint, a SIRS event — the Chronicler drafts the documentation within minutes. SIRS notifications, corrective action plans, board pack entries. Ready for your review, not your authorship.",
      example:
        '"SIRS Cat 1 — Wattle Wing. Unexpected fall, Wing B bathroom. Draft notification ready for your review. 18 hours remaining to submit to ACQSC. Penalty exposure: $783K if missed."',
    },
  },
  {
    id: "keeper",
    name: "The Keeper",
    role: "Workforce intelligence & people health",
    cadence: "Fortnightly",
    cadenceColor: "bg-orange-50 text-orange-800",
    position: { top: "72%", left: "15%" },
    detail: {
      title: "The Keeper — Workforce Intelligence",
      body: "Fortnightly. Reads psychosocial health signals, turnover precursors, leave patterns, and credential expiries. Tells you what's coming 4–6 cycles before it arrives — so you can act before you're replacing someone.",
      example:
        '"Turnover precursor detected — Wattle Wing. PSH_13 (role clarity) declining for 4 cycles. Pattern historically precedes voluntary turnover in 71% of comparable teams. Recommended: leadership conversation this cycle."',
    },
  },
  {
    id: "towncrier",
    name: "The Town Crier",
    role: "Signal coordination & clarity",
    cadence: "Continuous",
    cadenceColor: "bg-gray-100 text-gray-600",
    position: { top: "28%", left: "15%" },
    detail: {
      title: "The Town Crier — Signal Coordination",
      body: "Continuous. Coordinates all five agents. When the Sentinel and Steward both flag the same issue, the Town Crier decides what reaches the leader and when — one clear signal, not five alerts. The system that makes the other five useful.",
      example:
        '"Oracle spotted 3 AN-ACC opportunities. The Steward confirmed Tuesday morning shift has capacity. You received one coordinated recommendation instead of two separate alerts."',
    },
  },
];

const TICKER_ITEMS = [
  { agent: "SENTINEL", color: "#22c55e", text: "Care minutes compliant · RN confirmed tonight · 0 immediate findings" },
  { agent: "ORACLE", color: "#D4A017", text: "3 AN-ACC reclassification opportunities · $11.4K/month identified · CFO notified" },
  { agent: "STEWARD", color: "#22c55e", text: "2 structural findings · 1 episodic · Sunday PM RN gap confirmed" },
  { agent: "CHRONICLER", color: "#E07B39", text: "SIRS Cat 2 draft ready · awaiting DON review" },
  { agent: "KEEPER", color: "#E07B39", text: "Turnover precursor detected · Wattle Wing · PSH_13 declining 4 cycles" },
  { agent: "TOWN CRIER", color: "#22c55e", text: "Oracle + Steward merged · 1 coordinated recommendation delivered" },
];

const SYSTEMS = [
  "Clinical systems", "Rostering & HR", "Finance & payroll", "WHS registers",
  "ACQSC portal", "AN-ACC data", "GPMS", "StewartBrown benchmarks", "Pulse surveys",
];

const EXECUTION_PILLARS = [
  { icon: "✦", title: "Documents drafted", body: "SIRS notifications, QI submissions, corrective action plans, board packs — written by CHRIS within minutes of the triggering event, reviewed and approved by you." },
  { icon: "⬡", title: "Actions queued", body: "CHRIS prioritises what needs your attention today. Not a list of 40 alerts — a ranked queue of 3 actions with context, evidence, and a single button to act." },
  { icon: "→", title: "Leaders briefed", body: "Every leader in your organisation receives a briefing tailored to their role — DON, CFO, Facility Manager, WHS Lead — before they walk in the door." },
  { icon: "↗", title: "Delivered via iMessage", body: "CHRIS reaches leaders where they already are. Not another portal to log into — a message on your phone with a link to act, approve, or respond." },
];

const ROLES = [
  { title: "CEO & Executive", desc: "Portfolio health, strategic risk, board reporting, sector benchmarking" },
  { title: "Director of Nursing", desc: "Care minutes, SIRS, clinical compliance, roster position, incident status" },
  { title: "Facility Manager", desc: "Operational architecture, staffing gaps, corrective actions, financial position" },
  { title: "CFO & Finance", desc: "AN-ACC revenue, care ratio, agency cost, benchmark comparison, financial risk" },
  { title: "WHS & Quality Lead", desc: "Psychosocial hazard status, convergence signals, ISO 45003 evidence trail" },
  { title: "Team Leaders", desc: "Team briefings, micro-practice recommendations, workforce health signals" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-[#1B4332]/10">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-[#1B4332] rounded-lg flex items-center justify-center text-white text-sm font-medium tracking-tight">
          C
        </div>
        <span className="text-[#1B4332] text-[15px] font-medium tracking-tight">CHRIS-OS</span>
      </div>
      <span className="text-[13px] text-stone-400 hidden md:block">chris-os.io</span>
    </nav>
  );
}

function Hero() {
  return (
    <section className="px-6 md:px-10 pt-12 md:pt-20 pb-12 md:pb-16 max-w-3xl">
      <div className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-[#1B4332] mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Live with providers in NSW and VIC
      </div>

      <h1 className="font-[var(--font-instrument-serif)] text-[clamp(32px,5vw,58px)] font-normal leading-[1.08] tracking-[-0.02em] text-[#1B4332] mb-7" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>
        Your aged care organisation,{" "}
        <em className="italic text-[#2D7D73]">running with intelligence.</em>
      </h1>

      <p className="text-base md:text-[17px] leading-[1.65] text-stone-600 max-w-xl mb-10 font-light">
        Six AI agents monitor every domain of your operation — clinical,
        financial, workforce, compliance, governance — continuously,
        simultaneously, and across every system you already run. When something
        needs action, CHRIS executes it.
      </p>

      <div className="flex items-center gap-4 flex-wrap mb-7">
        <button
          className="bg-[#1B4332] text-white px-7 py-3.5 rounded-lg text-sm font-medium hover:bg-[#1B4332]/90 transition-colors"
          onClick={() => document.getElementById("agent-section")?.scrollIntoView({ behavior: "smooth" })}
        >
          See the agents →
        </button>
        <Link
          href="/dashboard"
          className="border border-[#1B4332]/25 text-[#1B4332] px-7 py-3.5 rounded-lg text-sm font-normal hover:border-[#1B4332]/50 transition-colors"
        >
          Enter demo
        </Link>
      </div>

      <div className="flex items-center gap-3 md:gap-5 flex-wrap">
        {["Residential care", "Home care", "Built for Australian operators", "Aged Care Act 2024 ready"].map(
          (item, i, arr) => (
            <span key={item} className="flex items-center gap-3 md:gap-5">
              <span className="text-xs text-stone-400">{item}</span>
              {i < arr.length - 1 && <span className="w-1 h-1 rounded-full bg-stone-300" />}
            </span>
          )
        )}
      </div>
    </section>
  );
}

function SystemsStrip() {
  return (
    <div className="border-y border-[#1B4332]/8 bg-stone-50 px-6 md:px-10 py-3.5 flex items-center gap-3 overflow-hidden">
      <span className="text-[11px] font-medium tracking-[0.05em] uppercase text-stone-400 whitespace-nowrap flex-shrink-0">
        Connects to
      </span>
      <div className="w-px h-4 bg-[#1B4332]/15 flex-shrink-0" />
      <div className="flex gap-2 overflow-hidden flex-wrap">
        {SYSTEMS.map((s) => (
          <span key={s} className="inline-flex items-center gap-1.5 bg-white border border-[#1B4332]/12 rounded-full px-2.5 py-1 text-[11px] text-stone-500 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2D7D73]/70" />
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function LiveTicker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="bg-[#1B4332] h-10 flex items-center overflow-hidden">
      <div className="flex gap-12 animate-ticker whitespace-nowrap pl-10">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-[11px] text-white/70 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
            <span className="font-medium text-white/90">{item.agent}</span>
            {" — "}
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}

function AgentCard({
  agent, isSelected, onClick,
}: {
  agent: (typeof AGENTS)[0]; isSelected: boolean; onClick: () => void;
}) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
      style={{ top: agent.position.top, left: agent.position.left }}
      onClick={onClick}
    >
      <div className={`bg-white border rounded-xl px-3.5 py-3 w-32 shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:border-[#1B4332]/25 ${
        isSelected ? "border-[#1B4332]/40 shadow-md ring-1 ring-[#1B4332]/10" : "border-[#1B4332]/12"
      }`}>
        <span className={`inline-block text-[9px] font-medium tracking-[0.04em] uppercase px-1.5 py-0.5 rounded mb-1.5 ${agent.cadenceColor}`}>
          ● {agent.cadence}
        </span>
        <div className="text-[12px] font-medium text-stone-800 mb-0.5">{agent.name}</div>
        <div className="text-[10px] text-stone-400 leading-tight">{agent.role}</div>
      </div>
    </div>
  );
}

function AgentHub() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedAgent = AGENTS.find((a) => a.id === selected);

  return (
    <section className="px-6 md:px-10 py-12 md:py-18" id="agent-section">
      <div className="mb-4">
        <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-stone-400 mb-4">
          The intelligence layer
        </div>
        <h2 className="text-[clamp(28px,3.5vw,42px)] font-normal leading-[1.12] tracking-[-0.02em] text-[#1B4332] mb-4" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>
          Six agents.<br />Every domain. Always on.
        </h2>
        <p className="text-[15px] md:text-[16px] leading-relaxed text-stone-500 max-w-lg mb-12 font-light">
          Each agent has a domain, a cadence, and a job. Together they give
          every leader in your organisation a dedicated intelligence layer —
          working underneath them, 24 hours a day.
        </p>
      </div>

      {/* Hub diagram — hidden on mobile, show list instead */}
      <div className="hidden md:block relative w-full max-w-[680px] h-[500px]">
        <div className="absolute rounded-full border border-dashed border-[#1B4332]/12 -translate-x-1/2 -translate-y-1/2" style={{ width: 280, height: 280, left: "50%", top: "50%" }} />
        <div className="absolute rounded-full border border-dashed border-[#1B4332]/8 -translate-x-1/2 -translate-y-1/2" style={{ width: 440, height: 440, left: "50%", top: "50%" }} />

        <div className="absolute -translate-x-1/2 -translate-y-1/2 z-20" style={{ left: "50%", top: "50%" }}>
          <div className="w-28 h-28 bg-[#1B4332] rounded-full flex flex-col items-center justify-center" style={{ boxShadow: "0 0 0 16px rgba(27,67,50,0.08), 0 0 0 32px rgba(27,67,50,0.04)" }}>
            <span className="text-white text-[22px] italic leading-none" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>CHRIS</span>
            <span className="text-white/50 text-[9px] tracking-[0.1em] uppercase mt-1">always watching</span>
          </div>
        </div>

        {AGENTS.map((agent) => (
          <AgentCard key={agent.id} agent={agent} isSelected={selected === agent.id} onClick={() => setSelected(selected === agent.id ? null : agent.id)} />
        ))}
      </div>

      {/* Mobile agent list */}
      <div className="md:hidden space-y-3 mb-6">
        {AGENTS.map((agent) => (
          <button
            key={agent.id}
            onClick={() => setSelected(selected === agent.id ? null : agent.id)}
            className={`w-full text-left bg-white border rounded-xl px-4 py-3 transition-all ${
              selected === agent.id ? "border-[#1B4332]/40 shadow-md" : "border-[#1B4332]/12"
            }`}
          >
            <span className={`inline-block text-[9px] font-medium tracking-[0.04em] uppercase px-1.5 py-0.5 rounded mb-1.5 ${agent.cadenceColor}`}>
              ● {agent.cadence}
            </span>
            <div className="text-[13px] font-medium text-stone-800 mb-0.5">{agent.name}</div>
            <div className="text-[11px] text-stone-400 leading-tight">{agent.role}</div>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <div className={`bg-white border border-[#1B4332]/12 rounded-xl p-5 mt-6 md:mt-8 max-w-lg transition-opacity duration-200 ${selectedAgent ? "opacity-100" : "opacity-30"}`}>
        <div className="text-[18px] md:text-[20px] text-[#1B4332] mb-1.5" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>
          {selectedAgent?.detail.title ?? "Tap any agent to learn more"}
        </div>
        <div className="text-[13px] text-stone-500 leading-relaxed">
          {selectedAgent?.detail.body ?? "Each agent has a specific domain, cadence, and scope. Together they replace the hours of manual data synthesis currently distributed across your leadership team."}
        </div>
        {selectedAgent && (
          <div className="mt-3 px-3 py-2.5 bg-stone-50 rounded-lg text-[12px] text-stone-500 italic border-l-2 border-[#2D7D73] leading-relaxed">
            {selectedAgent.detail.example}
          </div>
        )}
      </div>
    </section>
  );
}

function ExecutionSection() {
  return (
    <div className="bg-stone-50 border-y border-[#1B4332]/8">
      <section className="px-6 md:px-10 py-12 md:py-18">
        <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-stone-400 mb-4">
          The execution layer
        </div>
        <h2 className="text-[clamp(28px,3.5vw,42px)] font-normal leading-[1.12] tracking-[-0.02em] text-[#1B4332] mb-4" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>
          CHRIS doesn&apos;t just tell you.<br />It acts.
        </h2>
        <p className="text-[15px] md:text-[16px] leading-relaxed text-stone-500 max-w-lg mb-12 font-light">
          Most analytics tools give you data to interpret. CHRIS delivers a
          drafted document, a specific action, or a coordinated recommendation
          — ready for your review and approval.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:divide-x sm:divide-y divide-[#1B4332]/8 border border-[#1B4332]/8 rounded-xl overflow-hidden">
          {EXECUTION_PILLARS.map((p) => (
            <div key={p.title} className="bg-white p-5 md:p-6">
              <div className="text-lg mb-2.5">{p.icon}</div>
              <div className="text-[13px] font-medium text-stone-800 mb-2">{p.title}</div>
              <div className="text-[12px] text-stone-400 leading-relaxed">{p.body}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function RolesSection() {
  return (
    <section className="px-6 md:px-10 py-12 md:py-18">
      <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-stone-400 mb-4">
        Built for every leader
      </div>
      <h2 className="text-[clamp(28px,3.5vw,42px)] font-normal leading-[1.12] tracking-[-0.02em] text-[#1B4332] mb-4" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>
        One platform.<br />Every leader in your organisation.
      </h2>
      <p className="text-[15px] md:text-[16px] leading-relaxed text-stone-500 max-w-lg mb-12 font-light">
        CHRIS adapts to the role looking at it. The CEO sees the portfolio
        view. The DON sees clinical and operational signals. The CFO sees the
        financial intelligence. The WHS Lead sees the psychosocial picture.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ROLES.map((r) => (
          <div key={r.title} className="bg-white border border-[#1B4332]/10 rounded-xl p-4 hover:border-[#1B4332]/25 transition-colors">
            <div className="text-[13px] font-medium text-stone-800 mb-1">{r.title}</div>
            <div className="text-[11px] text-stone-400 leading-relaxed">{r.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DemoSection() {
  return (
    <section className="px-6 md:px-10 py-12 md:py-18 bg-stone-50 border-t border-[#1B4332]/8">
      <div className="max-w-2xl">
        <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-stone-400 mb-4">
          See it working
        </div>
        <h2 className="text-[clamp(24px,3vw,36px)] font-normal leading-[1.15] tracking-[-0.02em] text-[#1B4332] mb-4" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>
          Enter the demo
        </h2>
        <p className="text-[15px] leading-relaxed text-stone-500 max-w-lg mb-8 font-light">
          Choose a care type to explore. You are entering a demo environment with representative data. Nothing you interact with affects a real facility.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
          <Link
            href="/dashboard"
            className="flex flex-col items-center gap-2 px-6 py-5 bg-[#1B4332] text-white rounded-xl hover:bg-[#2D7D73] transition-colors text-center"
          >
            <span className="text-base font-semibold">Residential Care</span>
            <span className="text-xs text-white/60">137-bed facility · DON view · 6 agents active</span>
          </Link>
          <Link
            href="/dashboard/home-care?care=home_care"
            className="flex flex-col items-center gap-2 px-6 py-5 bg-[#1B4332] text-white rounded-xl hover:bg-[#2D7D73] transition-colors text-center"
          >
            <span className="text-base font-semibold">Home Care</span>
            <span className="text-xs text-white/60">247 clients · 2 services · Support at Home</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#1B4332]/10 px-6 md:px-10 py-6 bg-stone-50 flex items-center justify-between flex-wrap gap-3">
      <span className="text-[12px] text-stone-400">
        CHRIS-OS — The operational intelligence and execution system for Australian aged care
      </span>
      <span className="text-[12px] text-stone-400">
        chris-os.io · Live in NSW and VIC
      </span>
    </footer>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="bg-[#F5F2EB] text-stone-900 overflow-hidden" style={{ fontFamily: "var(--font-dm-sans), 'DM Sans', system-ui, sans-serif" }}>
      <Nav />
      <Hero />
      <SystemsStrip />
      <LiveTicker />
      <AgentHub />
      <ExecutionSection />
      <RolesSection />
      <DemoSection />
      <Footer />
    </div>
  );
}
