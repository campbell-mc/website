// lib/realtime/subscriptions.ts
// Maintained by Ivan Sanchez
//
// Neon real-time subscriptions for the UI.
// Components subscribe to these channels and update
// immediately when data changes — no polling, no refresh.
//
// Uses Neon's Postgres LISTEN/NOTIFY pattern.
// Ivan implements the actual WebSocket/SSE connection
// based on Neon's serverless driver capabilities.

type SubscriptionCallback = (data: Record<string, unknown>) => void;

const listeners: Map<string, Set<SubscriptionCallback>> = new Map();

function subscribe(channel: string, callback: SubscriptionCallback): () => void {
  if (!listeners.has(channel)) {
    listeners.set(channel, new Set());
    // TODO: Ivan — LISTEN to Postgres channel via Neon WebSocket
    console.log(`[Realtime] Listening: ${channel}`);
  }
  listeners.get(channel)!.add(callback);
  return () => { listeners.get(channel)?.delete(callback); };
}

// ── SUBSCRIPTION HELPERS FOR COMPONENTS ──────────────────────

export function subscribeSituationReport(
  facilityId: string, domain: string,
  onUpdate: (narrative: string, updatedAt: string) => void
): () => void {
  return subscribe(`situation_report_${facilityId}_${domain}`, (data) => {
    onUpdate(data.narrative as string, data.updated_at as string);
  });
}

export function subscribeCareMinutes(
  facilityId: string,
  onUpdate: (data: { projected_total: number; rn_minutes: number; target: number; rn_target: number; updated_at: string }) => void
): () => void {
  return subscribe(`care_minutes_${facilityId}`, (data) => onUpdate(data as ReturnType<typeof onUpdate> extends void ? Parameters<typeof onUpdate>[0] : never));
}

export function subscribeAgentActivity(
  facilityId: string,
  onUpdate: (entry: { agent: string; event: string; status: string; timestamp: string }) => void
): () => void {
  return subscribe(`agent_activity_${facilityId}`, (data) => onUpdate(data as Parameters<typeof onUpdate>[0]));
}

export function subscribeSIRSCountdown(
  facilityId: string,
  onUpdate: (items: Array<{ id: string; category: number; hours_remaining: number; days_remaining: number }>) => void
): () => void {
  return subscribe(`sirs_countdown_${facilityId}`, (data) => onUpdate(data.items as Parameters<typeof onUpdate>[0]));
}

export function subscribeQueueItems(
  facilityId: string, role: string,
  onUpdate: (count: number, items: unknown[]) => void
): () => void {
  return subscribe(`queue_${facilityId}_${role}`, (data) => onUpdate(data.count as number, data.items as unknown[]));
}

export function subscribeConnectorHealth(
  facilityId: string,
  onUpdate: (connectors: Array<{ system: string; status: string; last_sync: string; minutes_stale: number }>) => void
): () => void {
  return subscribe(`connector_health_${facilityId}`, (data) => onUpdate(data.connectors as Parameters<typeof onUpdate>[0]));
}
