"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Mic, ChevronRight } from "lucide-react";
import { MobileStatGrid } from "./MobileStatGrid";
import { MobileAgentPulse } from "./MobileAgentPulse";
import MobileActionCard from "./MobileActionCard";

type Domain = "clinical" | "governance" | "workforce" | "financial" | "residents" | "operations";

interface DomainConfig {
  title: string;
  subtitle: string;
  stats: Array<{ value: string; label: string; suffix?: string; urgency?: "immediate" | "urgent" | "routine" | "none" }>;
  agents: string[];
  chrisNarrative: string;
  actions: Array<{
    severity: "immediate" | "urgent" | "routine";
    title: string;
    description: string;
    penaltyRisk?: string;
    countdown?: string;
    actionLabel: string;
    route: string;
  }>;
  subNav: Array<{ label: string; route: string }>;
}

const DOMAIN_CONFIG: Record<Domain, DomainConfig> = {
  clinical: {
    title: "Clinical",
    subtitle: "Care quality, minutes & clinical governance",
    stats: [
      { value: "216", label: "Care mins", suffix: "/215", urgency: "none" },
      { value: "0", label: "Open SIRS", urgency: "none" },
      { value: "98%", label: "RN coverage", urgency: "none" },
      { value: "4", label: "Overdue audits", urgency: "urgent" },
    ],
    agents: ["Sentinel", "Chronicler", "Town Crier"],
    chrisNarrative:
      "Care minutes are compliant at 216 against the 215 target. RN coverage is confirmed for tonight with no gaps. The falls prevention audit in Wing B is 4 days overdue and needs immediate attention. SIRS register is clear with zero open Priority 1 or Priority 2 incidents. The Q2 Quality Indicator submission draft is ready for your review with all 14 indicators compiled and annotated.",
    actions: [
      { severity: "urgent", title: "Falls prevention audit overdue", description: "Wing B bathroom grab rail assessment not completed. 4 days past due date.", penaltyRisk: "Overdue corrective actions are ACQSC audit risk", actionLabel: "Complete audit →", route: "/dashboard/audits" },
      { severity: "routine", title: "Q2 QI submission ready", description: "All 14 indicators compiled. CHRIS draft ready for 20-minute review.", actionLabel: "Review submission →", route: "/dashboard/quality" },
    ],
    subNav: [
      { label: "Care Minutes", route: "/dashboard/clinical/care-minutes" },
      { label: "SIRS Register", route: "/dashboard/sirs" },
      { label: "Quality Indicators", route: "/dashboard/quality" },
      { label: "Clinical Audits", route: "/dashboard/audits" },
    ],
  },
  governance: {
    title: "Governance",
    subtitle: "Compliance, obligations & regulatory readiness",
    stats: [
      { value: "12", label: "Obligations", urgency: "none" },
      { value: "1", label: "Overdue", urgency: "immediate" },
      { value: "89%", label: "Compliance", urgency: "none" },
      { value: "8d", label: "Board pack", urgency: "urgent" },
    ],
    agents: ["Sentinel", "Chronicler", "Steward"],
    chrisNarrative:
      "Compliance score sits at 89% against the 95% target. One corrective action is 58 days overdue in Wing B which is pulling the score down. The board pack for the 17 April meeting is drafted and ready for your 35-minute review. All mandatory notifications are current and no regulatory deadlines are within the red zone this fortnight.",
    actions: [
      { severity: "immediate", title: "Corrective action — 58 days overdue", description: "Wing B bathroom falls prevention. Grab rail assessment not done.", penaltyRisk: "Overdue corrective actions are ACQSC audit risk", countdown: "58d", actionLabel: "Assign now →", route: "/dashboard/compliance" },
      { severity: "urgent", title: "Board Pack approval — 8 days", description: "Meeting 17 April. CHRIS draft ready. 35 min review.", countdown: "8d", actionLabel: "Start review →", route: "/dashboard/reporting" },
    ],
    subNav: [
      { label: "Obligations Register", route: "/dashboard/compliance" },
      { label: "Board Pack", route: "/dashboard/reporting" },
      { label: "SIRS Register", route: "/dashboard/sirs" },
      { label: "Corrective Actions", route: "/dashboard/compliance/corrective" },
    ],
  },
  workforce: {
    title: "Workforce",
    subtitle: "Rostering, wellbeing & team culture",
    stats: [
      { value: "94%", label: "Fill rate", urgency: "none" },
      { value: "$18K", label: "Agency MTD", urgency: "urgent" },
      { value: "3", label: "PSH elevated", urgency: "urgent" },
      { value: "1", label: "Turnover risk", urgency: "immediate" },
    ],
    agents: ["Keeper", "Steward", "Sentinel", "Town Crier"],
    chrisNarrative:
      "Roster fill rate is 94% with one Sunday PM RN gap confirmed by Steward. Agency spend is $18K month-to-date, tracking above the $15K target. Three psychosocial hazard scores are elevated across two wings. Keeper has detected a turnover precursor pattern in Wattle Wing where PSH_13 has been declining for 4 consecutive cycles. This matches the pattern that preceded the December RN exits.",
    actions: [
      { severity: "immediate", title: "Turnover precursor — Wattle Wing", description: "PSH_13 declining 4 cycles. Pattern matches pre-December RN exit signal.", actionLabel: "View workforce signals →", route: "/dashboard/psh" },
      { severity: "urgent", title: "Sunday PM RN gap", description: "No RN rostered for Sunday 14:00-22:00. Agency or overtime needed.", countdown: "2d", actionLabel: "Fill shift →", route: "/dashboard/workforce" },
    ],
    subNav: [
      { label: "Roster Overview", route: "/dashboard/workforce" },
      { label: "PSH Dashboard", route: "/dashboard/psh" },
      { label: "Agency Tracker", route: "/dashboard/workforce/agency" },
      { label: "Team Loop", route: "/dashboard/team-loop" },
    ],
  },
  financial: {
    title: "Financial",
    subtitle: "Revenue, costs & funding optimisation",
    stats: [
      { value: "72%", label: "Care ratio", urgency: "none" },
      { value: "$18K", label: "Agency cost", urgency: "urgent" },
      { value: "93%", label: "Occupancy", urgency: "none" },
      { value: "$11.4K", label: "AN-ACC opp.", urgency: "routine" },
    ],
    agents: ["Oracle", "Steward", "Town Crier"],
    chrisNarrative:
      "Care labour ratio is 72% which is within the target band. Agency costs are $18K month-to-date and trending above the $15K budget. Occupancy is stable at 93%. Oracle has identified 3 AN-ACC reclassification opportunities worth an estimated $11.4K per month in additional revenue. The CFO has been notified and the AN-ACC review pack is ready.",
    actions: [
      { severity: "routine", title: "AN-ACC reclassification opportunities", description: "3 residents flagged for potential uplift. $11.4K/month estimated revenue.", actionLabel: "View Oracle report →", route: "/dashboard/financial/revenue" },
      { severity: "urgent", title: "Agency spend tracking over budget", description: "$18K against $15K monthly target. Sunday PM gap driving premium costs.", countdown: "$3K over", actionLabel: "View cost breakdown →", route: "/dashboard/financial" },
    ],
    subNav: [
      { label: "Revenue Dashboard", route: "/dashboard/financial" },
      { label: "AN-ACC Opportunities", route: "/dashboard/financial/revenue" },
      { label: "Agency Cost Tracker", route: "/dashboard/workforce/agency" },
      { label: "Care Ratio Analysis", route: "/dashboard/financial/care-ratio" },
    ],
  },
  residents: {
    title: "Residents",
    subtitle: "Clinical profiles, AN-ACC & family engagement",
    stats: [
      { value: "68", label: "Residents", urgency: "none" },
      { value: "3", label: "AN-ACC review", urgency: "routine" },
      { value: "0", label: "Open incidents", urgency: "none" },
      { value: "96%", label: "Family sat.", urgency: "none" },
    ],
    agents: ["Sentinel", "Oracle", "Chronicler"],
    chrisNarrative:
      "68 residents are currently in care with stable occupancy. No open incidents are recorded. Oracle has flagged 3 residents for potential AN-ACC reclassification based on changing care needs. Family satisfaction remains high at 96%. The quarterly care review schedule is on track with 12 reviews completed this month and 4 remaining.",
    actions: [
      { severity: "routine", title: "3 AN-ACC reviews recommended", description: "Changing care profiles suggest potential reclassification. Oracle analysis ready.", actionLabel: "Review profiles →", route: "/dashboard/residents/anacc" },
    ],
    subNav: [
      { label: "Resident Profiles", route: "/dashboard/residents" },
      { label: "AN-ACC Reviews", route: "/dashboard/residents/anacc" },
      { label: "Care Plans", route: "/dashboard/residents/care-plans" },
      { label: "Family Portal", route: "/dashboard/residents/family" },
    ],
  },
  operations: {
    title: "Operations",
    subtitle: "Facilities, maintenance & daily operations",
    stats: [
      { value: "2", label: "Open issues", urgency: "urgent" },
      { value: "98%", label: "Uptime", urgency: "none" },
      { value: "3", label: "Maint. due", urgency: "routine" },
      { value: "0", label: "Safety alerts", urgency: "none" },
    ],
    agents: ["Steward", "Sentinel", "Town Crier"],
    chrisNarrative:
      "Two operational issues are open: the Wing B grab rail assessment and a laundry equipment service request. Facility uptime is 98%. Three scheduled maintenance items are coming due this fortnight. No safety alerts are active. The Steward has flagged that the Sunday PM staffing gap may impact operations if not resolved before the weekend.",
    actions: [
      { severity: "urgent", title: "Wing B grab rail assessment", description: "Falls prevention corrective action. 58 days overdue. Linked to governance compliance.", actionLabel: "Schedule assessment →", route: "/dashboard/operations/maintenance" },
      { severity: "routine", title: "3 maintenance items due", description: "Scheduled preventive maintenance for HVAC, generator test, and fire panel service.", actionLabel: "View schedule →", route: "/dashboard/operations/maintenance" },
    ],
    subNav: [
      { label: "Facility Overview", route: "/dashboard/operations" },
      { label: "Maintenance Schedule", route: "/dashboard/operations/maintenance" },
      { label: "Safety Dashboard", route: "/dashboard/operations/safety" },
      { label: "Asset Register", route: "/dashboard/operations/assets" },
    ],
  },
};

export function MobileDomainScreen({ domain }: { domain: Domain }) {
  const router = useRouter();
  const [chrisExpanded, setChrisExpanded] = useState(false);
  const config = DOMAIN_CONFIG[domain];

  const sentences = config.chrisNarrative.split(/(?<=\.)\s+/).filter(Boolean);
  const preview = sentences.slice(0, 3).join(" ");
  const rest = sentences.slice(3).join(" ");

  return (
    <div className="min-h-screen bg-[#FAF9F7] pb-24">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              data-has-handler="true"
              onClick={() => router.push("/dashboard")}
              className="p-2 -ml-2 active:bg-gray-100 rounded-xl"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-[28px] font-bold text-gray-900">{config.title}</h1>
              <p className="text-[13px] text-gray-500 mt-0.5">{config.subtitle}</p>
            </div>
          </div>
          <button
            data-has-handler="true"
            onClick={() => router.push("/dashboard/coach")}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-[13px] font-medium text-gray-700 active:bg-gray-50"
          >
            <Mic className="w-4 h-4" />
            <span>Ask</span>
          </button>
        </div>
      </div>

      {/* Stat grid */}
      <div className="px-4 mt-4">
        <MobileStatGrid stats={config.stats} />
      </div>

      {/* Agent pulse */}
      <div className="px-4 mt-4">
        <MobileAgentPulse agents={config.agents} domain={config.title} />
      </div>

      {/* CHRIS narrative */}
      <div className="mx-4 mt-4 bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1B4332] to-[#C9A84C] flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-bold">C</span>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-gray-900">CHRIS</p>
            <p className="text-[12px] text-gray-400">{config.title} intelligence</p>
          </div>
        </div>
        <p className="text-[17px] text-gray-800 leading-[1.65]">
          {preview}
          {rest && !chrisExpanded && (
            <span>
              ...{" "}
              <button
                onClick={() => setChrisExpanded(true)}
                className="text-[#2D7D73] font-semibold"
              >
                Read more
              </button>
            </span>
          )}
          {chrisExpanded && (
            <span>
              {" "}
              {rest}{" "}
              <button
                onClick={() => setChrisExpanded(false)}
                className="text-[#2D7D73] font-semibold"
              >
                Show less
              </button>
            </span>
          )}
        </p>
      </div>

      {/* Action cards */}
      {config.actions.length > 0 && (
        <div className="px-4 mt-4">
          <p className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Needs attention
          </p>
          <div className="flex flex-col gap-3">
            {config.actions.map((action, i) => (
              <MobileActionCard
                key={i}
                severity={action.severity}
                title={action.title}
                description={action.description}
                penaltyRisk={action.penaltyRisk}
                countdown={action.countdown}
                actionLabel={action.actionLabel}
                route={action.route}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sub navigation */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {config.subNav.map((item, i) => (
            <button
              key={item.route}
              data-has-handler="true"
              onClick={() => router.push(item.route)}
              className={`w-full flex items-center justify-between px-5 py-4 text-left active:bg-gray-50 ${
                i < config.subNav.length - 1 ? "border-b border-gray-50" : ""
              }`}
            >
              <span className="text-[15px] font-medium text-gray-900">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
