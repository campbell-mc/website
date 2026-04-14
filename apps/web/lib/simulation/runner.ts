// lib/simulation/runner.ts
// Tick-based scenario execution engine.
// Seeds world → applies events → invokes agents → collects findings.

import { SimWorld } from './world';
import { evaluateThresholds, type ConnectorDataEvent, type ThresholdEvaluation } from '@/lib/agents/sentinel-router';
import AGED_CARE_KNOWLEDGE from '@/lib/chris/aged-care-knowledge';
import type { Scenario, ScenarioResult, AgentFinding, AgentAction, AgentType } from './types';

/**
 * Run a single scenario through the simulation engine.
 * Returns findings and actions for judging.
 */
export async function runScenario(scenario: Scenario): Promise<ScenarioResult> {
  const startTime = Date.now();
  const world = new SimWorld(scenario.world);
  const findings: AgentFinding[] = [];
  const actions: AgentAction[] = [];

  try {
    for (let tick = 0; tick < scenario.duration_ticks; tick++) {
      // 1. Advance world time
      world.tickTime();

      // 2. Apply scenario events for this tick
      const tickEvents = scenario.events.filter((e) => e.tick === tick);
      for (const event of tickEvents) {
        world.apply(event, tick);
      }

      // 3. Run agents that should fire this tick
      for (const agentType of scenario.agents) {
        if (shouldRunAgent(agentType, tick, scenario)) {
          const agentFindings = await invokeAgent(agentType, world, tick);
          findings.push(...agentFindings.findings);
          actions.push(...agentFindings.actions);
        }
      }
    }
  } catch (error) {
    return {
      scenario,
      findings,
      actions,
      ticks_run: scenario.duration_ticks,
      duration_ms: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error),
    };
  }

  return {
    scenario,
    findings,
    actions,
    ticks_run: scenario.duration_ticks,
    duration_ms: Date.now() - startTime,
  };
}

/**
 * Determine if an agent should run at this tick.
 * Sentinel: every tick (always-on monitoring).
 * Oracle: only on tick 0 (weekly scan — simulated as single invocation).
 * Steward: tick 0 (daily — simulated as single invocation).
 * Keeper: tick 0 (fortnightly — simulated as single invocation).
 * Town Crier: every 2 ticks (15-min coordination cycle).
 * Chronicler: event-driven (fires when events exist in the tick).
 */
function shouldRunAgent(agent: AgentType, tick: number, scenario: Scenario): boolean {
  switch (agent) {
    case 'sentinel': return true;  // Every tick
    case 'oracle': return tick === 0;
    case 'steward': return tick === 0;
    case 'keeper': return tick === 0;
    case 'town_crier': return tick % 2 === 0;
    case 'chronicler': return scenario.events.some((e) => e.tick === tick && (e.type === 'incident_logged' || e.type === 'sirs_event'));
    default: return false;
  }
}

/**
 * Invoke an agent against the current world state.
 * Uses the sentinel-router's evaluateThresholds for Sentinel (deterministic).
 * Other agents use simplified detection logic based on world state.
 */
async function invokeAgent(
  agentType: AgentType,
  world: SimWorld,
  tick: number,
): Promise<{ findings: AgentFinding[]; actions: AgentAction[] }> {
  const findings: AgentFinding[] = [];
  const actions: AgentAction[] = [];

  const careType = world.facility.care_type;

  switch (agentType) {
    case 'sentinel':
      findings.push(...runSentinelScan(world, tick, careType));
      break;
    case 'oracle':
      findings.push(...runOracleScan(world, tick));
      break;
    case 'keeper':
      findings.push(...runKeeperScan(world, tick));
      break;
    case 'steward':
      findings.push(...runStewardScan(world, tick));
      break;
    case 'chronicler':
      actions.push(...runChroniclerScan(world, tick));
      break;
    case 'town_crier':
      // Town Crier processes findings but doesn't generate new ones
      break;
  }

  return { findings, actions };
}

// ── SENTINEL SCAN ────────────────────────────────────────────

function runSentinelScan(world: SimWorld, tick: number, careType: string = 'residential'): AgentFinding[] {
  const findings: AgentFinding[] = [];
  const isResidential = careType === 'residential';
  const km = AGED_CARE_KNOWLEDGE.care_minutes;

  // Care minutes check — RESIDENTIAL ONLY (home care uses visit hours, not care minutes)
  if (isResidential && world.care_minutes.projected_total < km.total_minutes_per_resident_day * km.chris_critical_threshold_pct) {
    findings.push({
      agent: 'sentinel', type: 'care_minutes_critical', severity: 'immediate',
      title: 'Care minutes below critical threshold',
      detail: `Projected ${world.care_minutes.projected_total} min — below ${km.total_minutes_per_resident_day * km.chris_critical_threshold_pct} critical`,
      tick,
    });
  } else if (isResidential && world.care_minutes.projected_total < km.total_minutes_per_resident_day * km.chris_alert_threshold_pct) {
    findings.push({
      agent: 'sentinel', type: 'care_minutes_at_risk', severity: 'urgent',
      title: 'Care minutes at risk',
      detail: `Projected ${world.care_minutes.projected_total} min — below ${km.total_minutes_per_resident_day * km.chris_alert_threshold_pct} alert`,
      tick,
    });
  }

  // RN minutes check — RESIDENTIAL ONLY
  if (isResidential && world.care_minutes.rn_minutes < km.rn_minutes_per_resident_day * km.chris_critical_threshold_pct) {
    findings.push({
      agent: 'sentinel', type: 'rn_gap_tonight', severity: 'immediate',
      title: 'RN minutes below critical threshold',
      detail: `RN minutes ${world.care_minutes.rn_minutes} — critical`,
      tick,
    });
  }

  // SIRS deadline check
  for (const sirs of world.sirs_open) {
    const thresholds = AGED_CARE_KNOWLEDGE.sirs.chris_alert_thresholds;
    if (sirs.category === 1 && sirs.hours_remaining <= thresholds.cat1_hours_remaining_urgent) {
      findings.push({
        agent: 'sentinel', type: 'sirs_deadline_approaching', severity: 'immediate',
        title: `SIRS Cat 1 — ${sirs.hours_remaining.toFixed(1)}h remaining`,
        detail: `${sirs.incident_type} deadline approaching. ${sirs.hours_remaining.toFixed(1)} hours left.`,
        tick,
      });
    } else if (sirs.category === 2 && sirs.hours_remaining <= thresholds.cat2_days_remaining_urgent * 24) {
      findings.push({
        agent: 'sentinel', type: 'sirs_deadline_approaching', severity: 'urgent',
        title: `SIRS Cat 2 — ${Math.round(sirs.hours_remaining / 24)}d remaining`,
        detail: `${sirs.incident_type} deadline approaching.`,
        tick,
      });
    }
  }

  // Connector health
  for (const conn of world.connectors) {
    if (conn.last_sync_hours_ago > 12) {
      findings.push({
        agent: 'sentinel', type: 'connector_stale', severity: conn.last_sync_hours_ago > 24 ? 'urgent' : 'routine',
        title: `${conn.name} data ${conn.last_sync_hours_ago.toFixed(0)}h stale`,
        detail: `Connector ${conn.name} last synced ${conn.last_sync_hours_ago.toFixed(0)} hours ago`,
        tick,
      });
    }
  }

  // Compliance check
  for (const comp of world.compliance) {
    if (comp.days_remaining <= 3 && comp.status !== 'compliant') {
      findings.push({
        agent: 'sentinel', type: 'compliance_deadline', severity: comp.days_remaining <= 1 ? 'immediate' : 'urgent',
        title: `${comp.name} — ${Math.round(comp.days_remaining)}d remaining`,
        detail: `Compliance obligation due in ${Math.round(comp.days_remaining)} days`,
        tick,
      });
    }
  }

  // PSH convergence — check for 2+ elevated domains in same team
  for (const [teamId, scores] of Object.entries(world.psh_scores)) {
    const elevated = Object.entries(scores).filter(([, s]) => s >= AGED_CARE_KNOWLEDGE.psh.thresholds.elevated);
    if (elevated.length >= AGED_CARE_KNOWLEDGE.psh.convergence.domains_required) {
      findings.push({
        agent: 'sentinel', type: 'psh_convergence', severity: 'urgent',
        title: `PSH convergence — ${teamId}: ${elevated.map(([d]) => d).join(', ')}`,
        detail: `${elevated.length} PSH domains elevated in ${teamId}`,
        tick,
      });
    }
  }

  // RN roster gap — RESIDENTIAL ONLY (home care doesn't have shift-based RN coverage)
  if (isResidential) for (const shift of world.roster) {
    if (!shift.rn_confirmed) {
      findings.push({
        agent: 'sentinel', type: 'rn_gap_tonight', severity: 'immediate',
        title: `RN gap — ${shift.shift} shift`,
        detail: `No RN confirmed for ${shift.shift} shift`,
        tick,
      });
    }
  }

  return findings;
}

// ── ORACLE SCAN ──────────────────────────────────────────────

function runOracleScan(world: SimWorld, tick: number): AgentFinding[] {
  const findings: AgentFinding[] = [];

  if (world.financial.vacant_beds > 0) {
    findings.push({
      agent: 'oracle', type: 'vacant_bed_revenue_loss', severity: 'medium' as any,
      title: `${world.financial.vacant_beds} vacant beds — revenue loss`,
      detail: `${world.financial.vacant_beds} vacant at ~$420/bed/day`,
      tick,
    });
  }

  if (world.financial.care_ratio > 0.70) {
    findings.push({
      agent: 'oracle', type: 'care_ratio_above_benchmark', severity: 'routine',
      title: `Care ratio ${(world.financial.care_ratio * 100).toFixed(1)}% — above 70% sector avg`,
      detail: `Labour cost as % of care revenue above StewartBrown sector average`,
      tick,
    });
  }

  return findings;
}

// ── KEEPER SCAN ──────────────────────────────────────────────

function runKeeperScan(world: SimWorld, tick: number): AgentFinding[] {
  const findings: AgentFinding[] = [];

  if (world.workforce.credentials_expiring_30d > 0) {
    findings.push({
      agent: 'keeper', type: 'credentials_expiring', severity: 'urgent',
      title: `${world.workforce.credentials_expiring_30d} credentials expiring in 30 days`,
      detail: `AHPRA/WWVP registrations expiring — care minutes compliance at risk`,
      tick,
    });
  }

  if (world.workforce.turnover_pct > 28) {
    findings.push({
      agent: 'keeper', type: 'turnover_elevated', severity: 'routine',
      title: `Turnover ${world.workforce.turnover_pct}% — above 28% alert`,
      detail: `Rolling 12-month turnover above CHRIS alert threshold`,
      tick,
    });
  }

  // Check for PSH_13 decline (turnover precursor)
  for (const [teamId, scores] of Object.entries(world.psh_scores)) {
    if (scores.PSH_13 && scores.PSH_13 >= 0.60) {
      findings.push({
        agent: 'keeper', type: 'turnover_precursor', severity: 'urgent',
        title: `Turnover precursor — ${teamId}`,
        detail: `PSH_13 (Low Recognition) elevated at ${scores.PSH_13} — 71% probability within 4-6 cycles`,
        tick,
      });
    }
  }

  return findings;
}

// ── STEWARD SCAN ─────────────────────────────────────────────

function runStewardScan(world: SimWorld, tick: number): AgentFinding[] {
  const findings: AgentFinding[] = [];

  // Agency dependency
  if (world.workforce.agency_pct > 15) {
    findings.push({
      agent: 'steward', type: 'agency_above_threshold', severity: world.workforce.agency_pct > 25 ? 'urgent' : 'routine',
      title: `Agency ${world.workforce.agency_pct}% — above 15% threshold`,
      detail: `Agency dependency above CHRIS alert threshold`,
      tick,
    });
  }

  // Roster gaps
  const totalGaps = world.roster.reduce((sum, s) => sum + s.gaps, 0);
  if (totalGaps > 0) {
    findings.push({
      agent: 'steward', type: 'roster_gaps', severity: 'urgent',
      title: `${totalGaps} roster gap${totalGaps > 1 ? 's' : ''} today`,
      detail: `Unfilled shifts requiring cover`,
      tick,
    });
  }

  return findings;
}

// ── CHRONICLER SCAN ──────────────────────────────────────────

function runChroniclerScan(world: SimWorld, tick: number): AgentAction[] {
  const actions: AgentAction[] = [];

  // Check if any SIRS items need drafts
  for (const sirs of world.sirs_open) {
    if (sirs.status === 'logged' || sirs.status === 'assessed') {
      actions.push({
        agent: 'chronicler', type: 'chronicler_draft',
        description: `Draft SIRS Cat ${sirs.category} notification for ${sirs.incident_type}`,
        tick,
      });
    }
  }

  return actions;
}
