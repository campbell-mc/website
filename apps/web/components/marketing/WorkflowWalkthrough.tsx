"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface WorkflowStep {
  title: string;
  agent: string;
  description: string;
  chrisDid: string;
  screenshot?: string;
  youDo: string;
  screenshotBg: string;
  screenshotLabel: string;
}

interface WorkflowData {
  jobNumber: string;
  jobTitle: string;
  steps: WorkflowStep[];
}

const WORKFLOWS: Record<string, WorkflowData> = {
  "01": {
    jobNumber: "01", jobTitle: "Handle SIRS without missing a deadline",
    steps: [
      { title: "Incident ingested from clinical system", agent: "The Chronicler · Event-driven", description: "An unexpected fall is recorded in the clinical system at 11:04pm. The Chronicler detects the entry within minutes and begins classification.", chrisDid: "Ingested incident data from connected clinical system, triggered SIRS classification engine.", youDo: "Nothing yet. CHRIS is working.", screenshotBg: "#1B4332", screenshotLabel: "Dashboard — incident detected", screenshot: "/screenshots/dashboard-home.png" },
      { title: "Incident classified as Priority 1", agent: "The Chronicler · Classification engine", description: "The fall meets the Priority 1 threshold. The 24-hour notification clock starts. CHRIS drafts in 4 minutes. The DON has been notified via iMessage.", chrisDid: "Applied Aged Care Act 2024 classification rules, determined Priority 1, started deadline countdown, sent iMessage alert to DON.", youDo: "Nothing yet — you will receive an iMessage with a review link.", screenshotBg: "#C4704A", screenshotLabel: "SIRS draft — Priority 1 classified", screenshot: "/screenshots/sirs-draft.png" },
      { title: "Notification drafted — fields auto-populated", agent: "The Chronicler · Draft generation", description: "CHRIS has drafted the complete ACQSC notification. Provider name, service name, incident date, type, description, and classification are all auto-populated. Two fields require clinical detail only the DON can provide.", chrisDid: "Populated all available fields from canonical facility data, identified the 2 fields requiring clinical input, formatted to ACQSC submission standard.", youDo: "Add the two remaining clinical fields (takes approximately 3 minutes).", screenshotBg: "#2D7D73", screenshotLabel: "SIRS notification — 10/12 fields complete", screenshot: "/screenshots/sirs-draft.png" },
      { title: "Draft in your Review Queue — one button to submit", agent: "Review Queue · DON approval", description: "The completed draft appears in your Review Queue as IMMEDIATE priority with the deadline countdown visible. You review, add the two clinical fields, and tap Approve + Submit.", chrisDid: "Added draft to DON Review Queue with IMMEDIATE priority flag, prepared GPMS API submission ready to fire on approval.", youDo: "Review draft, add 2 clinical fields, click Approve + Submit.", screenshotBg: "#1B4332", screenshotLabel: "Review Queue — IMMEDIATE priority", screenshot: "/screenshots/review-queue.png" },
      { title: "Submitted. Reference logged. Evidence trail complete.", agent: "The Chronicler · Evidence chain", description: "CHRIS submits to ACQSC, receives the confirmation reference number, logs it in the SIRS register, creates a corrective action if required, and adds the incident to the next governance pack.", chrisDid: "Submitted to GPMS portal, logged confirmation reference, triggered corrective action workflow, queued for Q&R Committee pack.", youDo: "Nothing. It is done. Deadline met.", screenshotBg: "#2D7D73", screenshotLabel: "SIRS register — submitted and logged", screenshot: "/screenshots/sirs-draft.png" },
    ],
  },
  "02": {
    jobNumber: "02", jobTitle: "Stay on the right side of care minutes every shift",
    steps: [
      { title: "Rostering data pulled — shift gap identified", agent: "The Sentinel · 2-hr cycle", description: "CHRIS pulls data from Deputy every 2 hours. The Sentinel detects that tonight's afternoon RN shift has an unfilled position. At current trajectory, the RN-specific 44min/resident threshold is at risk.", chrisDid: "Pulled Deputy roster data, calculated care minutes by shift and role, projected end-of-day compliance.", youDo: "Nothing yet — alert is incoming.", screenshotBg: "#2D7D73", screenshotLabel: "Care minutes — shift projection", screenshot: "/screenshots/care-minutes.png" },
      { title: "Alert in Review Queue — 5 hours before breach", agent: "The Sentinel · iMessage alert", description: "The care minutes gap appears in the Review Queue as URGENT with 5 hours of lead time. CHRIS has already assessed the options: post to internal pool, contact agency, or accept the risk.", chrisDid: "Added to DON Review Queue as URGENT, assessed available coverage options, prepared iMessage notification.", youDo: "Choose response — internal pool, agency, or accept risk.", screenshotBg: "#D4A017", screenshotLabel: "Review Queue — URGENT care minutes gap", screenshot: "/screenshots/review-queue.png" },
      { title: "One button to act", agent: "The Sentinel · Action execution", description: "The DON selects 'Find agency RN for tonight'. CHRIS prepares the agency request with shift details, facility requirements, and preferred providers.", chrisDid: "Prepared agency request, identified preferred providers from facility panel, staged the outreach.", youDo: "Review and confirm the agency request.", screenshotBg: "#1B4332", screenshotLabel: "Agency request — staged and ready", screenshot: "/screenshots/review-queue.png" },
      { title: "Shift covered. Care minutes compliant.", agent: "The Sentinel · Compliance confirmed", description: "The RN shift is covered. CHRIS updates the compliance status, logs the agency usage, adds the cost to the agency spend tracker, and includes the event in the weekly operational briefing.", chrisDid: "Updated compliance status, logged agency usage and cost, added to weekly briefing data.", youDo: "Nothing. Move on with your day.", screenshotBg: "#2D7D73", screenshotLabel: "Care minutes — COMPLIANT", screenshot: "/screenshots/care-minutes.png" },
    ],
  },
  "03": {
    jobNumber: "03", jobTitle: "Submit QI without the quarterly scramble",
    steps: [
      { title: "QI data aggregated from connected systems", agent: "The Chronicler · Data aggregation", description: "CHRIS pulls all 14 quality indicator domains from connected clinical and workforce systems. Data is normalised, validated, and cross-referenced against prior submissions.", chrisDid: "Aggregated 14 QI domains, validated data quality, flagged anomalies.", youDo: "Nothing yet — CHRIS is compiling.", screenshotBg: "#2D7D73", screenshotLabel: "Quality Indicators — 14 domains compiled", screenshot: "/screenshots/dashboard-home.png" },
      { title: "Anomalies flagged before submission", agent: "The Chronicler · Quality check", description: "CHRIS identifies two data points that look anomalous compared to prior quarters. Falls rate is up but medication management has an unusual dip. Both are flagged for Quality Lead review.", chrisDid: "Compared to prior 4 quarters, identified statistical outliers, prepared flagged items list.", youDo: "Review the 2 flagged items and confirm or correct.", screenshotBg: "#D4A017", screenshotLabel: "QI review — 2 items flagged", screenshot: "/screenshots/dashboard-home.png" },
      { title: "GPMS-ready package prepared", agent: "The Chronicler · Submission preparation", description: "All 14 indicators are formatted to the GPMS schema. The submission package is complete and ready for one-click submission after Quality Lead approval.", chrisDid: "Formatted all data to GPMS submission standard, prepared the complete package.", youDo: "Review and approve the submission.", screenshotBg: "#1B4332", screenshotLabel: "QI submission — ready for approval", screenshot: "/screenshots/review-queue.png" },
      { title: "Submitted. Star rating data updated.", agent: "The Chronicler · Evidence chain", description: "CHRIS submits to ACQSC via GPMS, logs the confirmation reference, and updates the internal QI tracking dashboard. The data feeds directly into the star rating calculation.", chrisDid: "Submitted to GPMS, logged reference, updated QI dashboard and star rating tracker.", youDo: "Nothing. Submission complete.", screenshotBg: "#2D7D73", screenshotLabel: "QI register — submitted", screenshot: "/screenshots/dashboard-home.png" },
    ],
  },
  "04": {
    jobNumber: "04", jobTitle: "Track corrective actions so nothing falls through",
    steps: [
      { title: "Corrective action created automatically", agent: "The Chronicler · Event-driven", description: "An audit non-conformance, SIRS incident, or ACQSC finding triggers automatic creation of a corrective action. Owner assigned, deadline set, evidence requirements defined.", chrisDid: "Created corrective action with owner, deadline, and evidence requirements from the triggering event.", youDo: "Nothing yet — action created and assigned.", screenshotBg: "#1B4332", screenshotLabel: "Corrective action — created", screenshot: "/screenshots/review-queue.png" },
      { title: "Status tracked continuously", agent: "The Sentinel · Monitoring", description: "CHRIS monitors every open corrective action. As the deadline approaches, the responsible person receives escalating reminders. The compliance register updates in real time.", chrisDid: "Tracked status, sent reminders at 7-day and 3-day marks, updated compliance register.", youDo: "Execute the corrective action.", screenshotBg: "#D4A017", screenshotLabel: "Corrective actions — 2 overdue", screenshot: "/screenshots/review-queue.png" },
      { title: "Evidence register populated automatically", agent: "The Chronicler · Evidence chain", description: "When the action is marked complete, CHRIS populates the evidence register with the completion date, responsible person, and linked documentation.", chrisDid: "Logged completion, populated evidence register, linked to original finding.", youDo: "Confirm completion.", screenshotBg: "#2D7D73", screenshotLabel: "Evidence register — complete", screenshot: "/screenshots/dashboard-home.png" },
    ],
  },
  "05": {
    jobNumber: "05", jobTitle: "Give every leader their Monday briefing",
    steps: [
      { title: "Sunday 9pm — CHRIS starts building your briefing", agent: "Sentinel + Oracle + Keeper · Synthesis", description: "While you are offline, CHRIS runs the weekly synthesis cycle. The Sentinel checks care minutes and clinical compliance. The Oracle reviews the financial position. The Keeper assesses workforce signals. The Town Crier merges findings.", chrisDid: "Ran cross-agent synthesis cycle, identified converged signals, ranked this week's priorities, drafted narrative briefing.", youDo: "Nothing. You are offline.", screenshotBg: "#1B4332", screenshotLabel: "Agent synthesis — Sunday night", screenshot: "/screenshots/dashboard-home.png" },
      { title: "Monday 6am — briefing in your inbox", agent: "Town Crier · Briefing delivery", description: "Before you walk in, your briefing is ready. Care minutes status. SIRS position. The 3 things that need your attention this week — with context, evidence, and a suggested action for each.", chrisDid: "Generated role-specific briefing, delivered via iMessage link, populated Review Queue with priority actions.", youDo: "Read the briefing. Know exactly what you are walking into.", screenshotBg: "#2D7D73", screenshotLabel: "Good morning, Sarah — Monday Briefing", screenshot: "/screenshots/dashboard-home.png" },
      { title: "Every team leader gets their briefing too", agent: "The Keeper · Team briefings", description: "Simultaneously, every team leader receives their own fortnightly briefing — their team's specific pulse results, the CHRIS insight, and the one micro-practice recommended for their team.", chrisDid: "Generated individual team briefings, selected micro-practice matched to each team's active PSH signals.", youDo: "Review any briefings that need your input.", screenshotBg: "#D4A017", screenshotLabel: "Team briefings — distributed", screenshot: "/screenshots/workforce.png" },
      { title: "Three specific actions. One review queue.", agent: "Review Queue · Action execution", description: "The 3 priority actions from your briefing are waiting in the Review Queue — each with the draft document, context, and a single button to act. Everything drafted. Everything prioritised. Just decisions required.", chrisDid: "Populated Review Queue with priority actions, drafted supporting documents, sequenced by urgency.", youDo: "Work through the queue. Decisions only — no preparation required.", screenshotBg: "#1B4332", screenshotLabel: "Review Queue — Monday priorities", screenshot: "/screenshots/review-queue.png" },
    ],
  },
  "06": {
    jobNumber: "06", jobTitle: "Produce board and committee packs from live data",
    steps: [
      { title: "5 days before the meeting — CHRIS starts building", agent: "The Chronicler · Pack generation", description: "The board meeting is scheduled. CHRIS automatically begins the pack generation cycle. The Chronicler pulls data from every domain into the canonical layer and begins drafting.", chrisDid: "Triggered pack generation cycle, pulled live data from all connected systems, began section-by-section draft.", youDo: "Nothing yet — review notification incoming in 2 days.", screenshotBg: "#1B4332", screenshotLabel: "Board Pack — generation started", screenshot: "/screenshots/board-pack.png" },
      { title: "All 8 sections drafted from live data", agent: "The Chronicler · Section drafting", description: "Executive summary. Quality & Safety. Clinical governance. Workforce. Financial performance. Regulatory compliance. Risk register. Decisions required. All drafted from live data, not templates.", chrisDid: "Drafted all 8 sections, identified 3 decisions requiring board resolution.", youDo: "Nothing yet — notification when ready.", screenshotBg: "#2D7D73", screenshotLabel: "Board Pack — 8 sections drafted", screenshot: "/screenshots/board-pack.png" },
      { title: "In your queue. Estimated review: 35 minutes.", agent: "Review Queue · CEO approval", description: "The completed pack appears in the CEO's Review Queue. CHRIS has flagged the 3 sections requiring CEO attention and the 3 board decisions needing framing.", chrisDid: "Added to CEO Review Queue, flagged sections requiring input, prepared distribution list.", youDo: "Review 3 flagged sections, add framing on decisions, approve.", screenshotBg: "#D4A017", screenshotLabel: "Review Queue — Board Pack ready", screenshot: "/screenshots/review-queue.png" },
      { title: "Distributed to the board. Evidence trail complete.", agent: "Governance · Distribution", description: "CHRIS distributes the approved pack to the board member list, logs distribution time, and adds the pack to the governance evidence register.", chrisDid: "Distributed to board, logged in governance register, updated board chair briefing.", youDo: "Present at the meeting. Everything else is done.", screenshotBg: "#1B4332", screenshotLabel: "Governance register — distributed", screenshot: "/screenshots/dashboard-home.png" },
    ],
  },
  "07": {
    jobNumber: "07", jobTitle: "Know which workforce risks are real before they become incidents",
    steps: [
      { title: "Fortnightly pulse deployed to all teams", agent: "The Keeper · Pulse cycle", description: "Every two weeks, CHRIS deploys a brief pulse survey to all teams. 16 psychosocial hazard domains measured. Participation tracked. Results available within 24 hours of cycle close.", chrisDid: "Deployed pulse, tracked participation, collected and scored responses across 16 PSH domains.", youDo: "Nothing — the pulse runs automatically.", screenshotBg: "#D4A017", screenshotLabel: "PSH pulse — cycle 9 complete", screenshot: "/screenshots/psh-dashboard.png" },
      { title: "Convergence detected — real hazard confirmed", agent: "The Keeper · Convergence detection", description: "The Keeper correlates pulse signals with rostering data, incident reports, and HR records. PSH_01 and PSH_08 are co-elevated in Grevillea Wing for the 6th consecutive cycle. This is a confirmed convergence, not noise.", chrisDid: "Cross-referenced pulse data with operational signals, confirmed convergence pattern, calculated risk probability.", youDo: "Review the convergence finding.", screenshotBg: "#C4704A", screenshotLabel: "PSH convergence — Grevillea Wing CRITICAL", screenshot: "/screenshots/psh-dashboard.png" },
      { title: "Micro-practice prescribed for the team", agent: "The Keeper · Practice selection", description: "Based on the specific hazard profile, CHRIS selects a targeted micro-practice from the evidence-based library. The team leader receives the practice in their team briefing with delivery guidance.", chrisDid: "Matched hazard profile to practice library, selected highest-evidence practice, prepared team leader briefing.", youDo: "Deliver the practice with your team this cycle.", screenshotBg: "#2D7D73", screenshotLabel: "Team briefing — practice prescribed", screenshot: "/screenshots/workforce.png" },
      { title: "ISO 45003 evidence generated automatically", agent: "The Keeper · Evidence generation", description: "The pulse data, convergence detection, practice prescription, and outcome measurement all generate ISO 45003 compliance evidence automatically. Identification, assessment, controls, and review — documented.", chrisDid: "Generated ISO 45003 evidence across all 4 required elements, populated evidence register.", youDo: "Nothing. Your PSH compliance evidence is building every cycle.", screenshotBg: "#1B4332", screenshotLabel: "ISO 45003 — evidence current", screenshot: "/screenshots/psh-dashboard.png" },
    ],
  },
  "08": {
    jobNumber: "08", jobTitle: "Optimise AN-ACC funding without a consultant",
    steps: [
      { title: "Classifications monitored continuously", agent: "The Oracle · Weekly scan", description: "Every Sunday night, the Oracle scans all resident classifications against their documented care complexity. Clinical data suggests 3 residents may be under-classified based on increased care needs.", chrisDid: "Scanned all classifications, compared to clinical indicators, identified 3 reclassification opportunities.", youDo: "Nothing yet — opportunities surfaced in your briefing.", screenshotBg: "#1B4332", screenshotLabel: "Oracle scan — 3 opportunities identified", screenshot: "/screenshots/dashboard-home.png" },
      { title: "Revenue uplift quantified", agent: "The Oracle · Revenue analysis", description: "The Oracle calculates the estimated monthly funding uplift for each reclassification opportunity. Combined estimate: $11,400 per month. Benchmarks against StewartBrown sector data show the facility is 8% below average revenue per bed.", chrisDid: "Calculated per-resident uplift, benchmarked against sector data, prepared opportunity brief.", youDo: "Review the opportunities in your briefing.", screenshotBg: "#D4A017", screenshotLabel: "AN-ACC opportunities — $11.4K/month", screenshot: "/screenshots/dashboard-home.png" },
      { title: "Clinical reviews scheduled", agent: "The Steward · Capacity check", description: "The Steward confirms Tuesday morning has clinical capacity for the 3 assessments. CHRIS coordinates with the Oracle's finding to recommend the optimal scheduling window.", chrisDid: "Checked roster capacity, identified optimal assessment window, prepared scheduling recommendation.", youDo: "Schedule the clinical reviews for Tuesday.", screenshotBg: "#2D7D73", screenshotLabel: "Roster — Tuesday capacity confirmed", screenshot: "/screenshots/workforce.png" },
      { title: "Reclassification tracked to completion", agent: "The Oracle · Tracking", description: "CHRIS tracks each reclassification from initiation through assessment to outcome. The revenue impact is measured against the forecast and reported in the next financial briefing.", chrisDid: "Tracked reclassification progress, measured revenue impact against forecast, added to CFO briefing.", youDo: "Nothing. Revenue improvement tracked automatically.", screenshotBg: "#1B4332", screenshotLabel: "Revenue tracker — uplift confirmed", screenshot: "/screenshots/dashboard-home.png" },
    ],
  },
  "09": {
    jobNumber: "09", jobTitle: "See what's coming before it hits",
    steps: [
      { title: "Cross-domain pattern detected", agent: "The Town Crier · Signal coordination", description: "The Town Crier identifies a converging pattern: falls rate up in Wing B, agency coverage up in the same wing, PSH_08 elevated in the same team. Three separate agent findings that tell one story when connected.", chrisDid: "Correlated findings across Sentinel, Steward, and Keeper. Identified cross-domain pattern. Assessed historical precedent.", youDo: "Nothing yet — intelligence being assembled.", screenshotBg: "#1B4332", screenshotLabel: "Cross-domain intelligence — pattern detected", screenshot: "/screenshots/dashboard-home.png" },
      { title: "Precursor signature matched", agent: "The Town Crier · Pattern matching", description: "The pattern matches a historical precursor signature: when falls, agency, and PSH co-elevate in the same wing for 3+ cycles, a serious incident follows within 4-6 weeks in 68% of comparable facilities.", chrisDid: "Matched against historical patterns, calculated probability, prepared intelligence brief.", youDo: "Review the intelligence brief.", screenshotBg: "#C4704A", screenshotLabel: "Precursor detected — 68% probability", screenshot: "/screenshots/psh-dashboard.png" },
      { title: "Leadership queue updated with actionable intelligence", agent: "The Town Crier · Priority ranking", description: "The finding is added to the leadership queue as a single coordinated recommendation — not three separate alerts. Root cause identified. Intervention recommended. Timeline specified.", chrisDid: "Merged 3 agent findings into 1 coordinated recommendation, identified root cause, recommended intervention.", youDo: "Review the recommendation. Decide how to act.", screenshotBg: "#2D7D73", screenshotLabel: "Review Queue — coordinated recommendation", screenshot: "/screenshots/review-queue.png" },
      { title: "Weekly Oracle report with full context", agent: "The Oracle · Weekly synthesis", description: "The pattern and the intervention are documented in the weekly Oracle report with full cross-domain context. The board receives the intelligence in the next governance pack automatically.", chrisDid: "Added to Oracle report, prepared governance pack entry, updated risk register.", youDo: "Act on the recommendation. The evidence trail builds itself.", screenshotBg: "#1B4332", screenshotLabel: "Oracle report — intelligence documented", screenshot: "/screenshots/dashboard-home.png" },
    ],
  },
};

interface Props {
  jobId: string | null;
  onClose: () => void;
}

export function WorkflowWalkthrough({ jobId, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [zoomedImg, setZoomedImg] = useState<string | null>(null);

  const workflow = jobId ? WORKFLOWS[jobId] : null;
  const totalSteps = workflow ? workflow.steps.length + 1 : 0; // +1 for final CTA step

  const next = useCallback(() => setStep((s) => Math.min(s + 1, totalSteps - 1)), [totalSteps]);
  const prev = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);

  useEffect(() => { setStep(0); }, [jobId]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") onClose();
    }
    if (jobId) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [jobId, next, prev, onClose]);

  if (!workflow || !jobId) return null;

  const currentStep = step < workflow.steps.length ? workflow.steps[step] : null;
  const isFinalStep = step === totalSteps - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90" />

      {/* Container */}
      <div
        className="relative w-[calc(100%-40px)] max-w-[960px] max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{ backgroundColor: "#1B4332", boxShadow: "0 40px 120px rgba(0,0,0,0.5)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image zoom overlay */}
        {zoomedImg && (
          <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-4 cursor-pointer" onClick={() => setZoomedImg(null)}>
            <button className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10" style={{ color: "rgba(255,255,255,0.6)" }}><X className="w-6 h-6" /></button>
            <Image src={zoomedImg} alt="Screenshot enlarged" width={1400} height={1050} className="max-w-full max-h-[90vh] object-contain rounded-xl" onClick={(e) => e.stopPropagation()} />
          </div>
        )}

        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-lg hover:bg-white/10 transition-colors" style={{ color: "rgba(250,247,242,0.5)" }}>
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 lg:p-10">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[12px] font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(212,160,23,0.2)", color: "#D4A017" }}>
                Job {workflow.jobNumber}
              </span>
              <span className="text-[12px]" style={{ color: "rgba(250,247,242,0.4)" }}>
                Step {step + 1} of {totalSteps}
              </span>
            </div>
            <h2 className="text-[clamp(1.2rem,2.5vw,1.6rem)] font-normal" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif", color: "#faf7f2" }}>
              {workflow.jobTitle}
            </h2>
          </div>

          {/* Step content */}
          {currentStep && !isFinalStep ? (
            <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8">
              {/* Screenshot — click to zoom */}
              <div className="rounded-xl overflow-hidden relative cursor-pointer" style={{ backgroundColor: currentStep.screenshot ? "transparent" : currentStep.screenshotBg }} onClick={() => currentStep.screenshot && setZoomedImg(currentStep.screenshot)}>
                {currentStep.screenshot ? (
                  <div className="relative">
                    <Image src={currentStep.screenshot} alt={currentStep.screenshotLabel} width={800} height={600} className="w-full h-auto rounded-xl" />
                    <div className="absolute top-3 left-3">
                      <div className="text-[10px] font-medium uppercase tracking-wider px-2 py-1 rounded bg-black/50 backdrop-blur-sm w-fit" style={{ color: "rgba(250,247,242,0.9)" }}>
                        {currentStep.agent}
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <div className="text-[10px] px-2 py-1 rounded bg-black/40 backdrop-blur-sm" style={{ color: "rgba(250,247,242,0.7)" }}>Click to enlarge</div>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[4/3] flex flex-col justify-between p-6">
                    <div className="text-[10px] font-medium uppercase tracking-wider px-2 py-1 rounded bg-white/10 w-fit" style={{ color: "rgba(250,247,242,0.7)" }}>
                      {currentStep.agent}
                    </div>
                    <div className="text-[11px]" style={{ color: "rgba(250,247,242,0.5)" }}>{currentStep.screenshotLabel}</div>
                  </div>
                )}
              </div>

              {/* Narrative */}
              <div>
                <div className="text-[clamp(2rem,4vw,3rem)] font-normal mb-1" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif", color: "#D4A017" }}>
                  {String(step + 1).padStart(2, "0")}
                </div>
                <h3 className="text-[18px] font-semibold mb-3" style={{ color: "#faf7f2" }}>{currentStep.title}</h3>
                <p className="text-[15px] leading-[1.65] mb-6" style={{ color: "rgba(250,247,242,0.65)" }}>{currentStep.description}</p>

                <div className="mb-4">
                  <div className="text-[10px] font-medium uppercase tracking-wider mb-1.5" style={{ color: "#2D7D73" }}>CHRIS did</div>
                  <p className="text-[13px] leading-relaxed" style={{ color: "rgba(250,247,242,0.55)" }}>{currentStep.chrisDid}</p>
                </div>
                <div>
                  <div className="text-[10px] font-medium uppercase tracking-wider mb-1.5" style={{ color: "rgba(250,247,242,0.35)" }}>You do</div>
                  <p className="text-[13px] italic leading-relaxed" style={{ color: "rgba(250,247,242,0.45)" }}>{currentStep.youDo}</p>
                </div>
              </div>
            </div>
          ) : (
            /* Final CTA step */
            <div className="text-center py-8 lg:py-16">
              <h3 className="text-[clamp(1.4rem,3vw,2.2rem)] font-normal mb-4" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif", color: "#faf7f2" }}>
                Ready to eliminate this<br />from your weekly workload?
              </h3>
              <p className="text-[15px] max-w-md mx-auto mb-8" style={{ color: "rgba(250,247,242,0.55)" }}>
                Join the waitlist and we will show you exactly how CHRIS would handle this at your specific facility.
              </p>
              <div className="flex items-center gap-4 justify-center flex-wrap">
                <a href="#waitlist" onClick={onClose} className="px-8 py-3.5 rounded-xl text-[14px] font-medium text-white transition-colors hover:opacity-90" style={{ backgroundColor: "#C4704A" }}>
                  Join the waitlist →
                </a>
                <button onClick={onClose} className="text-[13px] transition-colors hover:underline" style={{ color: "rgba(250,247,242,0.5)" }}>
                  See another workflow
                </button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: "1px solid rgba(250,247,242,0.08)" }}>
            <button onClick={prev} disabled={step === 0}
              className="flex items-center gap-1.5 text-[13px] px-4 py-2 rounded-lg transition-colors disabled:opacity-20"
              style={{ color: "rgba(250,247,242,0.6)", border: "1px solid rgba(250,247,242,0.12)" }}>
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <button key={i} onClick={() => setStep(i)}
                  className="w-2 h-2 rounded-full transition-colors"
                  style={{ backgroundColor: i === step ? "#2D7D73" : i < step ? "rgba(250,247,242,0.5)" : "rgba(250,247,242,0.15)" }} />
              ))}
            </div>

            <button onClick={next} disabled={isFinalStep}
              className="flex items-center gap-1.5 text-[13px] px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-20"
              style={{ backgroundColor: "#C4704A", color: "#ffffff" }}>
              {step === totalSteps - 2 ? "Get started →" : "Next →"} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
