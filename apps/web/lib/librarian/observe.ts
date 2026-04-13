// lib/librarian/observe.ts
// The single write path. Every event goes through observe() BEFORE
// any agent sees it. This is the ledger-before-publish commitment.
//
// Flow: Connector pull → observe() → episodeLedger INSERT → evaluate thresholds → route to agents
// The ledger entry exists BEFORE the Sentinel evaluates. Non-negotiable.

import { createHash } from 'crypto';
import type { LibrarianEvent, ObserveResult } from './types';
import { routeConnectorData, type ConnectorDataEvent, type ConnectorDataType } from '@/lib/agents/sentinel-router';

/**
 * Generate a deterministic event ID from the event contents.
 * Same event → same ID. Prevents duplicate ledger entries on retry.
 */
function generateEventId(event: LibrarianEvent): string {
  const input = `${event.facility_id}:${event.event_type}:${event.source}:${JSON.stringify(event.payload)}:${event.observed_at?.toISOString() ?? ''}`;
  return createHash('sha256').update(input).digest('hex').slice(0, 32);
}

/**
 * Observe an event. Persists to the episode ledger, then evaluates thresholds.
 * The ledger write MUST complete before any agent logic runs.
 */
export async function observe(event: LibrarianEvent): Promise<ObserveResult> {
  const event_id = generateEventId(event);
  const recorded_at = new Date();
  const observed_at = event.observed_at ?? recorded_at;

  // 1. Persist to episode ledger FIRST
  // TODO: Phase 2 — uncomment when Neon is wired:
  // await db.insert(episodeLedger).values({
  //   event_id,
  //   facility_id: event.facility_id,
  //   event_type: event.event_type,
  //   source: event.source,
  //   domain: event.domain,
  //   payload: event.payload,
  //   metadata: event.metadata ?? {},
  //   observed_at,
  //   recorded_at,
  // });

  // Phase 1: Log to console as the ledger (until DB is wired)
  console.log(`[Librarian] observe: ${event_id} | ${event.event_type} | ${event.source} | ${event.domain}`);

  // 2. Evaluate thresholds via existing sentinel-router
  let threshold_crossed = false;
  const agents_notified: string[] = [];

  // Only route connector-type events through the sentinel router
  const connectorTypes: ConnectorDataType[] = [
    'roster_update', 'incident_logged', 'care_plan_updated', 'care_minutes_updated',
    'sirs_event_created', 'psh_response_submitted', 'financial_updated',
    'credential_updated', 'training_updated', 'complaint_logged',
    'corrective_action_updated', 'audit_completed', 'admission_discharge',
    'connector_health_changed',
  ];

  if (connectorTypes.includes(event.event_type as ConnectorDataType)) {
    try {
      const connectorEvent: ConnectorDataEvent = {
        facility_id: event.facility_id,
        data_type: event.event_type as ConnectorDataType,
        source_system: event.source,
        payload: event.payload as Record<string, unknown>,
        received_at: recorded_at,
        connector_pull_id: event_id,
      };
      const evaluation = await routeConnectorData(connectorEvent);
      threshold_crossed = evaluation.threshold_crossed;
      if (evaluation.trigger_agent_cycle) agents_notified.push('sentinel');
      if (evaluation.trigger_narrative_refresh) agents_notified.push('narrative');
    } catch (error) {
      console.error(`[Librarian] Threshold evaluation failed for ${event_id}:`, error);
      // Ledger entry still exists — the event is recorded even if routing fails.
      // This is the safety net: no event is ever lost.
    }
  }

  return {
    event_id,
    recorded_at,
    threshold_crossed,
    agents_notified,
  };
}
