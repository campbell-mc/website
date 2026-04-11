// ============================================================================
// BaseConnector — Abstract base class for all CHRIS connectors.
// De-identification is enforced here. Individual names, employee IDs,
// and personal identifiers NEVER enter the canonical store.
// ============================================================================

import type {
  ConnectorConfig,
  ConnectorPullResult,
  ConnectorHealth,
  DataAnomaly,
} from "./types";

export abstract class BaseConnector {
  protected config: ConnectorConfig;

  constructor(config: ConnectorConfig) {
    this.config = config;
  }

  /**
   * Pull data from the source system since the given date.
   * Implementations MUST call deidentify() before any canonical write.
   */
  abstract pull(since: Date): Promise<ConnectorPullResult>;

  /**
   * Check connectivity and auth status of the source system.
   */
  abstract healthCheck(): Promise<ConnectorHealth>;

  /**
   * Strip all PII fields from records before writing to canonical store.
   * This is the de-identification boundary — the most critical function in CHRIS.
   * Throws if a record still contains PII after stripping.
   */
  protected deidentify<T extends Record<string, unknown>>(
    records: T[],
    piiFields: string[]
  ): Omit<T, string>[] {
    return records.map((record) => {
      const cleaned = { ...record };
      for (const field of piiFields) {
        delete cleaned[field];
      }
      // Verify no PII leaked through
      for (const key of Object.keys(cleaned)) {
        const lowerKey = key.toLowerCase();
        if (
          lowerKey.includes("firstname") ||
          lowerKey.includes("lastname") ||
          lowerKey.includes("first_name") ||
          lowerKey.includes("last_name") ||
          lowerKey.includes("email") ||
          lowerKey.includes("phone") ||
          lowerKey.includes("mobile") ||
          lowerKey.includes("address") ||
          lowerKey.includes("tfn") ||
          lowerKey.includes("dateofbirth") ||
          lowerKey.includes("date_of_birth") ||
          lowerKey.includes("bank")
        ) {
          throw new Error(
            `PII field "${key}" survived de-identification. This is a critical error — aborting connector pull.`
          );
        }
      }
      return cleaned;
    });
  }

  /**
   * HTTP fetch with rate limit retry and exponential backoff.
   * Retries on 429 with delays: 60s → 120s → 240s.
   */
  protected async fetchWithRetry(
    url: string,
    options: RequestInit,
    maxRetries = 3
  ): Promise<Response> {
    const backoffMs = [60_000, 120_000, 240_000];

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const response = await fetch(url, options);

      if (response.status === 429 && attempt < maxRetries) {
        const delay = backoffMs[attempt] ?? 240_000;
        console.warn(
          `[${this.config.sourceSystem}] Rate limited (429). Retrying in ${delay / 1000}s (attempt ${attempt + 1}/${maxRetries})`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      return response;
    }

    // Should never reach here, but TypeScript needs it
    throw new Error(`Max retries exceeded for ${url}`);
  }

  /**
   * Build a success result with common fields.
   */
  protected buildResult(
    partial: Pick<
      ConnectorPullResult,
      | "periodStart"
      | "periodEnd"
      | "recordsExtracted"
      | "recordsWritten"
      | "errors"
      | "warnings"
      | "anomalies"
    >
  ): ConnectorPullResult {
    return {
      connectorId: this.config.connectorId,
      facilityId: this.config.facilityId,
      sourceSystem: this.config.sourceSystem,
      pulledAt: new Date(),
      success: partial.errors.length === 0,
      dataFreshnessHours: this.config.lastSuccessfulPull
        ? (Date.now() - this.config.lastSuccessfulPull.getTime()) / 3_600_000
        : -1,
      ...partial,
    };
  }
}
