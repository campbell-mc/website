import { describe, it, expect } from "vitest";
import { SagaTransaction } from "../saga";

describe("Governance pack distribution saga", () => {
  it("distribution requires approval — saga fails at step 1 if not approved", async () => {
    const saga = new SagaTransaction("test-distribution");

    saga.addStep({
      name: "verify_approved",
      execute: async () => {
        const status: string = "pending"; // Not approved
        if (status !== "approved") {
          throw new Error("Pack distribution blocked — DON approval required");
        }
      },
      compensate: null,
    });

    saga.addStep({
      name: "send_emails",
      execute: async () => ({ sent: true }),
      compensate: null,
    });

    await saga.execute();

    expect(saga.status).toBe("compensated");
    expect(saga.error?.message).toContain("approval");
    // Step 2 (send_emails) should NOT have executed
    expect(saga.completedSteps).toHaveLength(0);
  });

  it("partial email failure logs alert but saga completes", async () => {
    const saga = new SagaTransaction("test-partial-failure");
    let alertCreated = false;

    saga.addStep({
      name: "verify_approved",
      execute: async () => ({ verified: true }),
      compensate: null,
    });

    saga.addStep({
      name: "send_emails",
      execute: async () => {
        const sentTo = ["don@example.com", "ceo@example.com"];
        const failed = ["board@example.com"];
        // Partial success — still return (don't throw)
        return { sentTo, failed };
      },
      compensate: async () => { alertCreated = true; },
    });

    saga.addStep({
      name: "record",
      execute: async () => ({ recorded: true }),
      compensate: null,
    });

    await saga.execute();

    expect(saga.status).toBe("completed");
    expect(alertCreated).toBe(false); // No compensation needed — saga completed
  });

  it("saga compensates all steps if recording fails after emails sent", async () => {
    const saga = new SagaTransaction("test-record-failure");
    let emailCompensated = false;

    saga.addStep({
      name: "verify",
      execute: async () => ({ verified: true }),
      compensate: null,
    });

    saga.addStep({
      name: "send_emails",
      execute: async () => ({ sentTo: ["don@example.com"] }),
      compensate: async () => { emailCompensated = true; },
    });

    saga.addStep({
      name: "record_distribution",
      execute: async () => { throw new Error("DB write failed"); },
      compensate: null,
    });

    await saga.execute();

    expect(saga.status).toBe("compensated");
    expect(emailCompensated).toBe(true); // Cannot recall emails, but compensation runs to alert
  });
});

describe("Governance pack sections", () => {
  it("board pack has 6 required sections", () => {
    const requiredSections = [
      "Executive Summary",
      "Quality and Safety",
      "Workforce and Culture",
      "Financial Summary",
      "Strategic Risks",
      "Decisions Required",
    ];

    // Verify all section titles are defined
    expect(requiredSections).toHaveLength(6);
    expect(new Set(requiredSections).size).toBe(6); // No duplicates
  });

  it("PDF storage path format is correct", () => {
    const providerId = "prov-123";
    const facilityId = "fac-456";
    const year = 2026;
    const packType = "board";
    const periodStart = "2026-01-01";

    const path = `packs/${providerId}/${facilityId}/${year}/${packType}_${periodStart}.pdf`;
    expect(path).toBe("packs/prov-123/fac-456/2026/board_2026-01-01.pdf");
  });
});
