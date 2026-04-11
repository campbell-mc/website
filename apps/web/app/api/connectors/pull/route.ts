// ============================================================================
// POST /api/connectors/pull
// Triggers a connector pull for a specific facility + source system.
// Called by the scheduled job (pg_cron / cron service) or manually.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { registry } from "@chris/connectors";
import { db, donReviewItems } from "@chris/db";
import type { ConnectorConfig } from "@chris/connectors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { facilityId, sourceSystem, credentials, since } = body;

    if (!facilityId || !sourceSystem) {
      return NextResponse.json(
        { error: "facilityId and sourceSystem are required" },
        { status: 400 }
      );
    }

    const config: ConnectorConfig = {
      connectorId: `${sourceSystem}-${facilityId}`,
      facilityId,
      sourceSystem,
      credentials: credentials ?? {},
      syncFrequency: "daily",
      lastSuccessfulPull: since ? new Date(since) : null,
      isActive: true,
    };

    const connector = registry.create(config);
    const sinceDate = since
      ? new Date(since)
      : new Date(Date.now() - 24 * 60 * 60 * 1000); // Default: last 24 hours

    const result = await connector.pull(sinceDate);

    // If critical anomalies, create DON review items
    for (const anomaly of result.anomalies) {
      if (anomaly.severity === "critical") {
        await db.insert(donReviewItems).values({
          facilityId,
          itemType: anomaly.type === "zero_rn_shift" ? "rn_coverage_response" : "care_minutes_breach",
          urgency: "immediate",
          summary: anomaly.description,
          fullContext: {
            anomaly,
            connectorResult: {
              sourceSystem: result.sourceSystem,
              pulledAt: result.pulledAt,
              periodStart: result.periodStart,
              periodEnd: result.periodEnd,
            },
          },
          chrisRecommendation: anomaly.recommendation ?? null,
          deadline: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours for critical
        });
      }
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Connector pull failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Pull failed" },
      { status: 500 }
    );
  }
}
