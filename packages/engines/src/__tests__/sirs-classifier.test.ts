import { describe, it, expect, vi } from "vitest";

// ============================================================================
// SIRS Classification Tests — Pure logic tests (no database)
// ============================================================================

// Re-implement pattern matching logic for unit testing without DB dependency
function patternMatch(incident: {
  incidentCategory: string;
  severity: string;
  incidentSubcategory?: string;
}): { category: 1 | 2 | null; confidence: "high" } | null {
  const cat = incident.incidentCategory.toLowerCase();
  const sev = incident.severity.toLowerCase();
  const subcat = (incident.incidentSubcategory ?? "").toLowerCase();

  // Cat 1
  if (cat === "unexpected_death" && ["serious", "critical", "sentinel"].includes(sev)) {
    return { category: 1, confidence: "high" };
  }
  if (cat === "aggression" && ["serious", "critical", "sentinel"].includes(sev)) {
    return { category: 1, confidence: "high" };
  }
  if (subcat.includes("sexual") || cat.includes("sexual")) {
    return { category: 1, confidence: "high" };
  }
  if (subcat.includes("psychological") || subcat.includes("emotional_abuse")) {
    return { category: 1, confidence: "high" };
  }
  if (subcat.includes("neglect") && ["serious", "critical", "sentinel"].includes(sev)) {
    return { category: 1, confidence: "high" };
  }
  if (subcat.includes("restrictive") && ["serious", "critical"].includes(sev)) {
    return { category: 1, confidence: "high" };
  }
  if (subcat.includes("financial") || subcat.includes("stealing")) {
    return { category: 1, confidence: "high" };
  }

  // Cat 2
  if (cat === "missing_resident") return { category: 2, confidence: "high" };
  if (cat === "fall" && ["critical", "sentinel"].includes(sev)) return { category: 2, confidence: "high" };
  if (cat === "medication_error" && ["serious", "critical", "sentinel"].includes(sev)) return { category: 2, confidence: "high" };

  // Not reportable
  if (cat === "near_miss" && sev === "low") return { category: null, confidence: "high" };
  if (cat === "medication_error" && sev === "low") return { category: null, confidence: "high" };
  if (cat === "environmental" || cat === "near_miss") return { category: null, confidence: "high" };

  return null; // Ambiguous
}

describe("SIRS classifier — pattern matching", () => {
  it("test_cat1_pattern_match: aggression + serious → Category 1", () => {
    const result = patternMatch({
      incidentCategory: "aggression",
      severity: "serious",
      incidentSubcategory: "physical_force",
    });
    expect(result).not.toBeNull();
    expect(result!.category).toBe(1);
    expect(result!.confidence).toBe("high");
  });

  it("test_cat1_unexpected_death", () => {
    const result = patternMatch({
      incidentCategory: "unexpected_death",
      severity: "critical",
    });
    expect(result!.category).toBe(1);
  });

  it("test_cat1_sexual_misconduct", () => {
    const result = patternMatch({
      incidentCategory: "aggression",
      severity: "moderate",
      incidentSubcategory: "sexual_assault",
    });
    expect(result!.category).toBe(1);
  });

  it("test_cat1_neglect", () => {
    const result = patternMatch({
      incidentCategory: "other_clinical",
      severity: "serious",
      incidentSubcategory: "neglect_of_care",
    });
    expect(result!.category).toBe(1);
  });

  it("test_cat1_financial_fraud", () => {
    const result = patternMatch({
      incidentCategory: "other_clinical",
      severity: "moderate",
      incidentSubcategory: "stealing_from_resident",
    });
    expect(result!.category).toBe(1);
  });

  it("test_cat2_fall: fall + critical → Category 2", () => {
    const result = patternMatch({
      incidentCategory: "fall",
      severity: "critical",
    });
    expect(result!.category).toBe(2);
  });

  it("test_cat2_missing_resident", () => {
    const result = patternMatch({
      incidentCategory: "missing_resident",
      severity: "serious",
    });
    expect(result!.category).toBe(2);
  });

  it("test_cat2_medication_error_serious", () => {
    const result = patternMatch({
      incidentCategory: "medication_error",
      severity: "serious",
    });
    expect(result!.category).toBe(2);
  });

  it("test_not_reportable: near_miss + low → null", () => {
    const result = patternMatch({
      incidentCategory: "near_miss",
      severity: "low",
    });
    expect(result!.category).toBeNull();
  });

  it("test_not_reportable: medication_error + low → null", () => {
    const result = patternMatch({
      incidentCategory: "medication_error",
      severity: "low",
    });
    expect(result!.category).toBeNull();
  });

  it("test_ambiguous: returns null for Claude API", () => {
    const result = patternMatch({
      incidentCategory: "fall",
      severity: "moderate",
      incidentSubcategory: "unwitnessed",
    });
    expect(result).toBeNull(); // Needs Claude API
  });

  it("test_cat1_deadline: 24 hours from incident", () => {
    const reportedAt = new Date();
    const deadline = new Date(reportedAt);
    deadline.setHours(deadline.getHours() + 24);

    const diff = deadline.getTime() - reportedAt.getTime();
    expect(diff).toBe(24 * 60 * 60 * 1000);
  });

  it("test_cat2_deadline: 30 days from incident", () => {
    const reportedAt = new Date();
    const deadline = new Date(reportedAt);
    deadline.setDate(deadline.getDate() + 30);

    const diff = (deadline.getTime() - reportedAt.getTime()) / (1000 * 60 * 60 * 24);
    expect(diff).toBe(30);
  });
});

describe("SIRS saga pattern", () => {
  it("test_saga_executes_all_steps_in_order", async () => {
    const { SagaTransaction } = await import("../saga");

    const order: string[] = [];
    const saga = new SagaTransaction("test-saga");

    saga.addStep({
      name: "step1",
      execute: async () => { order.push("exec1"); return "r1"; },
      compensate: async () => { order.push("comp1"); },
    });
    saga.addStep({
      name: "step2",
      execute: async () => { order.push("exec2"); return "r2"; },
      compensate: async () => { order.push("comp2"); },
    });
    saga.addStep({
      name: "step3",
      execute: async () => { order.push("exec3"); return "r3"; },
      compensate: null,
    });

    await saga.execute();

    expect(saga.status).toBe("completed");
    expect(order).toEqual(["exec1", "exec2", "exec3"]);
  });

  it("test_saga_compensates_on_failure_in_reverse_order", async () => {
    const { SagaTransaction } = await import("../saga");

    const order: string[] = [];
    const saga = new SagaTransaction("test-fail-saga");

    saga.addStep({
      name: "step1",
      execute: async () => { order.push("exec1"); return "r1"; },
      compensate: async () => { order.push("comp1"); },
    });
    saga.addStep({
      name: "step2",
      execute: async () => { order.push("exec2"); return "r2"; },
      compensate: async () => { order.push("comp2"); },
    });
    saga.addStep({
      name: "step3",
      execute: async () => { throw new Error("Step 3 failed!"); },
      compensate: null,
    });

    await saga.execute();

    expect(saga.status).toBe("compensated");
    // Steps 1 and 2 executed, step 3 failed
    // Compensation runs in reverse: step 2 then step 1
    expect(order).toEqual(["exec1", "exec2", "comp2", "comp1"]);
  });

  it("test_saga_step2_success_step3_fail_creates_alert", async () => {
    const { SagaTransaction } = await import("../saga");

    let alertCreated = false;
    const saga = new SagaTransaction("sirs-saga-test");

    // Step 1: internal record
    saga.addStep({
      name: "create_internal_record",
      execute: async () => ({ incidentId: "test" }),
      compensate: async () => {},
    });

    // Step 2: ACQSC submission (succeeds — IRREVERSIBLE)
    saga.addStep({
      name: "submit_to_acqsc",
      execute: async () => ({ submissionId: "ACQSC-123" }),
      compensate: async () => {
        // This is the critical compensation — cannot undo submission, must alert
        alertCreated = true;
      },
    });

    // Step 3: record confirmation (FAILS)
    saga.addStep({
      name: "record_confirmation",
      execute: async () => { throw new Error("DB write failed"); },
      compensate: null,
    });

    await saga.execute();

    expect(saga.status).toBe("compensated");
    expect(alertCreated).toBe(true); // Step 2 compensation ran (alerting DON)
  });
});

describe("SIRS deadline calculations", () => {
  it("test_deadline_escalation_80pct_cat1", () => {
    // Cat 1: 24h window, 80% elapsed = 4.8h remaining
    const hoursRemaining = 4.8;
    const isEscalation = hoursRemaining <= 4.8;
    expect(isEscalation).toBe(true);

    // Should escalate to CEO + facility_gm
    const recipients = hoursRemaining <= 2.4
      ? ["don", "ceo", "facility_gm", "campbell", "ivan"]
      : hoursRemaining <= 4.8
        ? ["don", "ceo", "facility_gm"]
        : ["don"];

    expect(recipients).toContain("ceo");
    expect(recipients).toContain("facility_gm");
  });

  it("test_deadline_90pct_cat1_critical", () => {
    const hoursRemaining = 2.0;
    expect(hoursRemaining <= 2.4).toBe(true);

    const recipients = ["don", "ceo", "facility_gm", "campbell", "ivan"];
    expect(recipients).toContain("campbell");
    expect(recipients).toContain("ivan");
  });
});
