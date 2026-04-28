"use client";

import { useState } from "react";
import Link from "next/link";

const C = {
  canvas: "#FAFAF6", card: "#FFFFFF", text: "#0E0E0E", textMuted: "#5A5A57",
  textFaint: "#8A8A85", teal: "#1F6F66", amber: "#BA7517", red: "#A32D2D",
  border: "rgba(15,23,42,0.10)", borderSubtle: "rgba(15,23,42,0.07)",
  ctaBg: "#0E0E0E", ctaText: "#FAFAF6",
};

const inter = "'Inter', system-ui, -apple-system, sans-serif";
const fraunces = "'Fraunces', Georgia, serif";

const WORKFLOWS = [
  {
    n: "01", role: "DON", title: "Handle SIRS without missing a deadline",
    hook: "A Priority 1 incident. 11pm. The 24-hour clock is running.",
    chrisDoes: [
      "Classifies incident as Priority 1 or Priority 2 within minutes of ingestion",
      "Drafts the ACQSC notification with all mandatory fields populated",
      "Monitors the deadline countdown. Escalates via iMessage if unactioned",
      "Submits to GPMS portal after DON approval",
    ],
    humanDoes: ["Reviews the draft", "Approves and submits"],
    stakes: "Civil penalties and compliance action for late notifications. The 24-hour clock starts from when any staff member becomes aware.",
    accent: C.red,
  },
  {
    n: "02", role: "DON", title: "Stay on the right side of care minutes every day",
    hook: "2pm. Your RN called in sick. Nobody has run the numbers.",
    chrisDoes: [
      "Pulls rostering data from Deputy / Humanforce every 2 hours",
      "Calculates total and RN minutes per resident against 215/44 thresholds",
      "Projects end-of-shift compliance based on current roster",
      "Alerts DON when breach risk detected, before the shift ends",
    ],
    humanDoes: ["Acts on the alert: calls agency, adjusts roster"],
    stakes: "AN-ACC funding risk and regulatory exposure across every reporting period. Only 45.9% of services meeting both targets nationally.",
    accent: C.amber,
  },
  {
    n: "03", role: "Quality Lead", title: "Submit QI without the quarterly scramble",
    hook: "The GPMS window opens. Someone has to pull 14 indicator domains from three systems.",
    chrisDoes: [
      "Aggregates all 14 QI domains from connected clinical systems",
      "Flags data quality anomalies before submission",
      "Prepares the GPMS-ready submission package",
      "Notifies Quality Lead when ready for review",
    ],
    humanDoes: ["Reviews the submission", "Confirms and submits to ACQSC"],
    stakes: "Regulatory standing, star rating, accreditation readiness.",
    accent: C.teal,
  },
  {
    n: "04", role: "Quality Lead", title: "Track corrective actions so nothing falls through",
    hook: "A corrective action was opened six weeks ago. Nobody knows who owns it.",
    chrisDoes: [
      "Creates corrective actions from incidents, audits, or ACQSC findings",
      "Assigns owner, sets deadline, tracks status continuously",
      "Escalates overdue actions via iMessage to responsible leader",
      "Populates the evidence register automatically as actions close",
    ],
    humanDoes: ["Executes the corrective action", "Confirms completion"],
    stakes: "Audit readiness, accreditation, regulatory standing.",
    accent: C.text,
  },
  {
    n: "05", role: "DON", title: "Give every leader their Monday briefing",
    hook: "Sunday night. Someone has to pull together what is happening across the facility.",
    chrisDoes: [
      "Synthesises care minutes, SIRS status, workforce signals, and compliance data",
      "Generates a role-specific briefing for every leader (DON, CFO, WHS Lead, Team Leaders)",
      "Queues 3 specific actions with context and evidence",
      "Delivers via iMessage link before Monday morning",
    ],
    humanDoes: ["Reads the briefing", "Runs the week"],
    stakes: "3 hours per leader per week returned. 1,872 hours/year across a 12-leader facility.",
    accent: C.teal,
  },
  {
    n: "06", role: "CEO", title: "Produce board and committee packs from live data",
    hook: "Three days before the board meeting. Five systems. One Sunday lost.",
    chrisDoes: [
      "Assembles all 8 board pack sections from the canonical data layer",
      "Drafts the executive narrative, risk register, and decisions required",
      "Generates Quality and Risk, Finance, Clinical Governance, and P&C committee packs",
      "Notifies CEO when ready. Average review time under 30 minutes",
    ],
    humanDoes: ["Reviews the pack", "Approves and distributes"],
    stakes: "8 hours per pack returned to leadership per month.",
    accent: C.text,
  },
  {
    n: "07", role: "WHS Lead", title: "Know which workforce risks are real before they become incidents",
    hook: "Three staff resigned in the same wing in four weeks. Nobody connected the signals.",
    chrisDoes: [
      "Runs fortnightly pulse survey across all teams, 16 PSH domains",
      "Correlates pulse signals with rostering, incident, and HR data",
      "Confirms real hazards vs noise using convergence detection",
      "Recommends a specific micro-practice for the team leader to implement",
    ],
    humanDoes: ["Delivers the practice", "Captures the outcome"],
    stakes: "Standard 2 compliance and penalty exposure across Victorian and NSW PSH regulations.",
    accent: C.amber,
  },
  {
    n: "08", role: "CFO", title: "Optimise AN-ACC funding without a consultant",
    hook: "Your revenue per bed is 8% below sector average. Nobody knows why.",
    chrisDoes: [
      "Monitors resident classifications continuously against AN-ACC funding rules",
      "Identifies reclassification opportunities before the quarter closes",
      "Benchmarks your funding performance against StewartBrown sector data",
      "Surfaces revenue uplift alerts with specific detail",
    ],
    humanDoes: ["Reviews opportunities", "Initiates reclassification with clinical team"],
    stakes: "$14K+ annual revenue uplift per facility at current pilot scale.",
    accent: C.teal,
  },
  {
    n: "09", role: "CEO", title: "See what is coming before it hits",
    hook: "A complaint pattern built for six weeks. In hindsight, the signals were there.",
    chrisDoes: [
      "Monitors patterns across clinical, workforce, financial, and compliance data simultaneously",
      "Detects precursor signatures that match historical incident patterns",
      "Alerts leadership queue before the pattern becomes a crisis",
      "Synthesises cross-domain intelligence into a single weekly report",
    ],
    humanDoes: ["Reviews the intelligence", "Decides how to act"],
    stakes: "Reputation, regulatory standing, resident safety, board confidence.",
    accent: C.red,
  },
];

export default function WorkflowsPage() {
  const [open, setOpen] = useState<Set<string>>(new Set());

  return (
    <div style={{ fontFamily: inter, backgroundColor: C.canvas }}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:opsz,wght@9..144,400&display=swap" />

      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-sm" style={{ backgroundColor: "rgba(250,250,246,0.92)", borderBottom: `0.5px solid ${C.borderSubtle}` }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 lg:px-16 py-3">
          <Link href="/v2" className="text-[15px] font-medium tracking-tight" style={{ color: C.text }}>Chris<span style={{ color: C.teal }}>·</span>OS</Link>
          <a href="/v2#book" className="text-[14px] font-medium px-[20px] py-[12px] rounded-[4px]" style={{ backgroundColor: C.ctaBg, color: C.ctaText }}>Book a conversation</a>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 lg:px-16 pt-14 lg:pt-20 pb-10">
        <div className="max-w-[600px]">
          <p className="text-[17px] mb-3" style={{ fontFamily: fraunces, fontStyle: "italic", letterSpacing: "-0.01em", color: C.teal }}>Workflows</p>
          <h1 className="text-[clamp(1.8rem,4vw,34px)] font-medium leading-[1.08] tracking-[-0.025em] mb-4" style={{ color: C.text }}>
            Nine workflows live today.
          </h1>
          <p className="text-[15px] leading-[1.6]" style={{ color: C.textMuted }}>
            From SIRS handling to board pack generation. Each workflow shows what Chris does, what your team does, and what is at stake. Click any card to see the detail.
          </p>
        </div>
      </div>

      {/* Workflow cards */}
      <div className="max-w-6xl mx-auto px-6 lg:px-16 pb-14 lg:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {WORKFLOWS.map((wf) => {
            const isOpen = open.has(wf.n);
            return (
              <button key={wf.n}
                onClick={() => setOpen((prev) => { const next = new Set(prev); if (next.has(wf.n)) next.delete(wf.n); else next.add(wf.n); return next; })}
                className="text-left rounded-[8px] overflow-hidden transition-all duration-300"
                style={{ backgroundColor: C.card, border: `0.5px solid ${isOpen ? wf.accent : C.border}`, borderLeftWidth: isOpen ? 3 : 0.5, borderLeftColor: isOpen ? wf.accent : C.border }}>
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium tabular-nums" style={{ color: C.textFaint }}>{wf.n}</span>
                      <span className="text-[10px] font-medium uppercase tracking-[0.06em] px-2 py-0.5 rounded" style={{ backgroundColor: `${wf.accent}10`, color: wf.accent }}>{wf.role}</span>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                      <path d="M7 2v10M2 7h10" stroke={C.textFaint} strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>

                  <h3 className="text-[15px] font-medium leading-snug mb-1" style={{ color: C.text }}>{wf.title}</h3>
                  <p className="text-[13px]" style={{ color: C.textFaint }}>{wf.hook}</p>

                  {/* Expanded detail */}
                  <div className={`overflow-hidden transition-all duration-500 ${isOpen ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.08em] mb-2" style={{ color: C.teal }}>Chris does</p>
                        <ul className="space-y-1.5">
                          {wf.chrisDoes.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-[13px] leading-[1.5]" style={{ color: C.textMuted }}>
                              <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-medium shrink-0 mt-0.5" style={{ backgroundColor: `${C.teal}10`, color: C.teal }}>{i + 1}</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.08em] mb-2" style={{ color: C.teal }}>You do</p>
                        <ul className="space-y-1">
                          {wf.humanDoes.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-[13px] leading-[1.5]" style={{ color: C.textMuted }}>
                              <span className="shrink-0 mt-0.5" style={{ color: C.teal }}>✓</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-3" style={{ borderTop: `0.5px solid ${C.border}` }}>
                        <p className="text-[10px] font-medium uppercase tracking-[0.08em] mb-1" style={{ color: C.textFaint }}>What is at stake</p>
                        <p className="text-[13px] leading-[1.5]" style={{ color: C.textMuted }}>{wf.stakes}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex items-center gap-5">
          <a href="/v2#book" className="text-[14px] font-medium px-[20px] py-[12px] rounded-[4px]" style={{ backgroundColor: C.ctaBg, color: C.ctaText }}>Book 30 minutes with Campbell</a>
          <Link href="/v2" className="text-[14px] font-medium" style={{ color: C.text }}>Back to home →</Link>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: C.canvas, borderTop: `0.5px solid ${C.border}` }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-16 py-8 flex items-center justify-between">
          <Link href="/v2" className="text-[13px]" style={{ color: C.textFaint }}>Chris<span style={{ color: C.teal }}>·</span>OS</Link>
          <p className="text-[11px]" style={{ color: C.textFaint }}>© 2026 Culture Crunch Pty Ltd</p>
        </div>
      </footer>
    </div>
  );
}
