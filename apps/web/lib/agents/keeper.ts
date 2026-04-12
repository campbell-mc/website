// lib/agents/keeper.ts
// Maintained by Ivan Sanchez
// The Keeper — fortnightly workforce intelligence agent for CHRIS
//
// Runs fortnightly aligned with PSH cycle close, plus daily lightweight scan.
// Watches the people who deliver the care — turnover precursors, absenteeism
// patterns, composition drift, award compliance, leadership effectiveness,
// succession risk. Sees exits coming before they happen.
//
// Triggered by calling runKeeper(facilityId, data)
// Ivan wires to the fortnightly schedule aligned with PSH cycle close.

import { callClaudeText } from '@/lib/anthropic/client';
import { getKeeperPrompt } from '@/lib/agents/prompts/keeper';
import AGED_CARE_KNOWLEDGE from '@/lib/chris/aged-care-knowledge';

// ── TYPES ─────────────────────────────────────────────────────

export interface KeeperFinding {
  type: string;
  signal_strength: 'confirmed_risk' | 'early_signal' | 'watch';
  severity: 'immediate' | 'urgent' | 'routine';
  domain: 'turnover' | 'absenteeism' | 'composition' | 'award' | 'leadership' | 'succession';
  title: string;
  description: string;
  facility_id: string;
  team_id?: string;
  team_name?: string;
  role?: string;
  psh_domains?: string[];
  cycles_detected?: number;
  estimated_cost_if_unaddressed?: number;
  correlation?: number;
  recommended_action: string;
  route?: string;
  notify_roles: string[];
  notify_via: 'imessage' | 'in_app' | 'both';
  publish_event?: string;
  event_payload?: Record<string, unknown>;
}

export interface PSHCycleSnapshot {
  cycle_id: string;
  cycle_label: string;
  team_scores: Record<string, {
    team_name: string;
    team_size: number;
    dominant_role: string;
    participation_rate: number;
    domain_scores: Record<string, number>;
    loop_completion?: number;
  }>;
}

export interface AbsenceRecord {
  team_name: string;
  role: string;
  absence_date: string;
  absence_type: string;
  shift_type: string;
}

export interface StaffSnapshot {
  team_id: string;
  team_name: string;
  role: string;
  tenure_years: number;
  employment_type: string;
  permanent_pct: number;
  agency_pct: number;
  team_size: number;
  can_cover_roles?: string[];
}

export interface RosterShiftRecord {
  shift_type: string;
  role: string;
  shift_duration_hours?: number;
  break_taken?: boolean;
  overtime_hours?: number;
}

export interface KeeperData {
  careType: 'residential' | 'home_care' | 'ndis';
  pshCycles?: PSHCycleSnapshot[];
  absences?: AbsenceRecord[];
  staffSnapshots?: StaffSnapshot[];
  rosterData?: RosterShiftRecord[];
}

export interface KeeperReport {
  findings: KeeperFinding[];
  confirmedRisks: KeeperFinding[];
  earlySignals: KeeperFinding[];
  watching: KeeperFinding[];
  narrative: string;
}

// ── MAIN RUNNER ───────────────────────────────────────────────

export async function runKeeper(facilityId: string, data: KeeperData): Promise<KeeperReport> {
  const startTime = Date.now();

  const [turnover, absenteeism, engagement, composition, award, leadership, succession] = await Promise.all([
    scanTurnoverPrecursors(facilityId, data),
    scanAbsenteeismPatterns(facilityId, data),
    scanEngagementTrajectory(facilityId, data),
    scanCompositionDrift(facilityId, data),
    scanAwardCompliance(facilityId, data),
    scanLeadershipEffectiveness(facilityId, data),
    scanSuccessionRisk(facilityId, data),
  ]);

  const allFindings = [...turnover, ...absenteeism, ...engagement, ...composition, ...award, ...leadership, ...succession];
  const confirmedRisks = allFindings.filter((f) => f.signal_strength === 'confirmed_risk');
  const earlySignals = allFindings.filter((f) => f.signal_strength === 'early_signal');
  const watching = allFindings.filter((f) => f.signal_strength === 'watch');

  const narrative = await generateKeeperNarrative(facilityId, allFindings, data.careType);

  const durationMs = Date.now() - startTime;
  console.log(`[Keeper] ${facilityId} | ${confirmedRisks.length} confirmed, ${earlySignals.length} early, ${watching.length} watch | ${durationMs}ms`);

  // TODO: Ivan — write to keeper_reports table
  // TODO: Ivan — deliver queue items to FM/HR
  // TODO: Ivan — publish keeper events for Town Crier / Oracle

  return { findings: allFindings, confirmedRisks, earlySignals, watching, narrative };
}

// ── TURNOVER PRECURSOR DETECTION ──────────────────────────────

async function scanTurnoverPrecursors(facilityId: string, data: KeeperData): Promise<KeeperFinding[]> {
  const findings: KeeperFinding[] = [];
  if (!data.pshCycles || data.pshCycles.length < 3) return findings;

  const turnoverConfig = AGED_CARE_KNOWLEDGE.psh.turnover_precursors;
  const costBenchmarks = AGED_CARE_KNOWLEDGE.financial.workforce_cost_benchmarks;
  const teamHistory = buildTeamPSHHistory(data.pshCycles);

  for (const [teamId, history] of Object.entries(teamHistory)) {
    // PSH_13 declining 3+ consecutive cycles
    const psh13Values = history.map((c) => c.PSH_13).filter((v): v is number => v != null);
    const declineCycles = countConsecutiveDecline(psh13Values);

    if (declineCycles >= turnoverConfig.PSH_13_consecutive_decline_cycles) {
      const teamSize = history[0]?.team_size ?? 10;
      const role = history[0]?.dominant_role ?? 'ain';
      const costLow = getExitCost(role, 'low', costBenchmarks);
      const costHigh = getExitCost(role, 'high', costBenchmarks);

      findings.push({
        type: 'turnover_precursor_psh13',
        signal_strength: declineCycles >= 4 ? 'confirmed_risk' : 'early_signal',
        severity: declineCycles >= 4 ? 'urgent' : 'routine',
        domain: 'turnover',
        title: `Turnover precursor — ${history[0]?.team_name ?? teamId}`,
        description: `PSH_13 (Low Recognition) has declined for ${declineCycles} consecutive cycles in ${history[0]?.team_name ?? teamId}. Research indicates ${Math.round(turnoverConfig.exit_correlation * 100)}% probability of a voluntary exit in the next ${turnoverConfig.exit_window_cycles} cycles. Estimated cost if one exit occurs: ${fmtRange(costLow, costHigh)}.`,
        facility_id: facilityId,
        team_id: teamId, team_name: history[0]?.team_name ?? teamId,
        psh_domains: ['PSH_13'], cycles_detected: declineCycles,
        estimated_cost_if_unaddressed: teamSize * 0.2 * ((costLow + costHigh) / 2),
        correlation: turnoverConfig.exit_correlation,
        recommended_action: `FM direct conversation with ${history[0]?.team_name ?? teamId} Team Leader this week — focus on recognition practices. Recommend Micro-Practice MP_013.`,
        route: '/dashboard/psh',
        notify_roles: ['facility_manager', 'don'],
        notify_via: declineCycles >= 4 ? 'both' : 'in_app',
        publish_event: 'keeper.turnover_precursor',
        event_payload: { team_id: teamId, psh_domain: 'PSH_13', cycles: declineCycles },
      });
    }

    // Multi-domain decline (PSH_13 + PSH_02 + PSH_01)
    const multiDecline = detectMultiDomainDecline(history, ['PSH_13', 'PSH_02', 'PSH_01'], 2);
    if (multiDecline.detected && multiDecline.count >= 2) {
      findings.push({
        type: 'turnover_precursor_multi_domain',
        signal_strength: 'confirmed_risk',
        severity: 'urgent',
        domain: 'turnover',
        title: `High flight risk — ${history[0]?.team_name ?? teamId}`,
        description: `${multiDecline.count} PSH domains declining simultaneously in ${history[0]?.team_name ?? teamId}: ${multiDecline.domains.join(', ')}. Multi-domain decline is the strongest combined turnover predictor. Estimated exit probability in next 6 cycles: 84%.`,
        facility_id: facilityId,
        team_id: teamId, team_name: history[0]?.team_name ?? teamId,
        psh_domains: multiDecline.domains, cycles_detected: 2,
        estimated_cost_if_unaddressed: (history[0]?.team_size ?? 10) * 0.3 * ((costBenchmarks.ain_exit_cost_low + costBenchmarks.ain_exit_cost_high) / 2),
        correlation: 0.84,
        recommended_action: 'Escalate to FM immediately — multi-domain decline requires coordinated intervention. Review with CHRIS Coach before approaching the team.',
        route: '/dashboard/psh',
        notify_roles: ['facility_manager', 'don', 'whs_lead'],
        notify_via: 'both',
        publish_event: 'keeper.high_flight_risk',
        event_payload: { team_id: teamId, declining_domains: multiDecline.domains },
      });
    }
  }

  return findings;
}

// ── ABSENTEEISM PATTERNS ──────────────────────────────────────

async function scanAbsenteeismPatterns(facilityId: string, data: KeeperData): Promise<KeeperFinding[]> {
  const findings: KeeperFinding[] = [];
  if (!data.absences || data.absences.length === 0) return findings;

  // Monday/Friday clustering
  const monCount = data.absences.filter((a) => new Date(a.absence_date).getDay() === 1).length;
  const friCount = data.absences.filter((a) => new Date(a.absence_date).getDay() === 5).length;
  const midCount = data.absences.filter((a) => { const d = new Date(a.absence_date).getDay(); return d >= 2 && d <= 4; }).length;
  const monFriAvg = (monCount + friCount) / 2;
  const midAvg = midCount / 3;
  const ratio = midAvg > 0 ? monFriAvg / midAvg : 0;

  if (ratio > 1.5) {
    findings.push({
      type: 'absenteeism_day_clustering',
      signal_strength: 'early_signal',
      severity: 'routine',
      domain: 'absenteeism',
      title: 'Monday/Friday absenteeism clustering detected',
      description: `Monday and Friday absences are ${Math.round(ratio * 100 - 100)}% above the Tuesday-Thursday baseline over 90 days. This pattern indicates staff managing workload stress by extending weekends — a culture signal, not random health events. Often correlates with PSH_03 and PSH_06.`,
      facility_id: facilityId,
      recommended_action: 'Cross-reference with PSH scores for teams showing this pattern',
      route: '/dashboard/workforce',
      notify_roles: ['facility_manager', 'hr_manager'],
      notify_via: 'in_app',
    });
  }

  // Team concentration
  const byTeam: Record<string, number> = {};
  for (const a of data.absences) { byTeam[a.team_name] = (byTeam[a.team_name] ?? 0) + 1; }
  const sorted = Object.entries(byTeam).sort(([, a], [, b]) => b - a);
  if (sorted.length >= 3) {
    const [topTeam, topCount] = sorted[0];
    const pct = topCount / data.absences.length;
    if (pct > 0.40) {
      findings.push({
        type: 'absenteeism_team_concentration',
        signal_strength: 'early_signal',
        severity: 'routine',
        domain: 'absenteeism',
        title: `Absenteeism concentrated in ${topTeam}`,
        description: `${topTeam} accounts for ${Math.round(pct * 100)}% of all facility absences over 90 days despite being one of ${sorted.length} teams. This is a team-level issue, not facility-wide. Estimated quarterly cost: ${fmtCurrency(topCount * 250)}.`,
        facility_id: facilityId,
        team_name: topTeam,
        estimated_cost_if_unaddressed: topCount * 250 * 4,
        recommended_action: `FM check-in with ${topTeam} Team Leader — understand what is driving absence in this team`,
        route: '/dashboard/workforce',
        notify_roles: ['facility_manager', 'hr_manager'],
        notify_via: 'in_app',
        publish_event: 'keeper.absenteeism_concentration',
        event_payload: { team_name: topTeam, concentration_pct: pct },
      });
    }
  }

  return findings;
}

// ── ENGAGEMENT TRAJECTORY ─────────────────────────────────────

async function scanEngagementTrajectory(facilityId: string, data: KeeperData): Promise<KeeperFinding[]> {
  const findings: KeeperFinding[] = [];
  if (!data.pshCycles || data.pshCycles.length < 2) return findings;

  const teamHistory = buildTeamParticipationHistory(data.pshCycles);

  for (const [teamId, history] of Object.entries(teamHistory)) {
    const rates = history.map((c) => c.participation_rate);
    const current = rates[0];
    const decline = countConsecutiveDecline(rates);

    if (decline >= 2 && current < 0.50) {
      findings.push({
        type: 'engagement_withdrawal',
        signal_strength: 'early_signal',
        severity: 'routine',
        domain: 'turnover',
        title: `Engagement withdrawal — ${history[0]?.team_name ?? teamId}`,
        description: `Pulse participation declined ${decline} consecutive cycles to ${Math.round(current * 100)}%. Participation decline precedes score decline by 1-2 cycles — this is the earliest disengagement signal. The team is opting out before voicing concerns.`,
        facility_id: facilityId,
        team_id: teamId, team_name: history[0]?.team_name ?? teamId,
        cycles_detected: decline,
        recommended_action: 'Team Leader to explicitly encourage pulse participation — frame as the team\'s voice, not a management tool',
        route: '/dashboard/workforce',
        notify_roles: ['don', 'facility_manager'],
        notify_via: 'in_app',
      });
    }
  }

  return findings;
}

// ── COMPOSITION DRIFT ─────────────────────────────────────────

async function scanCompositionDrift(facilityId: string, data: KeeperData): Promise<KeeperFinding[]> {
  const findings: KeeperFinding[] = [];
  if (!data.staffSnapshots || data.staffSnapshots.length < 3) return findings;

  const byTeam = groupByTeam(data.staffSnapshots);

  for (const [teamId, snapshots] of Object.entries(byTeam)) {
    const permTrend = snapshots.map((s) => s.permanent_pct);
    const agencyTrend = snapshots.map((s) => s.agency_pct);
    const currentPerm = permTrend[0];
    const currentAgency = agencyTrend[0];
    const decline = countConsecutiveDecline(permTrend);

    if (decline >= 3 && currentPerm < 0.70) {
      const projected3m = projectTrend(agencyTrend, 3);
      const teamSize = snapshots[0]?.team_size ?? 10;
      const annualAgencyCost = currentAgency * teamSize * AGED_CARE_KNOWLEDGE.financial.workforce_cost_benchmarks.agency_ain_premium_per_shift * 52 * 5;

      findings.push({
        type: 'composition_drift',
        signal_strength: currentPerm < 0.60 ? 'confirmed_risk' : 'early_signal',
        severity: currentAgency > 0.25 ? 'urgent' : 'routine',
        domain: 'composition',
        title: `Workforce composition drift — ${snapshots[0]?.team_name ?? teamId}`,
        description: `Permanent staff proportion declined ${decline} consecutive months to ${Math.round(currentPerm * 100)}%. Agency at ${Math.round(currentAgency * 100)}%. Projected agency in 3 months: ${Math.round(projected3m * 100)}%. Resident voice data shows staff consistency as a care quality concern.`,
        facility_id: facilityId,
        team_id: teamId, team_name: snapshots[0]?.team_name ?? teamId,
        estimated_cost_if_unaddressed: annualAgencyCost,
        recommended_action: `Accelerate permanent recruitment for ${snapshots[0]?.team_name ?? teamId} before composition drift becomes structural`,
        route: '/dashboard/workforce',
        notify_roles: ['facility_manager', 'hr_manager'],
        notify_via: 'in_app',
        publish_event: 'keeper.composition_drift',
        event_payload: { team_id: teamId, current_permanent_pct: currentPerm, current_agency_pct: currentAgency },
      });
    }
  }

  return findings;
}

// ── AWARD COMPLIANCE ──────────────────────────────────────────

async function scanAwardCompliance(facilityId: string, data: KeeperData): Promise<KeeperFinding[]> {
  const findings: KeeperFinding[] = [];
  if (!data.rosterData || data.rosterData.length === 0) return findings;

  // Break violations
  const breakViolations = data.rosterData.filter((s) => (s.shift_duration_hours ?? 0) > 10 && !s.break_taken);
  if (breakViolations.length > 0) {
    const roles = [...new Set(breakViolations.map((v) => v.role))];
    const shifts = [...new Set(breakViolations.map((v) => v.shift_type))];
    findings.push({
      type: 'award_break_violations',
      signal_strength: breakViolations.length > 3 ? 'confirmed_risk' : 'early_signal',
      severity: 'urgent',
      domain: 'award',
      title: `${breakViolations.length} potential award break violations — 30 days`,
      description: `${breakViolations.length} shifts exceeded 10 hours without a recorded break. Fair Work Act requires meal breaks for shifts over 5 hours. Legal exposure under Aged Care Award. Pattern: ${roles.join(', ')} on ${shifts.join(', ')} shifts.`,
      facility_id: facilityId,
      recommended_action: 'Review rostering practices — break obligations must be met regardless of staffing pressure',
      route: '/dashboard/workforce',
      notify_roles: ['facility_manager', 'hr_manager'],
      notify_via: 'both',
    });
  }

  // Systematic overtime
  const overtimeShifts = data.rosterData.filter((s) => (s.overtime_hours ?? 0) > 0);
  const totalOT = overtimeShifts.reduce((sum, s) => sum + (s.overtime_hours ?? 0), 0);
  const avgOTPerWeek = totalOT / 4;

  if (avgOTPerWeek > 20) {
    findings.push({
      type: 'systematic_overtime',
      signal_strength: avgOTPerWeek > 40 ? 'confirmed_risk' : 'early_signal',
      severity: avgOTPerWeek > 40 ? 'urgent' : 'routine',
      domain: 'award',
      title: `Systematic overtime — ${Math.round(avgOTPerWeek)}h/week average`,
      description: `${Math.round(avgOTPerWeek)} hours overtime per week over 30 days. Systematic overtime indicates structural under-resourcing. Strongest driver of PSH_01 (High Job Demands) and leading turnover precursor. Annual premium: ${fmtCurrency(avgOTPerWeek * 52 * 35)}.`,
      facility_id: facilityId,
      estimated_cost_if_unaddressed: avgOTPerWeek * 52 * 35,
      recommended_action: 'Refer to The Steward for roster architecture analysis — systematic overtime needs a design response',
      route: '/dashboard/workforce',
      notify_roles: ['facility_manager', 'hr_manager'],
      notify_via: 'in_app',
      publish_event: 'keeper.systematic_overtime',
      event_payload: { avg_overtime_hours_per_week: avgOTPerWeek, psh_risk: 'PSH_01' },
    });
  }

  return findings;
}

// ── LEADERSHIP EFFECTIVENESS ──────────────────────────────────

async function scanLeadershipEffectiveness(facilityId: string, data: KeeperData): Promise<KeeperFinding[]> {
  const findings: KeeperFinding[] = [];
  if (!data.pshCycles || data.pshCycles.length < 4) return findings;

  const teamHistory = buildTeamPSHHistory(data.pshCycles);

  for (const [teamId, history] of Object.entries(teamHistory)) {
    const overallTrend = history.map((c) => {
      const scores = Object.values(c.domain_scores);
      return scores.length > 0 ? scores.reduce((s, v) => s + v, 0) / scores.length : 0;
    });

    // High effectiveness — 4+ cycles improving
    if (countConsecutiveImprovement(overallTrend) >= 4) {
      findings.push({
        type: 'leadership_high_effectiveness',
        signal_strength: 'watch',
        severity: 'routine',
        domain: 'leadership',
        title: `High-effectiveness leader — ${history[0]?.team_name ?? teamId}`,
        description: `${history[0]?.team_name ?? teamId} has shown consistent PSH improvement for ${countConsecutiveImprovement(overallTrend)} consecutive cycles. This leader's approach is producing measurable results and worth sharing with peers.`,
        facility_id: facilityId,
        team_id: teamId, team_name: history[0]?.team_name ?? teamId,
        cycles_detected: countConsecutiveImprovement(overallTrend),
        recommended_action: 'Acknowledge this leader explicitly — consider as peer mentor for struggling teams',
        route: '/dashboard/workforce',
        notify_roles: ['facility_manager'],
        notify_via: 'in_app',
      });
    }

    // Support needed — declining with low loop completion
    const decline = countConsecutiveDecline(overallTrend);
    const loopRate = history.reduce((s, h) => s + (h.loop_completion ?? 0), 0) / history.length;

    if (decline >= 3 && loopRate < 0.50) {
      findings.push({
        type: 'leadership_support_needed',
        signal_strength: 'early_signal',
        severity: 'urgent',
        domain: 'leadership',
        title: `Leader support needed — ${history[0]?.team_name ?? teamId}`,
        description: `PSH scores declined ${decline} consecutive cycles. Practice completion rate: ${Math.round(loopRate * 100)}%. Low completion with declining scores suggests the leader needs direct support, not more tools. This is a capacity and confidence issue, not a performance issue.`,
        facility_id: facilityId,
        team_id: teamId, team_name: history[0]?.team_name ?? teamId,
        cycles_detected: decline,
        recommended_action: 'FM direct check-in this week — not performance, support. Ask what would make practices easier.',
        route: '/dashboard/workforce',
        notify_roles: ['facility_manager', 'don'],
        notify_via: 'both',
        publish_event: 'keeper.leader_support_needed',
        event_payload: { team_id: teamId, decline_cycles: decline, loop_completion_rate: loopRate },
      });
    }
  }

  return findings;
}

// ── SUCCESSION RISK ───────────────────────────────────────────

async function scanSuccessionRisk(facilityId: string, data: KeeperData): Promise<KeeperFinding[]> {
  const findings: KeeperFinding[] = [];
  if (!data.staffSnapshots) return findings;

  const criticalRoles = ['clinical_coordinator', 'don', 'rn_senior', 'quality_lead'];
  const costBenchmarks = AGED_CARE_KNOWLEDGE.financial.workforce_cost_benchmarks;

  for (const role of criticalRoles) {
    const roleStaff = data.staffSnapshots.filter((s) => s.role === role);
    const backups = data.staffSnapshots.filter((s) => s.can_cover_roles?.includes(role));

    if (roleStaff.length === 1 && backups.length === 0) {
      const tenure = roleStaff[0]?.tenure_years ?? 0;
      const costHigh = getExitCost(role, 'high', costBenchmarks);

      findings.push({
        type: 'succession_single_point_of_failure',
        signal_strength: tenure > 10 ? 'confirmed_risk' : 'early_signal',
        severity: 'routine',
        domain: 'succession',
        title: `Single point of failure — ${role.replace(/_/g, ' ')}`,
        description: `One ${role.replace(/_/g, ' ')} with ${tenure} years tenure and no identified backup. If this person departs, no internal cover for a critical function. Exit cost: up to ${fmtCurrency(costHigh)} plus operational disruption.`,
        facility_id: facilityId,
        role,
        estimated_cost_if_unaddressed: costHigh,
        recommended_action: `Identify and cross-train at least one staff member in the ${role.replace(/_/g, ' ')} function`,
        route: '/dashboard/workforce',
        notify_roles: ['facility_manager', 'hr_manager'],
        notify_via: 'in_app',
      });
    }
  }

  return findings;
}

// ── NARRATIVE GENERATION ──────────────────────────────────────

async function generateKeeperNarrative(
  facilityId: string,
  findings: KeeperFinding[],
  careType: 'residential' | 'home_care' | 'ndis'
): Promise<string> {
  const confirmed = findings.filter((f) => f.signal_strength === 'confirmed_risk');
  const early = findings.filter((f) => f.signal_strength === 'early_signal');
  const watch = findings.filter((f) => f.signal_strength === 'watch');

  return callClaudeText({
    system: getKeeperPrompt(careType),
    messages: [{
      role: 'user',
      content: `Generate the fortnightly Keeper Report for the Facility Manager.

4-5 sentences. Lead with the most significant confirmed risk.
Distinguish confirmed risks from early signals.
Name teams, PSH domains, cycle counts, dollar amounts.
End with one concrete action this week.
No bullet points. No alarmism — direct but proportionate.

Confirmed risks (${confirmed.length}): ${JSON.stringify(confirmed)}
Early signals (${early.length}): ${JSON.stringify(early)}
Watching (${watch.length}): ${JSON.stringify(watch)}`,
    }],
    maxTokens: 500,
    facilityId,
    agentName: 'keeper',
    callType: 'fortnightly_report',
  });
}

// ── HELPERS ───────────────────────────────────────────────────

function buildTeamPSHHistory(cycles: PSHCycleSnapshot[]): Record<string, Array<{ team_name: string; team_size: number; dominant_role: string; domain_scores: Record<string, number>; loop_completion?: number; PSH_13?: number; PSH_02?: number; PSH_01?: number }>> {
  const history: Record<string, Array<Record<string, unknown>>> = {};
  for (const cycle of cycles) {
    for (const [teamId, scores] of Object.entries(cycle.team_scores)) {
      if (!history[teamId]) history[teamId] = [];
      history[teamId].push({
        team_name: scores.team_name,
        team_size: scores.team_size,
        dominant_role: scores.dominant_role,
        domain_scores: scores.domain_scores,
        loop_completion: scores.loop_completion,
        PSH_13: scores.domain_scores.PSH_13,
        PSH_02: scores.domain_scores.PSH_02,
        PSH_01: scores.domain_scores.PSH_01,
      });
    }
  }
  return history as Record<string, Array<{ team_name: string; team_size: number; dominant_role: string; domain_scores: Record<string, number>; loop_completion?: number; PSH_13?: number; PSH_02?: number; PSH_01?: number }>>;
}

function buildTeamParticipationHistory(cycles: PSHCycleSnapshot[]): Record<string, Array<{ team_name: string; participation_rate: number }>> {
  const history: Record<string, Array<{ team_name: string; participation_rate: number }>> = {};
  for (const cycle of cycles) {
    for (const [teamId, scores] of Object.entries(cycle.team_scores)) {
      if (!history[teamId]) history[teamId] = [];
      history[teamId].push({ team_name: scores.team_name, participation_rate: scores.participation_rate });
    }
  }
  return history;
}

function groupByTeam(snapshots: StaffSnapshot[]): Record<string, StaffSnapshot[]> {
  return snapshots.reduce((acc, s) => {
    if (!acc[s.team_id]) acc[s.team_id] = [];
    acc[s.team_id].push(s);
    return acc;
  }, {} as Record<string, StaffSnapshot[]>);
}

function countConsecutiveDecline(values: number[]): number {
  let count = 0;
  for (let i = 0; i < values.length - 1; i++) {
    if (values[i] < values[i + 1]) count++;
    else break;
  }
  return count;
}

function countConsecutiveImprovement(values: number[]): number {
  let count = 0;
  for (let i = 0; i < values.length - 1; i++) {
    if (values[i] > values[i + 1]) count++;
    else break;
  }
  return count;
}

function detectMultiDomainDecline(history: Array<Record<string, unknown>>, domains: string[], minCycles: number): { detected: boolean; domains: string[]; count: number } {
  const declining = domains.filter((d) => {
    const values = history.map((h) => h[d] as number).filter((v): v is number => v != null);
    return countConsecutiveDecline(values) >= minCycles;
  });
  return { detected: declining.length >= 2, domains: declining, count: declining.length };
}

function projectTrend(values: number[], periods: number): number {
  if (values.length < 2) return values[0] ?? 0;
  const slope = (values[0] - values[values.length - 1]) / (values.length - 1);
  return Math.max(0, Math.min(1, values[0] + slope * periods));
}

function getExitCost(role: string, tier: 'low' | 'high', benchmarks: typeof AGED_CARE_KNOWLEDGE.financial.workforce_cost_benchmarks): number {
  if (role === 'rn' || role === 'don' || role === 'rn_senior' || role === 'clinical_coordinator') return tier === 'low' ? benchmarks.rn_exit_cost_low : benchmarks.rn_exit_cost_high;
  if (role === 'en') return tier === 'low' ? benchmarks.en_exit_cost_low : benchmarks.en_exit_cost_high;
  return tier === 'low' ? benchmarks.ain_exit_cost_low : benchmarks.ain_exit_cost_high;
}

function fmtCurrency(n: number): string {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

function fmtRange(low: number, high: number): string {
  return `${fmtCurrency(low)} to ${fmtCurrency(high)}`;
}
