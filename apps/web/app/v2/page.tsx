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
  { title: "Care minutes & supplement", blurb: "Are you meeting 215/44? See your compliance position and your financial exposure.", cta: "Run the check →", href: "/care-minutes" },
  { title: "PSH self-assessment", blurb: "Score your facility across all 16 ISO 45003 psychosocial hazards. Get your convergence risk.", cta: "Start the assessment →", href: "/v2" },
  { title: "EX workforce ROI", blurb: "What's turnover, agency dependence, and burnout costing you? Modelled on your facility.", cta: "Calculate ROI →", href: "/v2" },
];

const STATS = [
  { number: "$1.5M", label: "Maximum corporate penalty · serious failure · Aged Care Act 2024", color: C.warm },
  { number: "549,000", label: "Aged care workers · no operational OS · until now", color: C.copper },
  { number: "16", label: "Mandated psychosocial hazards · one spreadsheet between them and you", color: C.good },
  { number: "$159K", label: "Spent annually per facility · leaders stitching together 8 systems that should talk to each other", color: C.copper },
];

const JOBS = [
  { n: "01", role: "DON", title: "Handle SIRS without missing a deadline", hook: "A Priority 1 incident. 11pm. The 24-hour clock is running.", accent: C.warm },
  { n: "02", role: "DON", title: "Stay on the right side of care minutes every day", hook: "2pm. Your RN called in sick. Nobody's run the numbers.", accent: C.copper },
  { n: "03", role: "Quality Lead", title: "Submit QI without the quarterly scramble", hook: "The GPMS window opens. Someone has to pull 14 indicator domains from three systems.", accent: C.good },
  { n: "04", role: "Quality Lead", title: "Track corrective actions so nothing falls through", hook: "A corrective action was opened six weeks ago. Nobody knows who owns it.", accent: C.dark },
  { n: "05", role: "DON", title: "Give every leader their Monday briefing", hook: "Sunday night. Someone has to pull together what's happening across the facility.", accent: C.good },
  { n: "06", role: "CEO", title: "Produce board and committee packs from live data", hook: "Three days before the board meeting. Five systems. One Sunday lost.", accent: C.dark },
  { n: "07", role: "WHS Lead", title: "Know which workforce risks are real before they become incidents", hook: "Three staff resigned in the same wing in four weeks. Nobody connected the signals.", accent: C.copper },
  { n: "08", role: "CFO", title: "Optimise AN-ACC funding without a consultant", hook: "Your revenue per bed is 8% below sector average. Nobody knows why.", accent: C.warm },
  { n: "09", role: "CEO", title: "See what's coming before it hits", hook: "A complaint pattern built for six weeks. In hindsight, the signals were there.", accent: C.dark },
];

const AGENTS = [
  { name: "The Sentinel", cadence: "2-hr cycle", domain: "Clinical & compliance vigilance", color: C.good },
  { name: "The Oracle", cadence: "Weekly", domain: "Revenue & funding intelligence", color: C.copper },
  { name: "The Steward", cadence: "Daily", domain: "Capacity & operational structure", color: C.good },
  { name: "The Chronicler", cadence: "Event-driven", domain: "Auto-documentation & evidence", color: C.copper },
  { name: "The Keeper", cadence: "Fortnightly", domain: "Workforce intelligence & people health", color: C.warm },
  { name: "The Town Crier", cadence: "Continuous", domain: "Signal coordination & clarity", color: C.inkMuted },
  { name: "The Curator", cadence: "2-hr cycle", domain: "Sector intelligence & regulatory watch", color: C.inkMuted },
];

const EXECUTION = [
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

// ─── Components ─────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav className="sticky top-0 z-50 transition-colors" style={{ backgroundColor: C.dark, borderBottom: `1px solid rgba(245,237,227,0.08)` }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 lg:px-16 py-4">
        <Link href="/v2" className="text-[15px] font-medium tracking-tight" style={{ color: C.ink }}>
          CHRIS<span style={{ color: C.copper }}>·</span>OS
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/care-minutes" className="text-[13px] hidden md:block transition-colors hover:opacity-80" style={{ color: C.inkMuted }}>Tools</Link>
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

          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[1.12] tracking-[-0.02em] mb-7" style={{ fontFamily: "Georgia, serif", color: C.ink }}>
            Your aged care organisation,{" "}
            <em className="italic" style={{ color: C.copper }}>running with intelligence.</em>
          </h1>

          <p className="text-[17px] leading-[1.65] max-w-[500px] mx-auto mb-10" style={{ color: C.inkMuted }}>
            Seven AI agents monitor every domain of your operation — clinical,
            financial, workforce, compliance, governance — continuously,
            simultaneously, and across every system you already run. When something
            needs action, CHRIS executes it.
          </p>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <a href="#book" className="px-7 py-3.5 rounded text-[14px] font-medium transition-colors hover:opacity-90" style={{ backgroundColor: C.copper, color: C.dark }}>
              Book a 30-min conversation
            </a>
            <a href="#jobs" className="px-7 py-3.5 rounded text-[14px] transition-colors" style={{ border: `1px solid rgba(245,237,227,0.25)`, color: C.inkMuted }}>
              See the 9 jobs CHRIS handles →
            </a>
          </div>
        </div>
      </div>

      {/* Product cards — 3 live UI cards, symmetric, Care Minutes centre + tallest */}
      <div className="relative z-10 max-w-[1060px] mx-auto px-6 lg:px-8 mt-6 lg:mt-8">
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
    <div className="overflow-hidden" style={{ backgroundColor: C.dark, borderTop: "1px solid rgba(245,237,227,0.06)", borderBottom: "1px solid rgba(245,237,227,0.06)" }}>
      <div className="flex items-center h-10 animate-ticker whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-[11px] tracking-wide mx-6 shrink-0" style={{ color: "rgba(245,237,227,0.45)" }}>
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="font-medium" style={{ color: "rgba(245,237,227,0.65)" }}>{item.agent}</span>
            <span>—</span>
            <span>{item.text}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function ToolsStrip() {
  return (
    <section className="pt-12 lg:pt-16 pb-12" style={{ backgroundColor: C.cream }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16">
        <div className="text-[11px] font-medium tracking-[0.12em] uppercase mb-3" style={{ color: C.copperDark }}>
          See your own numbers · 3 minutes · No signup
        </div>
        <h2 className="text-[clamp(1.3rem,2.5vw,1.8rem)] font-normal leading-[1.2] mb-2" style={{ fontFamily: "Georgia, serif", color: C.inkDark }}>
          Three tools. Run them on your facility before we ever talk.
        </h2>
        <p className="text-[15px] mb-8" style={{ color: C.inkMutedLight }}>
          Built on the same intelligence layer CHRIS runs on. The numbers you see are the numbers we'd model on day one.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TOOLS.map((tool) => (
            <Link key={tool.title} href={tool.href} className="border rounded-lg p-5 transition-all hover:-translate-y-1" style={{ backgroundColor: C.white, borderColor: "rgba(26,18,24,0.1)" }}>
              <h3 className="text-[15px] font-medium mb-2" style={{ color: C.inkDark }}>{tool.title}</h3>
              <p className="text-[13px] leading-relaxed mb-3" style={{ color: C.inkMutedLight }}>{tool.blurb}</p>
              <span className="text-[13px] font-medium" style={{ color: C.copperDark }}>{tool.cta}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <div style={{ backgroundColor: C.dark }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-4 flex items-center gap-3 overflow-hidden">
        <span className="text-[11px] font-medium tracking-[0.05em] uppercase whitespace-nowrap shrink-0" style={{ color: "rgba(245,237,227,0.4)" }}>Connects to</span>
        <div className="w-px h-4 shrink-0" style={{ backgroundColor: "rgba(245,237,227,0.12)" }} />
        <div className="flex gap-2 overflow-hidden flex-wrap">
          {["Clinical systems", "Rostering & HR", "Finance & payroll", "WHS registers", "ACQSC portal", "AN-ACC data", "GPMS", "StewartBrown benchmarks", "Pulse surveys"].map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5 border rounded-full px-2.5 py-1 text-[11px] whitespace-nowrap" style={{ borderColor: "rgba(245,237,227,0.12)", color: "rgba(245,237,227,0.5)" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.good }} />
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatRow() {
  return (
    <section style={{ backgroundColor: C.cream }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
          {STATS.map((stat, i) => (
            <div key={stat.label} className={`flex flex-col items-center text-center py-6 lg:py-0 ${i < STATS.length - 1 ? "border-b lg:border-b-0 lg:border-r" : ""}`} style={{ borderColor: "rgba(26,18,24,0.08)" }}>
              <div className="text-[clamp(2rem,4vw,3rem)] font-normal leading-none mb-2" style={{ fontFamily: "Georgia, serif", color: stat.color }}>{stat.number}</div>
              <div className="text-[12px] uppercase tracking-[0.06em] leading-snug max-w-[200px]" style={{ color: C.inkMutedLight }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function JobsSection() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section style={{ backgroundColor: C.cream }} id="jobs">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16 lg:py-24">
        <div className="text-[11px] font-medium tracking-[0.08em] uppercase mb-4" style={{ color: C.copperDark }}>Where we start</div>
        <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-normal leading-[1.1] tracking-[-0.01em] mb-3" style={{ fontFamily: "Georgia, serif", color: C.inkDark }}>
          We don&apos;t sell a platform. We fix a problem.<br />
          <em className="italic" style={{ color: C.copperDark }}>Then another. Then another.</em>
        </h2>
        <p className="text-[16px] leading-relaxed mb-3" style={{ color: C.inkMutedLight }}>
          Pick the one workflow that&apos;s costing you the most right now. CHRIS handles it end-to-end. You approve the outcome.
        </p>
        <p className="text-[15px] leading-relaxed mb-12" style={{ color: "rgba(26,18,24,0.5)" }}>
          These are the problems we see most often. Yours might be something else entirely. Either way, we&apos;ll find it in a single conversation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {JOBS.map((job) => (
            <button key={job.n} onClick={() => setExpanded(expanded === job.n ? null : job.n)}
              className="w-full text-left border rounded-lg transition-all hover:-translate-y-1"
              style={{ backgroundColor: C.white, borderColor: "rgba(26,18,24,0.08)", borderLeftWidth: 4, borderLeftColor: job.accent }}>
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
    </section>
  );
}

function ScenarioSection() {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: C.dark, padding: "clamp(80px, 10vh, 140px) clamp(24px, 5vw, 80px)" }}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "200px 200px" }} />
      <div className="relative z-10 max-w-[720px] mx-auto">
        <div className="text-[11px] font-medium tracking-[0.18em] uppercase mb-10" style={{ color: C.copper }}>A real scenario. Every facility. Every week.</div>
        <div className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.1] mb-6" style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: C.ink }}>11:04pm Friday.</div>
        <div className="space-y-1 mb-8">
          <p className="text-[clamp(1.05rem,1.8vw,1.3rem)]" style={{ color: "rgba(245,237,227,0.45)" }}>A Priority 1 incident. 24 hours to notify ACQSC.</p>
        </div>
        <p className="text-[clamp(1.3rem,2.2vw,1.8rem)] font-medium mb-2" style={{ color: C.ink }}>CHRIS classified it in 4 minutes.</p>
        <div className="space-y-1 mb-8">
          <p className="text-[clamp(1.1rem,2vw,1.5rem)] italic" style={{ fontFamily: "Georgia, serif", color: C.ink }}>The draft was waiting in the DON&apos;s inbox by 11:09.</p>
          <p className="text-[clamp(1.1rem,2vw,1.5rem)] italic" style={{ fontFamily: "Georgia, serif", color: C.ink }}>She approved it before midnight.</p>
        </div>
        <p className="text-[clamp(1rem,1.6vw,1.2rem)] mb-1" style={{ color: "rgba(245,237,227,0.5)" }}>That&apos;s not a feature.</p>
        <p className="text-[clamp(1.3rem,2.2vw,1.8rem)] font-medium" style={{ color: C.copper }}>That&apos;s the difference between a penalty and a clean record.</p>

        <div className="mt-10 mb-6" style={{ width: 60, height: 2, backgroundColor: C.copper }} />
        <p className="text-[13px]" style={{ color: "rgba(245,237,227,0.55)" }}>The Chronicler agent · event-driven · always watching</p>
      </div>
    </section>
  );
}

function AgentsSection() {
  return (
    <section style={{ backgroundColor: C.cream }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16 lg:py-24">
        <div className="text-[11px] font-medium tracking-[0.08em] uppercase mb-4" style={{ color: C.copperDark }}>The intelligence layer</div>
        <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-normal leading-[1.1] mb-3" style={{ fontFamily: "Georgia, serif", color: C.inkDark }}>
          Seven agents. Every domain. <em className="italic" style={{ color: C.copperDark }}>Always on.</em>
        </h2>
        <p className="text-[15px] leading-relaxed max-w-xl mb-12" style={{ color: C.inkMutedLight }}>
          Each agent has a domain, a cadence, and a job. Together they give every leader in your organisation a dedicated intelligence layer — working underneath them, 24 hours a day.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {AGENTS.map((agent) => (
            <div key={agent.name} className="border rounded-lg p-4" style={{ backgroundColor: C.white, borderColor: "rgba(26,18,24,0.08)" }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: agent.color }} />
                <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: C.copperDark }}>{agent.cadence}</span>
              </div>
              <p className="text-[14px] font-medium mb-1" style={{ color: C.inkDark }}>{agent.name}</p>
              <p className="text-[12px]" style={{ color: C.inkMutedLight }}>{agent.domain}</p>
            </div>
          ))}
        </div>
      </div>
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
            <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-normal leading-[1.1] mb-5" style={{ fontFamily: "Georgia, serif", color: C.ink }}>
              Ask the question <em className="italic" style={{ color: C.copper }}>you&apos;ve been sitting on.</em>
            </h2>
            <p className="text-[15px] leading-relaxed mb-6" style={{ color: C.inkMuted }}>
              CHRIS is an operational intelligence layer and AI support built specifically for aged care. Ask about compliance, workforce, funding — or bring a leadership challenge. Preparing for a difficult conversation, navigating team conflict, managing the pressure of the role. CHRIS supports the way a trusted colleague would — direct, warm, and grounded in what actually works in this sector. No login. No signup.
            </p>
            <p className="text-[12px]" style={{ color: "rgba(245,237,227,0.4)" }}>
              You&apos;re talking to a public preview of CHRIS. The full platform connects to your systems and knows your team.
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
          CHRIS doesn&apos;t just tell you. <em className="italic" style={{ color: C.copperDark }}>It acts.</em>
        </h2>
        <p className="text-[15px] leading-relaxed max-w-xl mb-12" style={{ color: C.inkMutedLight }}>
          Most analytics tools give you data to interpret. CHRIS delivers a drafted document, a specific action, or a coordinated recommendation — ready for your review and approval.
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
          CHRIS adapts to the role looking at it. The CEO sees the portfolio view. The DON sees clinical and operational signals. The CFO sees the financial intelligence. The WHS Lead sees the psychosocial picture.
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
        <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-normal leading-[1.1] mb-10" style={{ fontFamily: "Georgia, serif", color: C.ink }}>
          Pick the one that fits where you are.
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Book */}
          <div className="rounded-lg p-6 lg:p-8" style={{ backgroundColor: C.dark2, border: `1px solid ${C.copper}40` }}>
            <h3 className="text-[18px] font-medium mb-3" style={{ color: C.ink }}>Book a 30-min conversation</h3>
            <p className="text-[14px] leading-relaxed mb-6" style={{ color: C.inkMuted }}>
              For CEOs, CFOs, DONs ready to see CHRIS modelled against their actual facility data. No demo. Just your operation and ours.
            </p>
            <a href="mailto:hello@culturecrunch.io?subject=CHRIS-OS%20Diagnostic" className="inline-block px-6 py-3 rounded text-[14px] font-medium transition-colors hover:opacity-90" style={{ backgroundColor: C.copper, color: C.dark }}>
              Book now →
            </a>
          </div>

          {/* Waitlist */}
          <div className="rounded-lg p-6 lg:p-8" style={{ backgroundColor: C.dark2, border: "1px solid rgba(245,237,227,0.12)" }}>
            <h3 className="text-[18px] font-medium mb-3" style={{ color: C.ink }}>Join the waitlist</h3>
            <p className="text-[14px] leading-relaxed mb-6" style={{ color: C.inkMuted }}>
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
              {[["Tools", "/care-minutes"], ["Technology", "/technology"], ["Newsroom", "/newsroom"], ["Book a conversation", "#book"]].map(([label, href]) => (
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
            <span className="text-[14px] font-medium" style={{ color: C.ink }}>CHRIS<span style={{ color: C.copper }}>·</span>OS</span>
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
      <ToolsStrip />
      <TrustStrip />
      <StatRow />
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
