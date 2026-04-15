"use client";

import { useState } from "react";
import Link from "next/link";
import ChrisPublicChat from "@/components/ChrisPublicChat";
import { RoiCalculator } from "@/components/RoiCalculator";

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
    <nav className="border-b border-[#1B4332]/10">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 lg:px-16 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#1B4332] rounded-lg flex items-center justify-center text-white text-sm font-medium tracking-tight">
            C
          </div>
          <span className="text-[#1B4332] text-[15px] font-medium tracking-tight">CHRIS-OS</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/newsroom" className="text-[13px] text-stone-400 hover:text-[#1B4332] transition-colors hidden md:block">Newsroom</Link>
          <Link href="/technology" className="text-[13px] text-stone-400 hover:text-[#1B4332] transition-colors hidden md:block">Technology</Link>
          <a href="#roi-calculator" className="text-[13px] text-stone-400 hover:text-[#1B4332] transition-colors hidden md:block">ROI</a>
          <a href="#waitlist" className="text-[13px] bg-[#1B4332] text-white px-5 py-2 rounded-lg hover:bg-[#1B4332]/90 transition-colors font-medium">Join waitlist →</a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 lg:px-16 pt-16 lg:pt-24 pb-16 lg:pb-20">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-[#1B4332] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live with providers in NSW and VIC
        </div>

        <h1 className="text-[clamp(36px,5vw,58px)] font-normal leading-[1.08] tracking-[-0.02em] text-[#1B4332] mb-7" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>
          Your aged care organisation,{" "}
          <em className="italic text-[#2D7D73]">running with intelligence.</em>
        </h1>

        <p className="text-[17px] leading-[1.65] text-stone-500 max-w-xl mb-10">
          Six AI agents monitor every domain of your operation — clinical,
          financial, workforce, compliance, governance — continuously,
          simultaneously, and across every system you already run. When something
          needs action, CHRIS executes it.
        </p>

        <div className="flex items-center gap-3 flex-wrap mb-8">
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
            Enter demo — Residential
          </Link>
          <Link
            href="/dashboard/home-care?care=home_care"
            className="border border-[#1B4332]/25 text-[#1B4332] px-7 py-3.5 rounded-lg text-sm font-normal hover:border-[#1B4332]/50 transition-colors"
          >
            Enter demo — Home Care
          </Link>
        </div>

        <div className="flex items-center gap-5 flex-wrap">
          {["Residential care", "Home care", "Built for Australian operators", "Aged Care Act 2024 ready"].map(
            (item, i, arr) => (
              <span key={item} className="flex items-center gap-5">
                <span className="text-xs text-stone-400">{item}</span>
                {i < arr.length - 1 && <span className="w-1 h-1 rounded-full bg-stone-300" />}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}

function SystemsStrip() {
  return (
    <div className="border-y border-[#1B4332]/8 bg-stone-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-3.5 flex items-center gap-3 overflow-hidden">
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
      <div className={`bg-white border rounded-xl px-4 py-3.5 w-[160px] shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:border-[#1B4332]/25 ${
        isSelected ? "border-[#1B4332]/40 shadow-md ring-1 ring-[#1B4332]/10" : "border-[#1B4332]/12"
      }`}>
        <span className={`inline-block text-[10px] font-medium tracking-[0.04em] uppercase px-1.5 py-0.5 rounded mb-1.5 ${agent.cadenceColor}`}>
          ● {agent.cadence}
        </span>
        <div className="text-[13px] font-medium text-stone-800 mb-0.5">{agent.name}</div>
        <div className="text-[11px] text-stone-400 leading-snug">{agent.role}</div>
      </div>
    </div>
  );
}

function AgentHub() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedAgent = AGENTS.find((a) => a.id === selected);

  return (
    <section className="py-16 lg:py-24" id="agent-section">
      <div className="max-w-6xl mx-auto px-6 lg:px-16">
        <div className="mb-8">
          <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-stone-400 mb-4">
            The intelligence layer
          </div>
          <h2 className="text-[clamp(28px,3.5vw,42px)] font-normal leading-[1.12] tracking-[-0.02em] text-[#1B4332] mb-4" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>
            Six agents.<br />Every domain. Always on.
          </h2>
          <p className="text-[16px] leading-relaxed text-stone-500 max-w-xl mb-0">
            Each agent has a domain, a cadence, and a job. Together they give
            every leader in your organisation a dedicated intelligence layer —
            working underneath them, 24 hours a day.
          </p>
        </div>

        {/* Desktop: hub diagram centred */}
        <div className="hidden lg:flex justify-center mb-10">
          <div className="relative w-[720px] h-[540px]">
            <div className="absolute rounded-full border border-dashed border-[#1B4332]/12 -translate-x-1/2 -translate-y-1/2" style={{ width: 300, height: 300, left: "50%", top: "50%" }} />
            <div className="absolute rounded-full border border-dashed border-[#1B4332]/8 -translate-x-1/2 -translate-y-1/2" style={{ width: 480, height: 480, left: "50%", top: "50%" }} />

            <div className="absolute -translate-x-1/2 -translate-y-1/2 z-20" style={{ left: "50%", top: "50%" }}>
              <div className="w-32 h-32 bg-[#1B4332] rounded-full flex flex-col items-center justify-center" style={{ boxShadow: "0 0 0 20px rgba(27,67,50,0.08), 0 0 0 40px rgba(27,67,50,0.04)" }}>
                <span className="text-white text-[26px] italic leading-none" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>CHRIS</span>
                <span className="text-white/50 text-[9px] tracking-[0.1em] uppercase mt-1.5">always watching</span>
              </div>
            </div>

            {AGENTS.map((agent) => (
              <AgentCard key={agent.id} agent={agent} isSelected={selected === agent.id} onClick={() => setSelected(selected === agent.id ? null : agent.id)} />
            ))}
          </div>
        </div>

        {/* Tablet: hub diagram smaller */}
        <div className="hidden md:flex lg:hidden justify-center mb-10">
          <div className="relative w-full max-w-[600px] h-[460px]">
            <div className="absolute rounded-full border border-dashed border-[#1B4332]/12 -translate-x-1/2 -translate-y-1/2" style={{ width: 250, height: 250, left: "50%", top: "50%" }} />
            <div className="absolute rounded-full border border-dashed border-[#1B4332]/8 -translate-x-1/2 -translate-y-1/2" style={{ width: 400, height: 400, left: "50%", top: "50%" }} />

            <div className="absolute -translate-x-1/2 -translate-y-1/2 z-20" style={{ left: "50%", top: "50%" }}>
              <div className="w-28 h-28 bg-[#1B4332] rounded-full flex flex-col items-center justify-center" style={{ boxShadow: "0 0 0 16px rgba(27,67,50,0.08), 0 0 0 32px rgba(27,67,50,0.04)" }}>
                <span className="text-white text-[22px] italic leading-none" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>CHRIS</span>
                <span className="text-white/50 text-[9px] tracking-[0.1em] uppercase mt-1">always watching</span>
              </div>
            </div>

            {AGENTS.map((agent) => (
              <AgentCard key={agent.id} agent={agent} isSelected={selected === agent.id} onClick={() => setSelected(selected === agent.id ? null : agent.id)} />
            ))}
          </div>
        </div>

        {/* Mobile: card list */}
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
        <div className={`bg-white border border-[#1B4332]/12 rounded-xl p-6 lg:p-8 max-w-2xl mx-auto transition-opacity duration-200 ${selectedAgent ? "opacity-100" : "opacity-30"}`}>
          <div className="text-[20px] lg:text-[24px] text-[#1B4332] mb-2" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>
            {selectedAgent?.detail.title ?? "Click any agent to learn more"}
          </div>
          <div className="text-[14px] text-stone-500 leading-relaxed">
            {selectedAgent?.detail.body ?? "Each agent has a specific domain, cadence, and scope. Together they replace the hours of manual data synthesis currently distributed across your leadership team."}
          </div>
          {selectedAgent && (
            <div className="mt-4 px-4 py-3 bg-stone-50 rounded-lg text-[13px] text-stone-500 italic border-l-2 border-[#2D7D73] leading-relaxed">
              {selectedAgent.detail.example}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ChrisCoachCTA() {
  return (
    <div className="bg-[#EDE9DF] border-y border-[#1B4332]/8">
      <section className="max-w-6xl mx-auto px-6 lg:px-16 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#2D7D73] mb-4">
              Operational intelligence + leadership coach
            </div>
            <h2 className="text-[clamp(28px,3.5vw,42px)] font-normal leading-[1.12] tracking-[-0.02em] text-[#1B4332] mb-5" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>
              Ask the question<br />you&apos;ve been sitting on.
            </h2>
            <p className="text-[16px] leading-relaxed text-stone-500 mb-6">
              CHRIS is an operational intelligence layer and a leadership
              coach built specifically for aged care. Ask about compliance,
              workforce, funding — or bring a leadership challenge. Preparing
              for a difficult conversation, navigating team conflict, managing
              the pressure of the role. CHRIS coaches the way a trusted
              colleague would — direct, warm, and grounded in what actually
              works in this sector. No login. No signup.
            </p>
            <p className="text-xs text-stone-400">
              You&apos;re talking to a public preview of CHRIS.
              The full platform connects to your systems and knows your team.
            </p>
          </div>
          <div>
            <ChrisPublicChat />
          </div>
        </div>
      </section>
    </div>
  );
}

function ExecutionSection() {
  return (
    <div className="bg-stone-50 border-y border-[#1B4332]/8">
      <section className="max-w-6xl mx-auto px-6 lg:px-16 py-16 lg:py-24">
        <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-stone-400 mb-4">
          The execution layer
        </div>
        <h2 className="text-[clamp(28px,3.5vw,42px)] font-normal leading-[1.12] tracking-[-0.02em] text-[#1B4332] mb-4" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>
          CHRIS doesn&apos;t just tell you.<br />It acts.
        </h2>
        <p className="text-[16px] leading-relaxed text-stone-500 max-w-xl mb-12">
          Most analytics tools give you data to interpret. CHRIS delivers a
          drafted document, a specific action, or a coordinated recommendation
          — ready for your review and approval.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#1B4332]/8 border border-[#1B4332]/8 rounded-xl overflow-hidden">
          {EXECUTION_PILLARS.map((p) => (
            <div key={p.title} className="bg-white p-6 lg:p-7">
              <div className="text-xl lg:text-2xl mb-3">{p.icon}</div>
              <div className="text-[14px] font-medium text-stone-800 mb-2">{p.title}</div>
              <div className="text-[13px] text-stone-400 leading-relaxed">{p.body}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function RolesSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 lg:px-16 py-16 lg:py-24">
      <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-stone-400 mb-4">
        Built for every leader
      </div>
      <h2 className="text-[clamp(28px,3.5vw,42px)] font-normal leading-[1.12] tracking-[-0.02em] text-[#1B4332] mb-4" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>
        One platform.<br />Every leader in your organisation.
      </h2>
      <p className="text-[16px] leading-relaxed text-stone-500 max-w-xl mb-12">
        CHRIS adapts to the role looking at it. The CEO sees the portfolio
        view. The DON sees clinical and operational signals. The CFO sees the
        financial intelligence. The WHS Lead sees the psychosocial picture.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ROLES.map((r) => (
          <div key={r.title} className="bg-white border border-[#1B4332]/10 rounded-xl p-5 lg:p-6 hover:border-[#1B4332]/25 hover:shadow-sm transition-all">
            <div className="text-[14px] font-medium text-stone-800 mb-1.5">{r.title}</div>
            <div className="text-[13px] text-stone-400 leading-relaxed">{r.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DemoSection() {
  return (
    <div className="bg-stone-50 border-t border-[#1B4332]/8">
      <section className="max-w-6xl mx-auto px-6 lg:px-16 py-16 lg:py-24">
        <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-stone-400 mb-4">
          See it working
        </div>
        <h2 className="text-[clamp(24px,3vw,36px)] font-normal leading-[1.15] tracking-[-0.02em] text-[#1B4332] mb-4" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>
          Enter the demo
        </h2>
        <p className="text-[16px] leading-relaxed text-stone-500 max-w-xl mb-10">
          Choose a care type to explore. You are entering a demo environment with representative data. Nothing you interact with affects a real facility.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
          <Link
            href="/dashboard"
            className="flex flex-col items-center gap-2.5 px-6 py-6 bg-[#1B4332] text-white rounded-xl hover:bg-[#2D7D73] transition-colors text-center"
          >
            <span className="text-base font-semibold">Residential Care</span>
            <span className="text-xs text-white/60">137-bed facility · DON view · 6 agents active</span>
          </Link>
          <Link
            href="/dashboard/home-care?care=home_care"
            className="flex flex-col items-center gap-2.5 px-6 py-6 bg-[#1B4332] text-white rounded-xl hover:bg-[#2D7D73] transition-colors text-center"
          >
            <span className="text-base font-semibold">Home Care</span>
            <span className="text-xs text-white/60">247 clients · 2 services · Support at Home</span>
          </Link>
          <div className="flex flex-col items-center gap-2.5 px-6 py-6 bg-[#1B4332]/60 text-white/70 rounded-xl text-center cursor-default">
            <span className="text-base font-semibold">NDIS</span>
            <span className="text-xs text-white/40">Coming soon</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [org, setOrg] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, role, organisation: org }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="bg-[#1B4332]" id="waitlist">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-white/50 mb-4">
              Join the waitlist
            </div>
            <h2 className="text-[clamp(28px,3.5vw,42px)] font-normal leading-[1.1] tracking-[-0.02em] mb-5" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif", color: "#ffffff" }}>
              Be first to run CHRIS
              <br />
              <em className="italic" style={{ color: "#86EFAC" }}>at your organisation.</em>
            </h2>
            <p className="text-[15px] leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.85)" }}>
              CHRIS-OS is live with providers in NSW and VIC. We are onboarding
              new organisations in order. Join the waitlist and we will be in
              touch to discuss your facility, your systems, and what CHRIS
              would look like connected to your operation.
            </p>
            <div className="space-y-3">
              {[
                "No implementation fee for foundation clients",
                "Live within 4 weeks of signed agreement",
                "Your data stays in Australia (Sydney region)",
                "Cancel anytime — your data is always exportable",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0">
                    <svg width="8" height="8" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke="#86EFAC" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
                  </div>
                  <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.70)" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            {submitted ? (
              <div className="bg-white/8 border border-white/12 rounded-2xl p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-400/20 flex items-center justify-center mx-auto mb-4">
                  <svg width="20" height="20" viewBox="0 0 20 20"><path d="M4 10l4 4 8-8" stroke="#86EFAC" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
                </div>
                <p className="text-[16px] font-medium mb-2" style={{ color: "#ffffff" }}>You are on the waitlist.</p>
                <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.65)" }}>
                  We will be in touch at {email} to discuss connecting CHRIS to your organisation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white/8 border border-white/12 rounded-2xl p-6 space-y-4">
                <div>
                  <label className="text-[11px] font-medium tracking-[0.04em] uppercase text-white/50 mb-1.5 block">Work email *</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@organisation.com.au"
                    className="w-full px-4 py-3 rounded-lg bg-white/6 border border-white/12 text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/30" />
                </div>
                <div>
                  <label className="text-[11px] font-medium tracking-[0.04em] uppercase text-white/50 mb-1.5 block">Your name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full px-4 py-3 rounded-lg bg-white/6 border border-white/12 text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/30" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium tracking-[0.04em] uppercase text-white/50 mb-1.5 block">Role</label>
                    <input type="text" value={role} onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. CEO, DON"
                      className="w-full px-4 py-3 rounded-lg bg-white/6 border border-white/12 text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/30" />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium tracking-[0.04em] uppercase text-white/50 mb-1.5 block">Organisation</label>
                    <input type="text" value={org} onChange={(e) => setOrg(e.target.value)}
                      placeholder="Provider name"
                      className="w-full px-4 py-3 rounded-lg bg-white/6 border border-white/12 text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/30" />
                  </div>
                </div>
                <button type="submit" disabled={submitting || !email}
                  className="w-full py-3.5 rounded-lg text-[14px] font-medium bg-white text-[#1B4332] hover:bg-white/90 disabled:opacity-50 transition-colors">
                  {submitting ? "Joining..." : "Join the waitlist →"}
                </button>
                <p className="text-[10px] text-center" style={{ color: "rgba(255,255,255,0.35)" }}>
                  No spam. No sales calls. Just a conversation about your facility.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#1B4332]/10 bg-stone-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-6 flex items-center justify-between flex-wrap gap-3">
        <span className="text-[12px] text-stone-400">
          CHRIS-OS — The operational intelligence and execution system for Australian aged care
        </span>
        <span className="flex items-center gap-4 text-[12px] text-stone-400">
          <Link href="/dashboard/references" className="hover:text-stone-600 transition-colors">Sources & references</Link>
          <Link href="/legal" className="hover:text-stone-600 transition-colors">Privacy</Link>
          <span>chris-os.io · Live in NSW and VIC</span>
        </span>
      </div>
    </footer>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="bg-[#F5F2EB] text-stone-900 overflow-hidden" style={{ fontFamily: "var(--font-dm-sans, 'DM Sans'), system-ui, sans-serif" }}>
      <Nav />
      <Hero />
      <SystemsStrip />
      <LiveTicker />
      <AgentHub />
      <ChrisCoachCTA />
      <ExecutionSection />
      <RoiCalculator />
      <RolesSection />
      <DemoSection />
      <WaitlistSection />
      <Footer />
    </div>
  );
}
