// ============================================================================
// CHRIS Event Classifier
// Routes incoming events to the right engine and urgency level.
// Adapted from Prism's classifier — aged care event types.
// ============================================================================

export type EventSource = "connector" | "pulse" | "incident" | "schedule" | "coach" | "webhook" | "manual";
export type EventUrgency = "immediate" | "normal" | "batch";
export type EventDomain = "clinical" | "workforce" | "financial" | "psh" | "governance" | "operational";

export interface AgentEvent {
  id: string;
  facilityId: string;
  source: EventSource;
  type: string;
  urgency: EventUrgency;
  domain: EventDomain;
  content: Record<string, unknown>;
  timestamp: Date;
}

export interface EventClassification {
  type: "trigger" | "scheduled" | "reactive" | "proactive";
  urgency: EventUrgency;
  domain: EventDomain;
  engine: string; // which engine handles this
  requiresApproval: boolean;
}

/**
 * Classify an incoming event and route to the appropriate engine.
 * Fast-path classification — no LLM needed.
 */
export function classifyEvent(event: AgentEvent): EventClassification {
  // --- Fast-path routes ---

  // SIRS-eligible incident → immediate, SIRS engine
  if (event.source === "incident" || event.type === "incident_ingested") {
    const severity = event.content.severity as string;
    if (["serious", "critical", "sentinel"].includes(severity)) {
      return {
        type: "trigger",
        urgency: "immediate",
        domain: "clinical",
        engine: "sirs_classifier",
        requiresApproval: true, // SIRS always needs DON review
      };
    }
    return {
      type: "trigger",
      urgency: "normal",
      domain: "clinical",
      engine: "incident_recorder",
      requiresApproval: false,
    };
  }

  // Connector data pull complete → care minutes check
  if (event.type === "connector_pull_complete") {
    return {
      type: "trigger",
      urgency: "normal",
      domain: "operational",
      engine: "care_minutes",
      requiresApproval: false,
    };
  }

  // Pulse cycle closed → hazard scoring + briefing generation
  if (event.type === "pulse_cycle_closed") {
    return {
      type: "trigger",
      urgency: "normal",
      domain: "psh",
      engine: "pulse_engine",
      requiresApproval: false,
    };
  }

  // Scheduled events
  if (event.source === "schedule") {
    return {
      type: "scheduled",
      urgency: "normal",
      domain: event.domain,
      engine: event.type, // e.g., "care_minutes_daily", "sirs_deadline_monitor"
      requiresApproval: false,
    };
  }

  // CHRIS Coach interaction
  if (event.source === "coach") {
    return {
      type: "reactive",
      urgency: "immediate",
      domain: "operational",
      engine: "coach",
      requiresApproval: false,
    };
  }

  // Governance cycle trigger
  if (event.type === "governance_cycle_due") {
    return {
      type: "scheduled",
      urgency: "normal",
      domain: "governance",
      engine: "governance_pack",
      requiresApproval: true,
    };
  }

  // Default: batch processing
  return {
    type: "reactive",
    urgency: "batch",
    domain: event.domain,
    engine: "general",
    requiresApproval: false,
  };
}
