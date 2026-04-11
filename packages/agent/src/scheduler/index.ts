// ============================================================================
// CHRIS Scheduler
// Cron-based heartbeat that runs all scheduled tasks.
// Adapted from Prism's nightly scheduler — aged care cadence.
//
// Schedule (all times AEST):
//   3:00am — Connector pulls (Deputy, ELMO, Humanforce)
//   6:00am — Care minutes daily calculation
//   Every 30 min — SIRS deadline monitor
//   Every hour — Care minutes running average
//   Every 4 hours — Connector health check
//   Sunday 8:00pm — Pulse close processing
//   Sunday 9:30pm — Monday Briefing + Team Briefing generation
//   Monthly (configurable) — Governance pack generation
// ============================================================================

import cron from "node-cron";
import { runAgentLoop } from "../loop/index";
import type { AgentEvent } from "../classifier/index";
import { db, facilities } from "@chris/db";
import { eq } from "drizzle-orm";

interface SchedulerConfig {
  facilityIds: string[];
  timezone: string;
}

const activeTasks = new Map<string, cron.ScheduledTask[]>();

function createEvent(facilityId: string, type: string, domain: string, content: Record<string, unknown> = {}): AgentEvent {
  return {
    id: `sched-${type}-${facilityId}-${Date.now()}`,
    facilityId,
    source: "schedule",
    type,
    urgency: "normal",
    domain: domain as any,
    content,
    timestamp: new Date(),
  };
}

/**
 * Start the CHRIS scheduler for a set of facilities.
 * This is the main entry point — call once on server start.
 */
export function startScheduler(config: SchedulerConfig): void {
  const { facilityIds, timezone } = config;

  console.log(`[CHRIS Scheduler] Starting for ${facilityIds.length} facilities (${timezone})`);

  for (const facilityId of facilityIds) {
    const tasks: cron.ScheduledTask[] = [];

    // 3:00am AEST — Connector pulls
    tasks.push(cron.schedule("0 17 * * *", async () => { // UTC 17:00 = AEST 3:00
      console.log(`[CHRIS] 3am connector pull — ${facilityId}`);
      await runAgentLoop(createEvent(facilityId, "connector_pull", "operational"));
    }, { timezone: "UTC" }));

    // 6:00am AEST — Care minutes daily
    tasks.push(cron.schedule("0 20 * * *", async () => { // UTC 20:00 = AEST 6:00
      console.log(`[CHRIS] 6am care minutes — ${facilityId}`);
      await runAgentLoop(createEvent(facilityId, "care_minutes_daily", "clinical"));
    }, { timezone: "UTC" }));

    // Every 30 minutes — SIRS deadline monitor
    tasks.push(cron.schedule("*/30 * * * *", async () => {
      await runAgentLoop(createEvent(facilityId, "sirs_deadline_monitor", "clinical"));
    }, { timezone: "UTC" }));

    // Every hour — Care minutes running average
    tasks.push(cron.schedule("0 * * * *", async () => {
      await runAgentLoop(createEvent(facilityId, "care_minutes_hourly", "clinical"));
    }, { timezone: "UTC" }));

    // Every 4 hours — Connector health
    tasks.push(cron.schedule("0 */4 * * *", async () => {
      await runAgentLoop(createEvent(facilityId, "connector_health", "operational"));
    }, { timezone: "UTC" }));

    // Sunday 8:00pm AEST — Pulse close + hazard scoring
    tasks.push(cron.schedule("0 10 * * 0", async () => { // UTC 10:00 Sun = AEST 8pm Sun
      console.log(`[CHRIS] Sunday 8pm pulse processing — ${facilityId}`);
      await runAgentLoop(createEvent(facilityId, "pulse_cycle_closed", "psh", { cycleId: Date.now() }));
    }, { timezone: "UTC" }));

    // Sunday 9:30pm AEST — Monday Briefing generation
    tasks.push(cron.schedule("30 11 * * 0", async () => { // UTC 11:30 Sun = AEST 9:30pm Sun
      console.log(`[CHRIS] Sunday 9:30pm briefing generation — ${facilityId}`);
      await runAgentLoop(createEvent(facilityId, "monday_briefing", "operational", { cycleId: Date.now() }));
    }, { timezone: "UTC" }));

    // Daily — Always-on monitoring pass
    tasks.push(cron.schedule("0 22 * * *", async () => { // UTC 22:00 = AEST 8:00am
      await runAgentLoop(createEvent(facilityId, "monitoring", "operational"));
    }, { timezone: "UTC" }));

    // Daily — Trust score decay check
    tasks.push(cron.schedule("0 18 * * *", async () => { // UTC 18:00 = AEST 4:00am
      await runAgentLoop(createEvent(facilityId, "trust_decay", "operational"));
    }, { timezone: "UTC" }));

    activeTasks.set(facilityId, tasks);
    console.log(`[CHRIS Scheduler] ${tasks.length} tasks scheduled for ${facilityId}`);
  }
}

/**
 * Stop the scheduler for a specific facility.
 */
export function stopScheduler(facilityId: string): void {
  const tasks = activeTasks.get(facilityId);
  if (tasks) {
    tasks.forEach((t) => t.stop());
    activeTasks.delete(facilityId);
    console.log(`[CHRIS Scheduler] Stopped for ${facilityId}`);
  }
}

/**
 * Stop all schedulers.
 */
export function stopAll(): void {
  for (const [id, tasks] of activeTasks) {
    tasks.forEach((t) => t.stop());
  }
  activeTasks.clear();
  console.log("[CHRIS Scheduler] All stopped");
}

/**
 * Fire an event immediately (for testing or manual triggers).
 */
export async function fireEvent(event: AgentEvent): Promise<void> {
  await runAgentLoop(event);
}
