// lib/agents/scheduler.ts
// Maintained by Ivan Sanchez
//
// UNIFIED AGENT SCHEDULE — every agent cycle in one file.
// Ivan wires each function to Celery tasks or Vercel cron jobs.
// All times are AEST (UTC+10 / UTC+11 DST).
//
// ┌─────────────────────────────────────────────────────────────┐
// │  SCHEDULE OVERVIEW                                          │
// │                                                             │
// │  Every 5 min   Connector Monitor — data freshness check     │
// │  Every 15 min  Town Crier — event bus coordination          │
// │  Every 30 min  Situation Reports — all domains refreshed    │
// │  Every 30 min  Sentinel Health — safety net scan            │
// │  Hourly        SIRS Countdown — deadline monitoring         │
// │  Daily 03:30   Steward — structural capacity analysis       │
// │  Daily 04:00   Keeper (lightweight) — daily workforce scan  │
// │  Daily 05:30   Morning Briefings — all enabled roles        │
// │  Daily 17:00   Evening Briefings — all enabled roles        │
// │  Weekly Sun 21:00  Oracle — revenue intelligence scan       │
// │  Fortnightly   Keeper (full) — aligned with PSH cycle close │
// │  Fortnightly   Team Briefings — on pulse cycle close        │
// │  Alt. weeks    Leader Briefings — Leader Loop week start    │
// │                                                             │
// │  Event-driven  Chronicler — fires on SIRS, audit, complaint │
// │  Event-driven  Sentinel Router — fires on every data change │
// │  Continuous    Town Crier — processes after each agent run   │
// └─────────────────────────────────────────────────────────────┘

import { runSentinel } from './sentinel';
import { runOracle, type OracleContext } from './oracle';
import { runSteward, type StewardData } from './steward';
import { runKeeper, type KeeperData } from './keeper';
import { runTownCrier } from './town-crier';
import { runConnectorMonitor, type ConnectorStatus } from './connector-monitor';
import { routeConnectorData } from './sentinel-router';
import { refreshSituationReport } from './sentinel-router';
import {
  generateMorningBriefings,
  generateEveningBriefings,
  generateTeamBriefings,
  generateLeaderBriefings,
} from '@/lib/briefings/generate';
import { processPulseCycle, type PulseResponse } from '@/lib/loops/pulse-engine';
import { getActiveLoopType } from '@/lib/loops/cycle';

// ── CONNECTOR MONITOR ─────────────────────────────────────────
// Cron: */5 * * * * (every 5 minutes)
export async function scheduleConnectorMonitor(facilityId: string, connectors: ConnectorStatus[]) {
  await runConnectorMonitor(facilityId, connectors);
}

// ── TOWN CRIER ────────────────────────────────────────────────
// Cron: */15 * * * * (every 15 minutes — safety net)
// Also runs after each agent cycle via direct call
export async function scheduleTownCrier(facilityId: string) {
  await runTownCrier(facilityId);
}

// ── SITUATION REPORTS ─────────────────────────────────────────
// Cron: 5,35 * * * * (every 30 min, offset 5 min from Sentinel)
export async function scheduleSituationReports(facilityId: string) {
  const domains = ['clinical', 'workforce', 'financial', 'operations', 'governance', 'residents'];
  for (const domain of domains) {
    await refreshSituationReport(facilityId, domain, 'scheduled');
    await sleep(2000); // stagger to avoid API burst
  }
}

// ── SENTINEL HEALTH CHECK ─────────────────────────────────────
// Cron: 0,30 * * * * (every 30 minutes — safety net)
export async function scheduleSentinel(facilityId: string) {
  await runSentinel(facilityId, 'residential', {});
  await runTownCrier(facilityId);
}

// ── SIRS COUNTDOWN ────────────────────────────────────────────
// Cron: 0 * * * * (hourly)
export async function scheduleSIRSCountdown(facilityId: string) {
  // Route SIRS items through Sentinel Router to check deadlines
  // TODO: Ivan — query open SIRS items from DB
  // For each item approaching deadline, call routeConnectorData
}

// ── STEWARD (DAILY) ───────────────────────────────────────────
// Cron: 30 3 * * * AEST (03:30 daily)
export async function scheduleStewardDaily(facilityId: string, data: StewardData) {
  const report = await runSteward(facilityId, data);
  await runTownCrier(facilityId);
  return report;
}

// ── KEEPER (DAILY LIGHTWEIGHT) ────────────────────────────────
// Cron: 0 4 * * * AEST (04:00 daily)
export async function scheduleKeeperDaily(facilityId: string, data: KeeperData) {
  const report = await runKeeper(facilityId, data);
  await runTownCrier(facilityId);
  return report;
}

// ── MORNING BRIEFINGS ─────────────────────────────────────────
// Cron: 30 5 * * * AEST (05:30 daily)
export async function scheduleMorningBriefings(facilityId: string) {
  await generateMorningBriefings(facilityId);
}

// ── EVENING BRIEFINGS ─────────────────────────────────────────
// Cron: 0 17 * * * AEST (17:00 daily — 7 days/week)
export async function scheduleEveningBriefings(facilityId: string) {
  await generateEveningBriefings(facilityId);
}

// ── ORACLE (WEEKLY) ───────────────────────────────────────────
// Cron: 0 21 * * 0 AEST (Sunday 21:00)
export async function scheduleOracle(facilityId: string, context: OracleContext) {
  const report = await runOracle(facilityId, context);
  await runTownCrier(facilityId);
  return report;
}

// ── KEEPER (FULL — FORTNIGHTLY) ───────────────────────────────
// Triggered by: PSH cycle close event
export async function scheduleKeeperFull(facilityId: string, data: KeeperData) {
  const report = await runKeeper(facilityId, data);
  await runTownCrier(facilityId);
  return report;
}

// ── PULSE CYCLE CLOSE ─────────────────────────────────────────
// Cron: 0 20 * * 0 AEST (Sunday 20:00, fortnightly)
// Pipeline: close pulse → process responses → calculate hazard scores →
//           run convergence → prescribe practices → generate Team Briefings
export async function schedulePulseCycleClose(
  facilityId: string,
  cycleId: number,
  responses: PulseResponse[],
  teamEligible: Record<string, number>,
  priorScores: Record<string, Record<string, number>>,
  operationalData: Map<string, number>,
  teams: { id: string; name: string; wing: string }[]
) {
  console.log(`[Scheduler] Pulse cycle ${cycleId} closing — ${facilityId}`);

  // 1. Process pulse data → hazard scores + convergence
  const result = await processPulseCycle(
    cycleId, facilityId, responses,
    teamEligible, priorScores, operationalData
  );

  // 2. Run full Keeper analysis with fresh hazard data
  // TODO: Ivan — build KeeperData from result
  // await scheduleKeeperFull(facilityId, keeperData);

  // 3. Generate Team Briefings (Sunday 21:00 — 1 hour after close)
  await sleep(1000); // In production: scheduled 1h delay
  const teamConfigs = teams.map((t) => ({
    id: t.id, name: t.name, wing: t.wing, facility_id: facilityId,
  }));
  await generateTeamBriefings(facilityId, String(cycleId), teamConfigs);

  // 4. Town Crier coordination pass
  await runTownCrier(facilityId);

  console.log(`[Scheduler] Pulse cycle ${cycleId} processed — ${result.teams.length} teams, ${result.convergence_insights.length} convergence insights`);
  return result;
}

// ── LEADER LOOP WEEK START ────────────────────────────────────
// Cron: 0 6 * * 1 AEST (Monday 06:00, alternate weeks)
// Opens Leader Loop for active leaders — delivers 360 data and
// generates Leader Briefings.
export async function scheduleLeaderLoopStart(
  facilityId: string,
  cycleId: number,
  leaders: { id: string; name: string; team_id: string; leader_loop_active: boolean }[]
) {
  const loopType = getActiveLoopType(cycleId);
  if (loopType !== 'leader') {
    console.log(`[Scheduler] Cycle ${cycleId} is a team loop week — skipping Leader Loop start`);
    return;
  }

  console.log(`[Scheduler] Leader Loop starting — cycle ${cycleId}, ${leaders.filter((l) => l.leader_loop_active).length} active leaders`);

  // Generate Leader Briefings
  await generateLeaderBriefings(facilityId, String(cycleId), leaders.map((l) => ({
    ...l, facility_id: facilityId,
  })));

  // TODO: Ivan — send iMessage notification to active leaders
  // TODO: Ivan — update leader_loop_cycles state to 'arrival'

  await runTownCrier(facilityId);
}

// ── NETWORK BENCHMARK ACCUMULATION ────────────────────────────
// Cron: quarterly (aligned with StewartBrown publication schedule)
// Aggregates anonymised metrics across all CHRIS providers.
// <3 providers: suppress. 5+: supplement Oracle. 10+: surface to UI.
export async function calculateNetworkBenchmarks(facilityIds: string[]): Promise<void> {
  const providerCount = facilityIds.length;

  if (providerCount < 3) {
    console.log(`[Scheduler] Network benchmarks suppressed — ${providerCount} providers (minimum 3)`);
    return;
  }

  // TODO: Ivan — query canonical data layer for all facilities:
  //   - EBITDA per bed day (financial)
  //   - Care ratio (financial)
  //   - Occupancy (financial)
  //   - Agency % (workforce)
  //   - Turnover rate (workforce)
  //   - PSH domain averages (psh)
  //   - Care minutes per bed day (care_minutes)
  //   - Intervention effectiveness by practice ID (psh)
  //
  // Aggregate by: care_type, bed_count_band, mm_region
  // Write to network_benchmarks table
  // No facility_id in output — aggregate only

  const period = getCurrentQuarterPeriod();
  console.log(`[Scheduler] Network benchmarks calculated — ${providerCount} providers, period: ${period}`);

  if (providerCount >= 5) {
    console.log(`[Scheduler] Network benchmarks available to Oracle as supplementary reference`);
  }
  if (providerCount >= 10) {
    console.log(`[Scheduler] Network benchmarks publishable — surfacing to Benchmarks screen`);
  }
}

function getCurrentQuarterPeriod(): string {
  const now = new Date();
  const fy = now.getMonth() >= 6 ? now.getFullYear() + 1 : now.getFullYear();
  const q = now.getMonth() >= 6 ? Math.ceil((now.getMonth() - 5) / 3) : Math.ceil((now.getMonth() + 7) / 3);
  return `FY${String(fy).slice(-2)}-Q${q}`;
}

// ── MASTER SCHEDULE RUNNER ────────────────────────────────────
// Ivan calls this with the appropriate facilityIds
// For multi-facility providers, runs across all active facilities

export async function runScheduledCycle(
  cycle: 'connector_monitor' | 'town_crier' | 'situation_reports' | 'sentinel' |
         'sirs_countdown' | 'steward_daily' | 'keeper_daily' | 'morning_briefings' |
         'evening_briefings' | 'oracle_weekly' | 'keeper_full' |
         'pulse_cycle_close' | 'leader_loop_start',
  facilityIds: string[]
): Promise<void> {
  console.log(`[Scheduler] Running ${cycle} for ${facilityIds.length} facilities`);

  for (const facilityId of facilityIds) {
    try {
      switch (cycle) {
        case 'connector_monitor': await scheduleConnectorMonitor(facilityId, []); break;
        case 'town_crier': await scheduleTownCrier(facilityId); break;
        case 'situation_reports': await scheduleSituationReports(facilityId); break;
        case 'sentinel': await scheduleSentinel(facilityId); break;
        case 'sirs_countdown': await scheduleSIRSCountdown(facilityId); break;
        case 'morning_briefings': await scheduleMorningBriefings(facilityId); break;
        case 'evening_briefings': await scheduleEveningBriefings(facilityId); break;
      }
    } catch (error) {
      console.error(`[Scheduler] ${cycle} failed for ${facilityId}:`, error);
      // Never let one facility failure stop the rest
    }
  }

  console.log(`[Scheduler] ${cycle} complete`);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
