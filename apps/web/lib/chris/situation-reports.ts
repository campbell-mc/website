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
  narrative: `Tonight is the one to watch. The evening RN shift is still unfilled — that's what's driving the care minutes risk. If agency cover isn't confirmed by 3pm, care minutes will breach for the first time this week after 7 consecutive compliant days. Convergence detected: the unfilled RN shift pattern concentrates in Grevillea Wing where PSH_01 (Job Demands) has been elevated for 6 cycles — staff aren't declining shifts randomly, they're avoiding a high-demand environment. The 3 outstanding handovers are routine and can be cleared after the SIRS draft, which is the real priority in the queue right now — clearing it removes it from tomorrow's risk picture. The huddle agenda is ready and pre-loaded with this week's data — running it by voice with CHRIS takes 12 minutes.`,
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
  narrative: `The SIRS Cat 1 notification for the March 3 wrist fracture is due today — the Chronicler draft is ready for your review. This must be submitted before the deadline to avoid $783K penalty exposure. Care minutes have been compliant all week — ${latestCM.avg_total} total, ${latestCM.avg_rn} RN — the strongest sustained period since November. QI_03 (Falls) remains above benchmark for a third consecutive quarter. Convergence detected: 78% of falls occurred on shifts with more than 30% agency coverage — pulse data confirms PSH_08 (Traumatic Exposure) is elevated in the same teams, meaning unfamiliar staff are working alongside emotionally withdrawn permanent staff, and residents are falling through the gaps.`,
  refreshedAt: "2h ago",
  context: `Care minutes ${latestCM.avg_total >= 215 ? "compliant" : "at risk"} · AlayaCare 2h ago`,
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
  narrative: `The workforce picture is split this cycle. Wattle Wing PSH_08 dropped 0.08 — the strongest single-cycle improvement this year. Grevillea Wing remains a concern: PSH_01 and PSH_08 co-elevated for 6 cycles. Convergence detected: absenteeism concentration in Grevillea correlates with the PSH elevation — staff are avoiding the workplace, not randomly calling in sick. ${latestWf.credentials_expiring_30d} AHPRA registrations expire within 30 days — one affects night shift RN coverage.`,
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
  narrative: `Care ratio at ${careRatio}% — ${(55 - careRatio).toFixed(1)} points below 55% target. Agency at $${agencyK}K, down from $${janAgencyK}K peak in January. Convergence detected: the agency cost spike traces to PSH_13 (Low Recognition) declining 4 cycles in Wattle Wing before the December RN exits — this is a culture cost, not a labour market event. Three AN-ACC reassessment opportunities worth +$8.2K/month if clinical reviews happen before assessment dates.`,
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
  narrative: `Governance is mostly on track with two things needing your attention this week. The QI submission for Q2 is due in 9 days — CHRIS has compiled all 14 indicators and the draft is ready for a 15-minute review. The Wing B bathroom corrective action (CA-2026-004) is now 58 days overdue — it originated from the January SIRS event and the falls prevention audit, and it's the only open corrective action without a completion date. Convergence detected: this CA links to the same Grevillea Wing where PSH_01 and PSH_08 are co-elevated — the environment hazard that caused the fall and the psychosocial hazard affecting the team share a common root. Compliance score is ${compScore} of ${compliance_obligations.length} obligations met — ${atRisk} are at risk, both fixable in under 5 minutes with CHRIS. ISO 45003 evidence is current across 3 of 4 categories; the worker consultation record needs updating, which CHRIS can do from pulse data immediately.`,
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

// ============================================================
// HOME CARE — VISITS
// ============================================================

export const hcVisitsReport = {
  narrative: `Visit compliance is holding at 95.2% — just below the 97% target and worth watching. The shortfall concentrates in the Southern Highlands afternoon round where travel time between clients is eating into visit windows. 3 missed visits last week were all lone worker safety holds — workers couldn't check in via the app due to mobile coverage gaps in Bundanoon. Sentinel flagged a pattern: Monday and Friday visits in the outer zones have a 12% higher missed-visit rate than mid-week. Steward recommends restructuring the Tuesday/Thursday rounds to absorb the high-risk outer zone clients, reducing travel clustering. SIRS register is clean — no open notifications.`,
  refreshedAt: "2h ago",
  context: "Visit compliance 95.2% · 247 active clients",
  signals: [
    { domain: "Visits", active: true },
    { domain: "Workforce", active: true },
    { domain: "Compliance", active: false },
    { domain: "Financial", active: false },
  ] as SignalDot[],
};

// ============================================================
// HOME CARE — CLIENTS
// ============================================================

export const hcClientsReport = {
  narrative: `6 clients are flagged as high-risk this fortnight — up from 4 last cycle. Margaret T. and Ronald S. both live alone with compounding risk factors and need weekly case conference review. 7 care plans are overdue for review — 3 are in the Southern Highlands service where the new coordinator is still onboarding. Feedback is tracking well: 77% satisfaction overall, but 3 open complaints need attention. The oldest (communication gap on care plan changes for Dorothy M.) is at 8 days — nearing the 14-day resolution threshold. Keeper has flagged that care worker continuity in the outer zones is declining — the same clients are seeing different workers each visit, which correlates with the satisfaction dip in that area.`,
  refreshedAt: "2h ago",
  context: "247 active clients · 6 high-risk · 7 care plans overdue",
  signals: [
    { domain: "Clients", active: true },
    { domain: "Workforce", active: true },
    { domain: "Compliance", active: false },
    { domain: "Financial", active: false },
  ] as SignalDot[],
};

// ============================================================
// HOME CARE — WORKFORCE
// ============================================================

export const hcWorkforceReport = {
  narrative: `The workforce picture has two threads this fortnight. First, the good news: training compliance is at 94% and trending up — the online module push in March is paying off. Credential currency is strong with only 2 AHPRA renewals due in the next 30 days. Second, Keeper has detected a turnover precursor in the Camelot team — PSH_13 (role clarity) has been declining for 3 consecutive cycles. This pattern historically precedes voluntary turnover in 71% of comparable home care teams. The driver appears to be the new rostering system rollout — workers are unclear on their schedules and reporting confusion about client assignments. Absenteeism in the same team is up 18% this cycle, concentrated on Mondays — a classic early signal. Recommend: team leader conversation this cycle before the pattern establishes.`,
  refreshedAt: "2h ago",
  context: "89 active care workers · training 94% · 2 credentials expiring",
  signals: [
    { domain: "Workforce", active: true },
    { domain: "Visits", active: true },
    { domain: "Clients", active: false },
    { domain: "Financial", active: false },
  ] as SignalDot[],
};

// ============================================================
// HOME CARE — FINANCIAL
// ============================================================

export const hcFinancialReport = {
  narrative: `Revenue per client per day sits at $84.20 against the sector benchmark of $84.89 — close but below. The gap is driven by 12 clients tracking below 75% package utilisation this quarter. Oracle estimates $47.2K at risk of returning to government under Support at Home rules if utilisation isn't addressed before June 30. The highest-impact opportunity: 4 Level 4 clients with combined $47K unspent are all in the category of "carer reluctance" — primary carers preferring to provide care themselves. Care coordinator conversations are scheduled for 3 of the 4 this fortnight. EBITDA return at 5.8% is within target but below the StewartBrown HC sector median of 7.1%. The main drag is care management costs running 19.1% vs the 18.7% benchmark — driven by coordinator workload from the onboarding surge in February.`,
  refreshedAt: "2h ago",
  context: "Revenue $84.20/client/day · EBITDA 5.8% · $47K unspent at risk",
  signals: [
    { domain: "Financial", active: true },
    { domain: "Clients", active: true },
    { domain: "Workforce", active: false },
    { domain: "Compliance", active: false },
  ] as SignalDot[],
};

// ============================================================
// HOME CARE — COMPLIANCE
// ============================================================

export const hcComplianceReport = {
  narrative: `Compliance register sits at 82% — 3 obligations at risk. The overdue corrective action on missed visit notifications is the priority: 3 clients weren't notified of cancelled visits in March, and the process fix (automated SMS) is in progress but not yet live. Lone worker check-in compliance has improved from 82% to 88% after the app reminder enhancement, but still below the 95% target. SIRS register is clean — no open Cat 1 or Cat 2 notifications. The next quality indicator submission is due 28 April — CHRIS has compiled the data and it's ready for review. Worker screening currency is strong: all NDIS Worker Screening checks current after the renewal push in February.`,
  refreshedAt: "2h ago",
  context: "Compliance 82% · 1 corrective action overdue · SIRS clear",
  signals: [
    { domain: "Compliance", active: true },
    { domain: "Visits", active: true },
    { domain: "Workforce", active: false },
    { domain: "Financial", active: false },
  ] as SignalDot[],
};

// ============================================================
// RESIDENTIAL — RESIDENTS
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
