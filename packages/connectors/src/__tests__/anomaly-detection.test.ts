import { describe, it, expect } from "vitest";
import { DeputyConnector } from "../deputy/index";
import type { RoleCategory } from "@chris/db";

function emptyRoleHours(): Record<RoleCategory, number> {
  return {
    rn: 0, en: 0, ain: 0, allied_health: 0,
    admin: 0, management: 0, cleaning_catering: 0, other: 0,
  };
}

function makeShift(overrides: {
  shiftDate: string;
  shiftType?: "morning" | "afternoon" | "night" | "split";
  actualRn?: number;
  actualEn?: number;
  actualAin?: number;
  agencyShifts?: number;
}) {
  const actualHours = emptyRoleHours();
  actualHours.rn = overrides.actualRn ?? 8;
  actualHours.en = overrides.actualEn ?? 4;
  actualHours.ain = overrides.actualAin ?? 12;

  return {
    shiftDate: overrides.shiftDate,
    shiftType: overrides.shiftType ?? "morning" as const,
    scheduledHours: { ...actualHours },
    actualHours,
    agencyShifts: overrides.agencyShifts ?? 0,
    unfilledShifts: 0,
  };
}

describe("Deputy anomaly detection", () => {
  // Access the detectAnomalies method via a test instance
  const connector = new DeputyConnector({
    connectorId: "test",
    facilityId: "test-facility",
    sourceSystem: "deputy",
    credentials: { baseUrl: "http://test", accessToken: "test" },
    syncFrequency: "daily",
    lastSuccessfulPull: null,
    isActive: true,
  });

  it("detects zero_rn_shift as CRITICAL", () => {
    const data = {
      shifts: [makeShift({ shiftDate: "2026-04-10", actualRn: 0 })],
      workforce: [],
      operationalBeds: 80,
      directCareFactor: 0.9,
      careMinutesThresholds: { total: 200, rn: 40 },
    };

    const anomalies = connector.detectAnomalies(data);

    expect(anomalies).toHaveLength(1);
    expect(anomalies[0].type).toBe("zero_rn_shift");
    expect(anomalies[0].severity).toBe("critical");
    expect(anomalies[0].affectedDate).toBe("2026-04-10");
  });

  it("detects care_minutes_gap after 3+ consecutive days with no RN", () => {
    const data = {
      shifts: [
        makeShift({ shiftDate: "2026-04-08", actualRn: 0 }),
        makeShift({ shiftDate: "2026-04-09", actualRn: 0 }),
        makeShift({ shiftDate: "2026-04-10", actualRn: 0 }),
      ],
      workforce: [],
      operationalBeds: 80,
      directCareFactor: 0.9,
      careMinutesThresholds: { total: 200, rn: 40 },
    };

    const anomalies = connector.detectAnomalies(data);
    const gapAnomaly = anomalies.find((a) => a.type === "care_minutes_gap");

    expect(gapAnomaly).toBeDefined();
    expect(gapAnomaly!.severity).toBe("high");
  });

  it("does not flag care_minutes_gap for fewer than 3 consecutive days", () => {
    const data = {
      shifts: [
        makeShift({ shiftDate: "2026-04-08", actualRn: 0 }),
        makeShift({ shiftDate: "2026-04-09", actualRn: 8 }), // breaks streak
        makeShift({ shiftDate: "2026-04-10", actualRn: 0 }),
      ],
      workforce: [],
      operationalBeds: 80,
      directCareFactor: 0.9,
      careMinutesThresholds: { total: 200, rn: 40 },
    };

    const anomalies = connector.detectAnomalies(data);
    const gapAnomaly = anomalies.find((a) => a.type === "care_minutes_gap");

    expect(gapAnomaly).toBeUndefined();
  });

  it("detects no anomalies when everything is healthy", () => {
    const data = {
      shifts: [
        makeShift({ shiftDate: "2026-04-10", actualRn: 8, actualEn: 4, actualAin: 12 }),
      ],
      workforce: [],
      operationalBeds: 80,
      directCareFactor: 0.9,
      careMinutesThresholds: { total: 200, rn: 40 },
    };

    const anomalies = connector.detectAnomalies(data);

    expect(anomalies).toHaveLength(0);
  });
});
