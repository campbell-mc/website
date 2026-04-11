// ============================================================================
// CHRIS Agent — Startup
// Run with: pnpm --filter @chris/agent start
// This boots the autonomous agent and scheduler.
// ============================================================================

import { startScheduler } from "./scheduler/index";
import { db, facilities, providers } from "@chris/db";
import { eq } from "drizzle-orm";

async function boot() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("  CHRIS — Culture Habit Reinforcement Intelligence System");
  console.log("  Autonomous Agent · Starting...");
  console.log("═══════════════════════════════════════════════════════");

  // Load all active facilities
  const allFacilities = await db.select().from(facilities);

  if (allFacilities.length === 0) {
    console.log("[CHRIS] No facilities found. Waiting for onboarding...");
    // Stay alive — poll every 60s for new facilities
    setInterval(async () => {
      const count = await db.select().from(facilities);
      if (count.length > 0) {
        console.log(`[CHRIS] ${count.length} facilities found. Starting scheduler.`);
        startScheduler({
          facilityIds: count.map((f) => f.id),
          timezone: "Australia/Sydney",
        });
      }
    }, 60000);
    return;
  }

  console.log(`[CHRIS] ${allFacilities.length} facilities loaded:`);
  for (const f of allFacilities) {
    console.log(`  · ${f.name} (${f.facilityType}) — ${f.operationalBeds ?? "?"} beds`);
  }

  // Start the scheduler
  startScheduler({
    facilityIds: allFacilities.map((f) => f.id),
    timezone: "Australia/Sydney",
  });

  console.log("[CHRIS] Agent is live. Monitoring all facilities.");
  console.log("[CHRIS] Press Ctrl+C to stop.");

  // Keep process alive
  process.on("SIGINT", () => {
    console.log("\n[CHRIS] Shutting down...");
    process.exit(0);
  });
}

boot().catch((err) => {
  console.error("[CHRIS] Boot failed:", err);
  process.exit(1);
});
