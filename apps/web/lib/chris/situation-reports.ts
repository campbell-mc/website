/**
 * CHRIS Situation Report Narratives
 *
 * Seed-data-driven narrative text for each domain control centre.
 * In production these are generated via Claude API on each connector
 * pull cycle. For now: handcrafted from seed data to demonstrate
 * exactly how CHRIS speaks.
 *
 * Each narrative: 3-5 sentences, connected, specific, no bullet points.
 * CHRIS speaks in paragraphs like a trusted colleague giving a verbal handover.
 */

import type { SignalDot } from "@/components/chris/SituationReport";
import { financial_monthly, workforce_monthly, care_minutes_weekly, sirs_events, compliance_obligations, corrective_actions, resident_intelligence, psh_cycles } from "@/lib/seed-data";

const latestFin = financial_monthly[financial_monthly.length - 1];
const latestWf = workforce_monthly[workforce_monthly.length - 1];
const latestCM = care_minutes_weekly[care_minutes_weekly.length - 1];
const latestCycle = psh_cycles[psh_cycles.length - 1];
const ri = resident_intelligence;

// ============================================================
// OPERATIONS
// ============================================================

export const operationsReport = {
  narrative: `Tonight is the one to watch. The evening RN shift is still unfilled — that's what's driving the care minutes risk. If agency cover isn't confirmed by 3pm, care minutes will breach for the first time this week after 7 consecutive compliant days. The 3 outstanding handovers are routine and can be cleared after the SIRS draft, which is the real priority in the queue right now — it takes about 10 minutes and has 22 days remaining, but clearing it removes it from tomorrow's risk picture. The huddle agenda is ready and pre-loaded with this week's data — running it by voice with CHRIS takes 12 minutes.`,
  refreshedAt: "2h ago",
  context: "Day shift",
  signals: [
    { domain: "Clinical", active: true },
    { domain: "Workforce", active: true },
    { domain: "Financial", active: false },
    { domain: "Governance", active: false },
  ] as SignalDot[],
};

// ============================================================
// CLINICAL
// ============================================================

export const clinicalReport = {
  narrative: `The SIRS Cat 1 notification for the March 3 wrist fracture is due today — the Chronicler draft is ready for your review. This must be submitted before the deadline to avoid $783K penalty exposure. Care minutes have been compliant all week — ${latestCM.avg_total} total, ${latestCM.avg_rn} RN — the strongest sustained period since November. QI_03 (Falls) remains above benchmark for a third consecutive quarter, with 78% of falls on shifts with more than 30% agency coverage.`,
  refreshedAt: "2h ago",
  context: `Care minutes ${latestCM.avg_total >= 200 ? "compliant" : "at risk"} · AlayaCare 2h ago`,
  signals: [
    { domain: "Clinical", active: true },
    { domain: "Workforce", active: true },
    { domain: "Financial", active: false },
    { domain: "Residents", active: false },
  ] as SignalDot[],
};

// ============================================================
// WORKFORCE
// ============================================================

export const workforceReport = {
  narrative: `The workforce picture is split this cycle. Wattle Wing is the good news — PSH_08 dropped 0.08, the strongest single-cycle improvement in that team this year, and the practice prescribed last cycle appears to be working. Grevillea Wing is the concern: PSH_01 and PSH_08 have been co-elevated for 6 consecutive cycles and Level 4 practices aren't moving them. This is a HOC-level situation — a specialist dementia behaviour support conversation is overdue. Agency dependency is at ${Math.round(latestWf.agency_hours_pct * 100)}% and reducing month-on-month, but 9 residents mentioned staff consistency in this cycle's voice check-in — they notice the unfamiliar faces. ${latestWf.credentials_expiring_30d} AHPRA registrations expire within 30 days — one affects night shift RN coverage and needs urgent follow-up.`,
  refreshedAt: "4h ago",
  context: `Cycle ${latestCycle.cycle} · Response rate ${Math.round(latestCycle.facility_response_rate * 100)}%`,
  signals: [
    { domain: "Workforce", active: true },
    { domain: "Clinical", active: true },
    { domain: "Residents", active: true },
    { domain: "Financial", active: false },
  ] as SignalDot[],
};

// ============================================================
// FINANCIAL
// ============================================================

const careRatio = Math.round(latestFin.care_ratio * 1000) / 10;
const agencyK = Math.round(latestFin.expenditure.direct_care_agency / 1000);
const janAgencyK = Math.round(financial_monthly[3].expenditure.direct_care_agency / 1000);
const occupancy = Math.round(latestFin.occupancy_pct * 100 * 10) / 10;

export const financialReport = {
  narrative: `The financial picture is recovering but not there yet. Care ratio at ${careRatio}% is the headline — ${(55 - careRatio).toFixed(1)} points below the 55% target — but the driver is agency labour cost, not weak revenue. Agency peaked at $${janAgencyK}K in January and is now at $${agencyK}K, reducing month-on-month as the new RN settles in. At current trajectory CHRIS projects care ratio recovering to 55% by June. The two vacant beds are costing $840/day in foregone AN-ACC and hotelling revenue — 18 days for Wing A Bed 14. The admissions pipeline has ${ri.cohort.admissions_pipeline.enquiries} active enquiries and ${ri.cohort.admissions_pipeline.assessments_in_progress} assessments in progress. Three residents flagged for AN-ACC reassessment represent a potential +$8.2K/month revenue uplift — clinical reviews should happen before their assessment dates.`,
  refreshedAt: "2h ago",
  context: `FY2026-${latestFin.period.split("-")[1]}`,
  signals: [
    { domain: "Financial", active: true },
    { domain: "Workforce", active: true },
    { domain: "Clinical", active: false },
    { domain: "Residents", active: true },
  ] as SignalDot[],
};

// ============================================================
// GOVERNANCE
// ============================================================

const atRisk = compliance_obligations.filter((o) => o.status === "at_risk").length;
const compScore = compliance_obligations.filter((o) => o.status === "compliant").length;
const overdueCA = corrective_actions.filter((ca) => ca.status === "not_started").length;

export const governanceReport = {
  narrative: `Governance is mostly on track with two things needing your attention this week. The QI submission for Q2 is due in 9 days — CHRIS has compiled all 14 indicators and the draft is ready for a 15-minute review. The Wing B bathroom corrective action (CA-2026-004) is now 58 days overdue — it originated from the January SIRS event and the falls prevention audit, and it's the only open corrective action without a completion date. Compliance score is ${compScore} of ${compliance_obligations.length} obligations met — ${atRisk} are at risk, both fixable in under 5 minutes with CHRIS. The Board Pack is ready for your approval and the meeting is in 8 days — estimated 35 minutes to review. ISO 45003 evidence is current across 3 of 4 categories; the worker consultation record needs updating, which CHRIS can do from pulse data immediately.`,
  refreshedAt: "4h ago",
  context: `Compliance ${compScore}/${compliance_obligations.length} · ${atRisk} at risk`,
  signals: [
    { domain: "Governance", active: true },
    { domain: "Clinical", active: true },
    { domain: "Workforce", active: false },
    { domain: "Financial", active: false },
  ] as SignalDot[],
};

// ============================================================
// RESIDENTS
// ============================================================

export const residentsReport = {
  narrative: `The resident picture needs a closer look in the dementia wings this week. Grevillea and Acacia are showing declining voice scores for the third consecutive fortnight — both sitting below 3.5 on "feeling listened to" — and CHRIS has cross-referenced this with the PSH_08 elevation in those teams. Staff carrying unaddressed traumatic exposure tend to withdraw emotionally, and residents experience that as not being heard. The two care plans overdue for review are both in these wings — worth combining the care plan review with a check-in on what residents are experiencing. The one open complaint (food quality, Wattle Wing) has ${ri.complaints.open_items[0]?.days_remaining} days left in the response window and is the third food quality complaint in 6 months — a pattern, not an isolated event. Overall consumer experience remains above benchmark at ${ri.consumer_experience.qi_11_score} — the dementia wing pattern is an early signal, not yet a headline number.`,
  refreshedAt: "2h ago",
  context: `Voice Cycle ${ri.resident_voice.cycle} · ${ri.cohort.total_residents} residents`,
  signals: [
    { domain: "Residents", active: true },
    { domain: "Workforce", active: true },
    { domain: "Clinical", active: true },
    { domain: "Financial", active: false },
  ] as SignalDot[],
};
