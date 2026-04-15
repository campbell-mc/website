"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ChevronDown } from "lucide-react";

const WorkflowWalkthrough = dynamic(
  () => import("@/components/marketing/WorkflowWalkthrough").then((m) => ({ default: m.WorkflowWalkthrough })),
  { ssr: false }
);

interface Job {
  number: string;
  title: string;
  hook: string;
  buyer: string;
  accent: string;
  chrisDoes: string[];
  humanDoes: string[];
  stakes: string;
}

const JOBS: Job[] = [
  {
    number: "01", title: "Handle SIRS without missing a deadline",
    hook: "A Priority 1 incident. 11pm. The 24-hour clock is running.",
    buyer: "DON", accent: "#C4704A",
    chrisDoes: [
      "Classifies incident as Priority 1 or Priority 2 within minutes of ingestion",
      "Drafts the ACQSC notification with all mandatory fields populated",
      "Monitors the deadline countdown — escalates via iMessage if unactioned",
      "Submits to GPMS portal after DON approval",
    ],
    humanDoes: ["Reviews the draft", "Approves and submits"],
    stakes: "Civil penalties and compliance action for late notifications. The 24-hour clock starts from when any staff member becomes aware.",
  },
  {
    number: "02", title: "Stay on the right side of care minutes every day",
    hook: "2pm. Your RN called in sick. Nobody's run the numbers.",
    buyer: "DON", accent: "#D4A017",
    chrisDoes: [
      "Pulls rostering data from Deputy / Humanforce every 2 hours",
      "Calculates total and RN minutes per resident against 215/44 thresholds",
      "Projects end-of-shift compliance based on current roster",
      "Alerts DON when breach risk detected — before the shift ends",
    ],
    humanDoes: ["Acts on the alert — calls agency, adjusts roster"],
    stakes: "AN-ACC funding risk + regulatory exposure across every reporting period. Only 45.9% of services meeting both targets nationally.",
  },
  {
    number: "03", title: "Submit QI without the quarterly scramble",
    hook: "The GPMS window opens. Someone has to pull 14 indicator domains from three systems.",
    buyer: "Quality Lead", accent: "#2D7D73",
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
    number: "04", title: "Track corrective actions so nothing falls through",
    hook: "A corrective action was opened six weeks ago. Nobody knows who owns it.",
    buyer: "Quality Lead", accent: "#1B4332",
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
    number: "05", title: "Give every leader their Monday briefing",
    hook: "Sunday night. Someone has to pull together what's happening across the facility.",
    buyer: "DON", accent: "#2D7D73",
    chrisDoes: [
      "Synthesises care minutes, SIRS status, workforce signals, and compliance data",
      "Generates a role-specific briefing for every leader — DON, CFO, WHS Lead, Team Leaders",
      "Queues 3 specific actions with context and evidence",
      "Delivers via iMessage link before Monday morning",
    ],
    humanDoes: ["Reads the briefing", "Runs the week"],
    stakes: "3 hours per leader per week returned — 1,872 hours/year across a 12-leader facility.",
  },
  {
    number: "06", title: "Produce board and committee packs from live data",
    hook: "Three days before the board meeting. Five systems. One Sunday lost.",
    buyer: "CEO", accent: "#1B4332",
    chrisDoes: [
      "Assembles all 8 board pack sections from the canonical data layer",
      "Drafts the executive narrative, risk register, and decisions required",
      "Generates Quality & Risk, Finance, Clinical Governance, and P&C committee packs",
      "Notifies CEO when ready — average review time under 30 minutes",
    ],
    humanDoes: ["Reviews the pack", "Approves and distributes"],
    stakes: "8 hours per pack returned to leadership per month.",
  },
  {
    number: "07", title: "Know which workforce risks are real before they become incidents",
    hook: "Three staff resigned in the same wing in four weeks. Nobody connected the signals.",
    buyer: "WHS Lead", accent: "#D4A017",
    chrisDoes: [
      "Runs fortnightly pulse survey across all teams — 16 PSH domains",
      "Correlates pulse signals with rostering, incident, and HR data",
      "Confirms real hazards vs noise using convergence detection",
      "Recommends a specific micro-practice for the team leader to implement",
    ],
    humanDoes: ["Delivers the practice", "Captures the outcome"],
    stakes: "Standard 2 compliance + >$1M penalty exposure across Victorian and NSW PSH regulations.",
  },
  {
    number: "08", title: "Optimise AN-ACC funding without a consultant",
    hook: "Your revenue per bed is 8% below sector average. Nobody knows why.",
    buyer: "CFO", accent: "#C4704A",
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
    number: "09", title: "See what's coming before it hits",
    hook: "A complaint pattern built for six weeks. In hindsight, the signals were there.",
    buyer: "CEO", accent: "#1B4332",
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

function JobCard({ job, onOpenWorkflow }: { job: Job; onOpenWorkflow?: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className="w-full text-left bg-white border border-[rgba(0,0,0,0.08)] rounded-xl transition-all hover:shadow-lg group"
      style={{ borderLeftWidth: 4, borderLeftColor: job.accent }}
    >
      <div className="p-5 lg:p-6">
        <div className="flex items-start justify-between mb-3">
          <span className="text-[12px] italic" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif", color: "rgba(27,67,50,0.35)" }}>
            {job.number}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#1B4332]/8 text-[#1B4332]">
            {job.buyer}
          </span>
        </div>
        <h3 className="text-[15px] lg:text-[16px] font-semibold text-[#1B4332] mb-2 leading-snug">{job.title}</h3>
        <p className="text-[13px] text-stone-500 italic leading-relaxed">{job.hook}</p>

        <div className="flex items-center gap-1 mt-3 text-[11px] text-[#2D7D73] font-medium">
          <span>{expanded ? "Close" : "See the workflow"}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </div>
      </div>

      {/* Expanded state */}
      <div className={`overflow-hidden transition-all duration-200 ${expanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-5 lg:px-6 pb-5 lg:pb-6 pt-0 border-t border-[rgba(0,0,0,0.06)]">
          <div className="pt-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#1B4332]/50 mb-2">CHRIS handles</p>
            <div className="space-y-2 mb-4">
              {job.chrisDoes.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2D7D73] shrink-0 mt-1.5" />
                  <p className="text-[13px] text-stone-600 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>

            <p className="text-[10px] font-medium uppercase tracking-wider text-stone-400 mb-2">You approve</p>
            <div className="space-y-1.5 mb-4">
              {job.humanDoes.map((item) => (
                <p key={item} className="text-[13px] text-stone-500 italic leading-relaxed">{item}</p>
              ))}
            </div>

            <div className="bg-[#FEF7F0] rounded-lg px-3 py-2.5 mb-3">
              <p className="text-[12px] font-medium" style={{ color: job.accent }}>{job.stakes}</p>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); onOpenWorkflow?.(job.number); }}
              className="text-[13px] font-medium text-[#2D7D73] hover:underline transition-colors"
            >
              See how this works in the platform →
            </button>
          </div>
        </div>
      </div>
    </button>
  );
}

export function NineJobs() {
  const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null);

  return (
    <>
    <WorkflowWalkthrough jobId={activeWorkflow} onClose={() => setActiveWorkflow(null)} />
    <section className="bg-[#F5F2EB] border-y border-[#1B4332]/8" id="nine-jobs">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16 lg:py-24">
        <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#1B4332]/50 mb-4" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>
          The nine jobs
        </div>
        <h2 className="text-[clamp(28px,3.5vw,42px)] font-normal leading-[1.1] tracking-[-0.02em] text-[#1B4332] mb-4" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>
          We don&apos;t sell a platform.<br />
          We fix a problem.<br />
          Then another. Then another.
        </h2>
        <p className="text-[16px] leading-relaxed text-stone-500 max-w-xl mb-12">
          Pick the one that&apos;s costing you the most right now.
          CHRIS handles it end-to-end. You approve the outcome.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {JOBS.map((job) => (
            <JobCard key={job.number} job={job} onOpenWorkflow={setActiveWorkflow} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-[14px] text-stone-500 mb-6 max-w-lg mx-auto leading-relaxed">
            Every job is a complete workflow — from signal to action to evidence trail.
            We start with the one that matters most to you right now.
          </p>
          <div className="flex items-center gap-4 justify-center flex-wrap">
            <a href="#waitlist" className="bg-[#1B4332] text-white px-7 py-3.5 rounded-lg text-[14px] font-medium hover:bg-[#1B4332]/90 transition-colors">
              Tell us your biggest headache →
            </a>
            <a href="#agent-section" className="border border-[#1B4332]/25 text-[#1B4332] px-7 py-3.5 rounded-lg text-[14px] hover:border-[#1B4332]/50 transition-colors">
              See how CHRIS handles it
            </a>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
