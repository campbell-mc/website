import { describe, it, expect } from "vitest";
import { mapElmoRoleToCategory } from "../elmo/role-mapping";
import { ElmoConnector } from "../elmo/index";

describe("ELMO role mapping", () => {
  it("maps Registered Nurse → rn", () => {
    expect(mapElmoRoleToCategory("Registered Nurse")).toBe("rn");
  });

  it("maps Enrolled Nurse → en", () => {
    expect(mapElmoRoleToCategory("Enrolled Nurse")).toBe("en");
  });

  it("maps Personal Care Worker → ain", () => {
    expect(mapElmoRoleToCategory("Personal Care Worker")).toBe("ain");
  });

  it("maps Physiotherapist → allied_health", () => {
    expect(mapElmoRoleToCategory("Physiotherapist")).toBe("allied_health");
  });

  it("maps unknown roles → other", () => {
    expect(mapElmoRoleToCategory("Data Entry Clerk")).toBe("other");
  });
});

describe("ELMO anomaly detection", () => {
  const connector = new ElmoConnector({
    connectorId: "test",
    facilityId: "test-facility",
    sourceSystem: "elmo",
    credentials: { baseUrl: "http://test", accessToken: "test" },
    syncFrequency: "daily",
    lastSuccessfulPull: null,
    isActive: true,
  });

  it("detects turnover spike when terminations > 10%", () => {
    const anomalies = connector.detectAnomalies({
      workforce: [{
        roleCategory: "ain",
        employmentType: "permanent_ft",
        headcount: 20,
        fte: 20,
        newStarters: 0,
        terminations: 4,
        voluntaryTerminations: 3,
        sickLeaveHours: 0,
        sickLeaveOccasions: 0,
        workersCompHours: 0,
      }],
      training: [],
    });

    const spike = anomalies.find((a) => a.type === "turnover_spike");
    expect(spike).toBeDefined();
    expect(spike!.severity).toBe("medium");
  });

  it("detects low training compliance", () => {
    const anomalies = connector.detectAnomalies({
      workforce: [],
      training: [{
        trainingType: "mandatory_fire_safety",
        roleCategory: "ain",
        eligibleStaff: 20,
        compliantStaff: 10,
        complianceRate: 0.4,
        expiringWithin30d: 0,
      }],
    });

    const low = anomalies.find((a) => a.type === "training_compliance_low");
    expect(low).toBeDefined();
    expect(low!.severity).toBe("high"); // < 50% is high
  });

  it("detects expiring training", () => {
    const anomalies = connector.detectAnomalies({
      workforce: [],
      training: [{
        trainingType: "first_aid",
        roleCategory: "rn",
        eligibleStaff: 10,
        compliantStaff: 10,
        complianceRate: 1.0,
        expiringWithin30d: 3,
      }],
    });

    const expiring = anomalies.find((a) => a.type === "training_expiring");
    expect(expiring).toBeDefined();
    expect(expiring!.severity).toBe("medium");
  });

  it("no anomalies when everything is healthy", () => {
    const anomalies = connector.detectAnomalies({
      workforce: [{
        roleCategory: "rn",
        employmentType: "permanent_ft",
        headcount: 20,
        fte: 20,
        newStarters: 1,
        terminations: 0,
        voluntaryTerminations: 0,
        sickLeaveHours: 8,
        sickLeaveOccasions: 1,
        workersCompHours: 0,
      }],
      training: [{
        trainingType: "mandatory_fire_safety",
        roleCategory: "rn",
        eligibleStaff: 20,
        compliantStaff: 19,
        complianceRate: 0.95,
        expiringWithin30d: 0,
      }],
    });

    expect(anomalies).toHaveLength(0);
  });
});
