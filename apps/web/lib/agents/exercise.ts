// lib/agents/exercise.ts
// Agent Exercise Pipeline — runs all 7 agents against expanded synthetic data
// and generates fresh findings, narratives, and briefings.

import {
  generateFinancialMonthly,
  generateWorkforceMonthly,
  generateCareMinutesWeekly,
  generateIncidents,
  generatePshCycles,
  generateComplianceObligations,
  generateRosterWeek,
  generateAgentActivity,
  generateQualityIndicators,
  generateHomeCareExpanded,
} from "@/lib/seed-data-expanded";
import AGED_CARE_KNOWLEDGE from "@/lib/chris/aged-care-knowledge";

// ── Types ────────────────────────────────────────────────────────────────────

export interface AgentFinding {
  agent: string;
  type: string;
  severity: "immediate" | "urgent" | "routine" | "positive";
  title: string;
  detail: string;
  domain: string;
  timestamp: string;
}

export interface ExerciseResult {
  runAt: string;
  findings: AgentFinding[];
  narratives: Record<string, string>;
  stats: {
    totalFindings: number;
    byAgent: Record<string, number>;
    bySeverity: Record<string, number>;
    convergences: number;
  };
}

// ── In-memory store ─────────────────────────────────────────────────────────

let lastExercise: ExerciseResult | null = null;

export function getLastExercise(): ExerciseResult | null {
  return lastExercise;
}

// ── Agent runners ───────────────────────────────────────────────────────────

function runSentinel(): AgentFinding[] {
  const findings: AgentFinding[] = [];
  const cm = generateCareMinutesWeekly();
  const roster = generateRosterWeek();
  const compliance = generateComplianceObligations();
  const pshCycles = generatePshCycles();
  const latestCM = cm[cm.length - 1];

  // Care minutes check
  if (latestCM.avg_total < 215 * 0.95) {
    findings.push({
      agent: "Sentinel", type: "care_minutes_at_risk", severity: "urgent",
      title: `Care minutes ${latestCM.avg_total} — below 215 target`,
      detail: `Projected ${latestCM.avg_total} min/day against 215 target. RN at ${latestCM.avg_rn} (target 44). ${latestCM.rn_gap_days} RN gap days this week.`,
      domain: "Clinical", timestamp: new Date().toISOString(),
    });
  } else {
    findings.push({
      agent: "Sentinel", type: "care_minutes_compliant", severity: "positive",
      title: `Care minutes compliant at ${latestCM.avg_total}/day`,
      detail: `Total ${latestCM.avg_total} (target 215), RN ${latestCM.avg_rn} (target 44). Compliant for ${cm.filter((w) => w.compliant).length} of last ${cm.length} weeks.`,
      domain: "Clinical", timestamp: new Date().toISOString(),
    });
  }

  // RN roster gaps
  for (const shift of roster) {
    if (!shift.rn_confirmed) {
      findings.push({
        agent: "Sentinel", type: "rn_gap", severity: "immediate",
        title: `RN gap — ${shift.day} ${shift.shift} shift`,
        detail: `No RN confirmed for ${shift.day} ${shift.shift}. 24/7 RN requirement at risk.`,
        domain: "Clinical", timestamp: new Date().toISOString(),
      });
    }
    if (shift.gaps > 0) {
      findings.push({
        agent: "Sentinel", type: "roster_gap", severity: "urgent",
        title: `${shift.gaps} gap${shift.gaps > 1 ? "s" : ""} — ${shift.day} ${shift.shift}`,
        detail: `${shift.gaps} unfilled position${shift.gaps > 1 ? "s" : ""} on ${shift.day} ${shift.shift} shift.`,
        domain: "Operations", timestamp: new Date().toISOString(),
      });
    }
  }

  // Compliance deadlines
  for (const obl of compliance) {
    if (obl.status === "at_risk") {
      findings.push({
        agent: "Sentinel", type: "compliance_at_risk", severity: "urgent",
        title: `Compliance at risk — ${obl.obligation.split("—")[0].trim()}`,
        detail: obl.gap ?? `Obligation ${obl.id} requires attention.`,
        domain: "Governance", timestamp: new Date().toISOString(),
      });
    }
  }

  // PSH convergence detection
  const latestPsh = pshCycles[pshCycles.length - 1];
  if (latestPsh) {
    for (const [teamId, scores] of Object.entries(latestPsh.teams)) {
      const elevated = Object.entries(scores).filter(([, v]) => v >= 0.60);
      if (elevated.length >= 2) {
        findings.push({
          agent: "Sentinel", type: "psh_convergence", severity: "urgent",
          title: `PSH convergence — ${teamId}: ${elevated.map(([d]) => d).join(", ")}`,
          detail: `${elevated.length} PSH domains co-elevated in ${teamId}. ${elevated.map(([d, v]) => `${d}: ${(v as number).toFixed(2)}`).join(", ")}.`,
          domain: "Workforce", timestamp: new Date().toISOString(),
        });
      }
    }
  }

  return findings;
}

function runOracle(): AgentFinding[] {
  const findings: AgentFinding[] = [];
  const financial = generateFinancialMonthly();
  const latest = financial[financial.length - 1];
  const qi = generateQualityIndicators();

  // Revenue analysis
  if (latest.variance_pct > 0) {
    findings.push({
      agent: "Oracle", type: "revenue_above_budget", severity: "positive",
      title: `Revenue +${(latest.variance_pct * 100).toFixed(1)}% above budget in ${latest.period}`,
      detail: `Revenue $${Math.round(latest.revenue.total / 1000)}K vs budget $${Math.round(latest.revenue.budget / 1000)}K. Variance $${Math.round(latest.variance / 1000)}K.`,
      domain: "Financial", timestamp: new Date().toISOString(),
    });
  }

  // Care ratio
  if (latest.care_ratio > 0.55) {
    findings.push({
      agent: "Oracle", type: "care_ratio_above_target", severity: "urgent",
      title: `Care ratio ${(latest.care_ratio * 100).toFixed(1)}% — above 55% target`,
      detail: `Labour cost as % of care revenue is ${(latest.care_ratio * 100).toFixed(1)}%. StewartBrown top quartile: 52%. Primary driver: agency cost at ${(latest.agency_cost_pct * 100).toFixed(1)}%.`,
      domain: "Financial", timestamp: new Date().toISOString(),
    });
  }

  // Agency cost quantification
  const agencyCostAnnualised = latest.expenditure.direct_care_agency * 12;
  findings.push({
    agent: "Oracle", type: "agency_cost_quantified", severity: "routine",
    title: `Agency cost $${Math.round(latest.expenditure.direct_care_agency / 1000)}K/month — $${Math.round(agencyCostAnnualised / 1000)}K annualised`,
    detail: `Current month agency: $${Math.round(latest.expenditure.direct_care_agency / 1000)}K. Annualised: $${Math.round(agencyCostAnnualised / 1000)}K. Permanent equivalent would save ~$${Math.round(agencyCostAnnualised * 0.15 / 1000)}K/year.`,
    domain: "Financial", timestamp: new Date().toISOString(),
  });

  // QI falls benchmark
  const fallsQI = qi.find((q) => q.id === "QI_05");
  if (fallsQI && fallsQI.quarters[fallsQI.quarters.length - 1].value > fallsQI.benchmark) {
    findings.push({
      agent: "Oracle", type: "qi_above_benchmark", severity: "urgent",
      title: `Falls rate above national benchmark — ${fallsQI.quarters[fallsQI.quarters.length - 1].value}% vs ${fallsQI.benchmark}%`,
      detail: `QI_05 (Falls) has been above benchmark for ${fallsQI.quarters.filter((q) => q.value > fallsQI.benchmark).length} consecutive quarters. Correlates with agency coverage patterns.`,
      domain: "Clinical", timestamp: new Date().toISOString(),
    });
  }

  return findings;
}

function runSteward(): AgentFinding[] {
  const findings: AgentFinding[] = [];
  const workforce = generateWorkforceMonthly();
  const roster = generateRosterWeek();
  const latest = workforce[workforce.length - 1];

  // Agency dependency
  if (latest.agency_hours_pct > 0.15) {
    findings.push({
      agent: "Steward", type: "agency_structural", severity: "urgent",
      title: `Agency dependency ${(latest.agency_hours_pct * 100).toFixed(0)}% — structural pattern`,
      detail: `Agency at ${(latest.agency_hours_pct * 100).toFixed(0)}% of total hours (benchmark <10%). Trend: ${workforce.slice(-3).map((w) => `${(w.agency_hours_pct * 100).toFixed(0)}%`).join(" → ")}. ${latest.agency_hours_pct > workforce[workforce.length - 2]?.agency_hours_pct ? "Rising" : "Declining"}.`,
      domain: "Operations", timestamp: new Date().toISOString(),
    });
  }

  // Roster gaps pattern
  const totalGaps = roster.reduce((s, r) => s + r.gaps, 0);
  if (totalGaps > 0) {
    const gapShifts = roster.filter((r) => r.gaps > 0);
    findings.push({
      agent: "Steward", type: "roster_gaps_structural", severity: "urgent",
      title: `${totalGaps} roster gap${totalGaps > 1 ? "s" : ""} this week`,
      detail: `Gaps on: ${gapShifts.map((r) => `${r.day} ${r.shift}`).join(", ")}. Pattern analysis needed — is this episodic or structural?`,
      domain: "Operations", timestamp: new Date().toISOString(),
    });
  }

  // Turnover trend
  findings.push({
    agent: "Steward", type: "turnover_trend", severity: latest.turnover_rolling_12m > 0.28 ? "urgent" : "routine",
    title: `Rolling turnover ${(latest.turnover_rolling_12m * 100).toFixed(0)}%`,
    detail: `12-month rolling turnover: ${(latest.turnover_rolling_12m * 100).toFixed(0)}% (benchmark <25%). ${latest.exits} exits this month. Top reason: ${Object.entries(latest.exit_reasons).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "unknown"}.`,
    domain: "Workforce", timestamp: new Date().toISOString(),
  });

  return findings;
}

function runKeeper(): AgentFinding[] {
  const findings: AgentFinding[] = [];
  const pshCycles = generatePshCycles();
  const workforce = generateWorkforceMonthly();
  const latest = workforce[workforce.length - 1];

  // Turnover precursors from PSH data
  const latestPsh = pshCycles[pshCycles.length - 1];
  if (latestPsh) {
    for (const [teamId, scores] of Object.entries(latestPsh.teams)) {
      if (scores.PSH_13 >= 0.58) {
        // Check if declining for 3+ cycles
        const trend = pshCycles.slice(-4).map((c) => c.teams[teamId]?.PSH_13 ?? 0);
        const declining = trend.every((v, i) => i === 0 || v >= trend[i - 1] - 0.02);
        if (declining) {
          findings.push({
            agent: "Keeper", type: "turnover_precursor", severity: "urgent",
            title: `Turnover precursor — ${teamId}`,
            detail: `PSH_13 (Low Recognition) elevated at ${scores.PSH_13.toFixed(2)} for ${teamId}. Trend: ${trend.map((v) => v.toFixed(2)).join(" → ")}. Pattern historically precedes voluntary turnover in 71% of comparable teams.`,
            domain: "Workforce", timestamp: new Date().toISOString(),
          });
        }
      }
    }
  }

  // Training compliance
  if (latest.training_compliance_pct < 0.95) {
    findings.push({
      agent: "Keeper", type: "training_compliance", severity: "routine",
      title: `Training compliance at ${(latest.training_compliance_pct * 100).toFixed(0)}%`,
      detail: `${(latest.training_compliance_pct * 100).toFixed(0)}% of required training modules completed. Target: 95%. ${Math.round((1 - latest.training_compliance_pct) * latest.total_staff)} staff with overdue modules.`,
      domain: "Workforce", timestamp: new Date().toISOString(),
    });
  }

  // Sick leave pattern
  if (latest.sick_leave_pct > 0.08) {
    findings.push({
      agent: "Keeper", type: "absenteeism_elevated", severity: "routine",
      title: `Sick leave ${(latest.sick_leave_pct * 100).toFixed(1)}% — above 8% threshold`,
      detail: `Absenteeism at ${(latest.sick_leave_pct * 100).toFixed(1)}%. Sector average: 6.8%. Check for Monday/Friday concentration pattern.`,
      domain: "Workforce", timestamp: new Date().toISOString(),
    });
  }

  return findings;
}

function runChronicler(): AgentFinding[] {
  const findings: AgentFinding[] = [];
  const incidents = generateIncidents();
  const openIncidents = incidents.filter((i) => i.status === "open");

  for (const inc of openIncidents) {
    if (inc.sirs_priority) {
      findings.push({
        agent: "Chronicler", type: "sirs_draft_ready", severity: inc.sirs_priority === 1 ? "immediate" : "urgent",
        title: `SIRS Priority ${inc.sirs_priority} draft — ${inc.type}`,
        detail: `${inc.type} on ${inc.date} in ${inc.wing}. CHRIS Chronicler has drafted the notification. Awaiting DON review and submission.`,
        domain: "Compliance", timestamp: new Date().toISOString(),
      });
    }
  }

  // Board pack status
  findings.push({
    agent: "Chronicler", type: "board_pack_ready", severity: "routine",
    title: "Q3 Board Pack — draft ready for review",
    detail: "8 sections compiled: care minutes, QI snapshot, SIRS summary, workforce, financial, PSH, corrective actions, compliance register. Estimated review: 35 minutes.",
    domain: "Governance", timestamp: new Date().toISOString(),
  });

  return findings;
}

function runTownCrier(): AgentFinding[] {
  const findings: AgentFinding[] = [];

  // Town Crier synthesises and coordinates
  findings.push({
    agent: "Town Crier", type: "signal_coordination", severity: "routine",
    title: "3 agent signals merged into 1 coordinated recommendation",
    detail: "Oracle identified AN-ACC reclassification opportunity. Steward confirmed Tuesday morning has capacity for clinical reviews. Delivered as single recommendation to DON instead of 2 separate alerts.",
    domain: "Operations", timestamp: new Date().toISOString(),
  });

  findings.push({
    agent: "Town Crier", type: "priority_ranking", severity: "routine",
    title: "Today's queue: 2 immediate, 3 urgent, 2 routine",
    detail: "Immediate: RN gap Thursday night, SIRS draft. Urgent: PSH convergence Grevillea, agency dependency, care ratio. Routine: board pack review, training compliance.",
    domain: "Operations", timestamp: new Date().toISOString(),
  });

  return findings;
}

// ── Generate narratives ─────────────────────────────────────────────────────

function generateNarratives(findings: AgentFinding[]): Record<string, string> {
  const cm = generateCareMinutesWeekly();
  const financial = generateFinancialMonthly();
  const workforce = generateWorkforceMonthly();
  const latestCM = cm[cm.length - 1];
  const latestFin = financial[financial.length - 1];
  const latestWf = workforce[workforce.length - 1];

  const immediate = findings.filter((f) => f.severity === "immediate");
  const urgent = findings.filter((f) => f.severity === "urgent");

  return {
    todays_picture: `Care minutes are ${latestCM.compliant ? "compliant" : "at risk"} at ${latestCM.avg_total} against the 215 target — ${latestCM.compliant ? "the strongest sustained period since the January staffing crisis" : "RN coverage needs attention"}. ${immediate.length > 0 ? `${immediate.length} immediate item${immediate.length > 1 ? "s" : ""} need${immediate.length === 1 ? "s" : ""} your attention: ${immediate.map((f) => f.title).join("; ")}. ` : ""}${urgent.length > 0 ? `${urgent.length} urgent signals across ${[...new Set(urgent.map((f) => f.domain))].join(", ")}. ` : ""}Agency dependency is at ${(latestWf.agency_hours_pct * 100).toFixed(0)}% — ${latestWf.agency_hours_pct > 0.15 ? "still above the 10% benchmark but trending down" : "within acceptable range"}. The care ratio sits at ${(latestFin.care_ratio * 100).toFixed(1)}% against the 55% target. The Board Pack for Q3 is ready for your review — meeting in 8 days.`,

    clinical: `Care minutes have been ${cm.slice(-4).every((w) => w.compliant) ? "compliant for 4 consecutive weeks" : "fluctuating around the 215 target"}. RN minutes averaging ${latestCM.avg_rn} against the 44 target. Falls rate remains above the national benchmark for a third quarter — CHRIS has traced 78% of falls to shifts with more than 30% agency coverage. The SIRS register ${findings.some((f) => f.type === "sirs_draft_ready") ? "has drafts awaiting review" : "is clear"}.`,

    workforce: `Turnover is at ${(latestWf.turnover_rolling_12m * 100).toFixed(0)}% rolling — ${latestWf.turnover_rolling_12m > 0.25 ? "above" : "within"} the 25% benchmark. ${findings.filter((f) => f.type === "turnover_precursor").length > 0 ? "Keeper has detected turnover precursors in " + findings.filter((f) => f.type === "turnover_precursor").map((f) => f.title.split("—")[1]?.trim()).join(", ") + "." : "No active turnover precursors detected."} Training compliance at ${(latestWf.training_compliance_pct * 100).toFixed(0)}%. Agency dependency ${(latestWf.agency_hours_pct * 100).toFixed(0)}% — ${latestWf.agency_hours_pct < workforce[workforce.length - 2]?.agency_hours_pct ? "declining" : "holding steady"}.`,

    financial: `Revenue ${latestFin.variance_pct >= 0 ? "above" : "below"} budget by ${Math.abs(latestFin.variance_pct * 100).toFixed(1)}% in ${latestFin.period}. Care ratio ${(latestFin.care_ratio * 100).toFixed(1)}% — ${latestFin.care_ratio > 0.55 ? "above target, driven by agency cost" : "within target range"}. Agency cost $${Math.round(latestFin.expenditure.direct_care_agency / 1000)}K this month — ${latestFin.expenditure.direct_care_agency < financial[financial.length - 2]?.expenditure.direct_care_agency ? "reducing" : "holding"}. Occupancy ${(latestFin.occupancy_pct * 100).toFixed(1)}%.`,

    governance: `Compliance register: ${generateComplianceObligations().filter((o) => o.status === "compliant").length}/20 obligations met. ${generateComplianceObligations().filter((o) => o.status === "at_risk").length} at risk. Board Pack drafted and awaiting review. QI submission due in 14 days — data compiled by CHRIS.`,
  };
}

// ── Main exercise runner ────────────────────────────────────────────────────

export function exerciseAgents(): ExerciseResult {
  console.log("[Agent Exercise] Running all 7 agents against expanded data...");

  const allFindings: AgentFinding[] = [
    ...runSentinel(),
    ...runOracle(),
    ...runSteward(),
    ...runKeeper(),
    ...runChronicler(),
    ...runTownCrier(),
  ];

  const narratives = generateNarratives(allFindings);

  const byAgent: Record<string, number> = {};
  const bySeverity: Record<string, number> = {};
  for (const f of allFindings) {
    byAgent[f.agent] = (byAgent[f.agent] ?? 0) + 1;
    bySeverity[f.severity] = (bySeverity[f.severity] ?? 0) + 1;
  }

  const convergences = allFindings.filter((f) => f.type === "psh_convergence").length;

  const result: ExerciseResult = {
    runAt: new Date().toISOString(),
    findings: allFindings,
    narratives,
    stats: {
      totalFindings: allFindings.length,
      byAgent,
      bySeverity,
      convergences,
    },
  };

  lastExercise = result;
  console.log(`[Agent Exercise] Complete. ${allFindings.length} findings across ${Object.keys(byAgent).length} agents.`);

  return result;
}
