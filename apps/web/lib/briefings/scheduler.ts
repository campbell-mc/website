// lib/briefings/scheduler.ts
// Maintained by Ivan Sanchez
// Wires briefing generation to the scheduler
//
// Ivan connects these functions to Celery task queue or Vercel cron jobs.
// Morning: '30 5 * * *' (05:30 AEST daily)
// Evening: '0 17 * * *' (17:00 AEST daily, 7 days/week)
// Team: triggered by pulse cycle close event
// Leader: triggered by cycle week switch to week 2

import {
  generateMorningBriefings,
  generateEveningBriefings,
  generateTeamBriefings,
  generateLeaderBriefings,
} from './generate';

// MORNING BRIEFINGS
// Runs every day at 05:30 AEST for all facilities
// Cron: '30 5 * * *'
export async function scheduleMorningBriefings() {
  const facilities = await getActiveFacilities();
  await Promise.all(facilities.map((f) => generateMorningBriefings(f.id)));
  console.log(`[Scheduler] Morning briefings complete for ${facilities.length} facilities`);
}

// EVENING BRIEFINGS
// Runs every day at 17:00 AEST for all facilities
// 7 days per week — no exceptions
// Cron: '0 17 * * *'
export async function scheduleEveningBriefings() {
  const facilities = await getActiveFacilities();
  await Promise.all(facilities.map((f) => generateEveningBriefings(f.id)));
  console.log(`[Scheduler] Evening briefings complete for ${facilities.length} facilities`);
}

// TEAM BRIEFINGS
// Triggered by pulse cycle close event — not a scheduled cron
// Called from: Sentinel when cycle closes, or directly by event bus
// Typically Sunday night after pulse collection closes
export async function onPulseCycleClose(facilityId: string, cycleId: string) {
  // TODO: Ivan — get teams from DB
  const teams: Array<{ id: string; name: string; wing: string; facility_id: string }> = [];
  await generateTeamBriefings(facilityId, cycleId, teams);
}

// LEADER BRIEFINGS
// Runs in alternate weeks — week 2 of the fortnightly cycle
// Triggered by cycle week detection — not a fixed cron
// Called when cycles.active_week switches to 2
export async function onLeaderWeekStart(facilityId: string, cycleId: string) {
  // TODO: Ivan — get active leader loop leaders from DB
  const leaders: Array<{ id: string; name: string; team_id: string; facility_id: string; leader_loop_active: boolean }> = [];
  await generateLeaderBriefings(facilityId, cycleId, leaders);
}

// ── HELPERS ───────────────────────────────────────────────────

async function getActiveFacilities(): Promise<Array<{ id: string }>> {
  // TODO: Ivan — query active facilities from DB
  // For now returns empty — no facilities without DB connection
  return [];
}
