// ============================================================================
// CHRIS Action Logger
// Every agent action is logged to the evidence trail.
// Adapted from Prism's action-logger.ts.
// ============================================================================

import { db, evidenceRecords } from "@chris/db";

export interface ActionLogEntry {
  facilityId: string;
  actionCategory: string;
  description: string;
  triggeredBy: string;
  executedBy: string;
  confidence?: number;
  reasoning?: string;
  signalData?: Record<string, unknown>;
  outcome?: string;
  complianceRef?: string;
  externalRef?: string;
}

export async function logAction(entry: ActionLogEntry): Promise<string> {
  const [record] = await db.insert(evidenceRecords).values({
    facilityId: entry.facilityId,
    recordType: "action",
    actionCategory: entry.actionCategory,
    triggeredAt: new Date(),
    executedAt: new Date(),
    triggeredBy: entry.triggeredBy,
    executedBy: entry.executedBy,
    recommendation: entry.description,
    signalData: entry.signalData ?? {},
    outcome: entry.outcome,
    complianceRef: entry.complianceRef,
    externalRef: entry.externalRef,
  }).returning({ id: evidenceRecords.id });

  return record.id;
}
