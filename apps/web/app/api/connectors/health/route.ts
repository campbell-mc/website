// ============================================================================
// POST /api/connectors/health
// Check connectivity and auth status of a source system connector.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { registry } from "@chris/connectors";
import type { ConnectorConfig } from "@chris/connectors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { facilityId, sourceSystem, credentials } = body;

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
      lastSuccessfulPull: null,
      isActive: true,
    };

    const connector = registry.create(config);
    const health = await connector.healthCheck();

    return NextResponse.json(health);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Health check failed" },
      { status: 500 }
    );
  }
}
