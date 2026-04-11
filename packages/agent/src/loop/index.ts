// ============================================================================
// CHRIS Agent Execution Loop
// The heartbeat. Event → Classify → Context → Execute Engine → Log.
// Adapted from Prism's loop.ts — aged care domain engines.
// ============================================================================

import { classifyEvent, type AgentEvent, type EventClassification } from "../classifier/index";
import { buildFacilityContext } from "../context/index";
import { db, evidenceRecords } from "@chris/db";
import {
  CareMinutesEngine, classifyIncident, checkDeadlines,
  PulseEngine, MondayBriefingEngine, GovernancePackEngine,
  MonitoringEngine, ExecutionLoop, TrustEngine, ConvergenceDetector,
} from "@chris/engines";

export interface AgentRunResult {
  eventId: string;
  classification: EventClassification;
  engine: string;
  success: boolean;
  actionsExecuted: number;
  escalationsCreated: number;
  duration: number;
  error?: string;
}

/**
 * Run the CHRIS agent loop for a single event.
 * This is the core function — everything flows through here.
 */
export async function runAgentLoop(event: AgentEvent): Promise<AgentRunResult> {
  const startTime = Date.now();
  let actionsExecuted = 0;
  let escalationsCreated = 0;

  try {
    // Phase 1: Classify
    const classification = classifyEvent(event);
    console.log(`[CHRIS] Event ${event.id}: ${classification.engine} (${classification.urgency})`);

    // Phase 2: Build context
    const context = await buildFacilityContext(event.facilityId);

    // Phase 3: Check trust / autonomy
    const trustEngine = new TrustEngine();

    // Phase 4: Execute the appropriate engine
    switch (classification.engine) {
      case "care_minutes":
      case "care_minutes_daily": {
        const engine = new CareMinutesEngine();
        const today = new Date().toISOString().split("T")[0];
        const result = await engine.calculateDaily(event.facilityId, today);
        actionsExecuted++;

        if (result.complianceStatus === "non_compliant" || result.consecutiveDaysAtRisk >= 3) {
          escalationsCreated++;
        }
        break;
      }

      case "sirs_classifier": {
        const incident = event.content as any;
        const result = await classifyIncident({
          id: incident.id,
          facilityId: event.facilityId,
          incidentDate: incident.incidentDate,
          incidentTime: incident.incidentTime,
          reportedAt: new Date(),
          incidentCategory: incident.incidentCategory,
          incidentSubcategory: incident.incidentSubcategory,
          severity: incident.severity,
          locationArea: incident.locationArea,
          roleCategoryInvolved: incident.roleCategoryInvolved,
        }, process.env.ANTHROPIC_API_KEY);
        actionsExecuted++;

        if (result.category !== null) {
          escalationsCreated++; // DON review item created
        }
        break;
      }

      case "sirs_deadline_monitor": {
        const alerts = await checkDeadlines();
        actionsExecuted += alerts.length;
        escalationsCreated += alerts.filter((a) => a.escalationLevel !== "reminder").length;
        break;
      }

      case "pulse_engine": {
        const engine = new PulseEngine();
        const pulseData = event.content as any;
        const result = await engine.processCycle(
          event.facilityId,
          pulseData.cycleId,
          pulseData.cycleStart,
          pulseData.cycleEnd,
          pulseData.responses,
          new Map(Object.entries(pulseData.eligibleByTeam ?? {}))
        );
        actionsExecuted++;

        // After pulse: run convergence detection
        const convergence = new ConvergenceDetector();
        const signals = await convergence.detectSignals(event.facilityId);
        actionsExecuted += signals.length;
        break;
      }

      case "monday_briefing":
      case "briefing_generation": {
        // Requires practice library — loaded from config
        const practiceLibrary: any[] = []; // TODO: load from practice library store
        const engine = new MondayBriefingEngine(practiceLibrary, process.env.ANTHROPIC_API_KEY ?? "");
        const briefing = await engine.generateBriefing(event.facilityId, (event.content as any).cycleId ?? 0);
        actionsExecuted++;
        escalationsCreated++; // Creates DON review item
        break;
      }

      case "governance_pack": {
        const engine = new GovernancePackEngine(process.env.ANTHROPIC_API_KEY ?? "");
        const packRequest = event.content as any;
        const pack = await engine.generatePack({
          facilityId: event.facilityId,
          packType: packRequest.packType ?? "board",
          periodStart: packRequest.periodStart,
          periodEnd: packRequest.periodEnd,
          scheduledMeetingDate: packRequest.meetingDate,
        });
        actionsExecuted++;
        escalationsCreated++; // Creates DON review item
        break;
      }

      case "monitoring":
      case "threshold_check": {
        const monitor = new MonitoringEngine();
        const signals = await monitor.runAllMonitors(event.facilityId);
        actionsExecuted += signals.length;
        escalationsCreated += signals.filter((s) => s.urgency === "immediate").length;
        break;
      }

      case "connector_health": {
        // Check connector freshness
        if (context.connectors.hoursStale > 26) {
          const monitor = new MonitoringEngine();
          await monitor.runAllMonitors(event.facilityId);
          actionsExecuted++;
        }
        break;
      }

      default:
        console.log(`[CHRIS] No handler for engine: ${classification.engine}`);
    }

    // Phase 5: Log to evidence chain
    await db.insert(evidenceRecords).values({
      facilityId: event.facilityId,
      recordType: "action",
      actionCategory: classification.engine,
      triggeredAt: event.timestamp,
      executedAt: new Date(),
      triggeredBy: "chris",
      executedBy: "chris",
      signalData: { event: event.type, source: event.source },
      outcome: `${actionsExecuted} actions, ${escalationsCreated} escalations`,
    });

    const duration = Date.now() - startTime;
    console.log(`[CHRIS] Event ${event.id} complete: ${actionsExecuted} actions, ${escalationsCreated} escalations, ${duration}ms`);

    return {
      eventId: event.id,
      classification,
      engine: classification.engine,
      success: true,
      actionsExecuted,
      escalationsCreated,
      duration,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[CHRIS] Event ${event.id} failed:`, error);

    return {
      eventId: event.id,
      classification: classifyEvent(event),
      engine: classifyEvent(event).engine,
      success: false,
      actionsExecuted,
      escalationsCreated,
      duration,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
