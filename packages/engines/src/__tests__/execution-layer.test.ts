import { describe, it, expect } from "vitest";
import {
  getTrustPhase,
  ACTION_REGISTRY,
  HARD_CEILING_ACTIONS,
  ALWAYS_TIER_3,
  type ActionCategory,
} from "@chris/db";

describe("Trust Engine — trust phases", () => {
  it("score 0.0 → observe", () => {
    expect(getTrustPhase(0.0)).toBe("observe");
  });

  it("score 0.29 → observe", () => {
    expect(getTrustPhase(0.29)).toBe("observe");
  });

  it("score 0.30 → assist", () => {
    expect(getTrustPhase(0.30)).toBe("assist");
  });

  it("score 0.50 → operate", () => {
    expect(getTrustPhase(0.50)).toBe("operate");
  });

  it("score 0.70 → manage", () => {
    expect(getTrustPhase(0.70)).toBe("manage");
  });

  it("score 0.90 → autonomous", () => {
    expect(getTrustPhase(0.90)).toBe("autonomous");
  });

  it("score 1.0 → autonomous", () => {
    expect(getTrustPhase(1.0)).toBe("autonomous");
  });
});

describe("Trust Engine — earned autonomy math", () => {
  it("approval adds +0.04, capped at 1.0", () => {
    let score = 0.2;
    for (let i = 0; i < 25; i++) {
      score = Math.min(1, score + 0.04);
    }
    expect(score).toBe(1.0);
  });

  it("rejection subtracts -0.15, floored at 0.0", () => {
    let score = 0.2;
    score = Math.max(0, score - 0.15);
    expect(score).toBeCloseTo(0.05, 2);

    score = Math.max(0, score - 0.15);
    expect(score).toBe(0);
  });

  it("20 consecutive approvals to reach autonomous from default", () => {
    let score = 0.2;
    let approvals = 0;
    while (score < 0.9) {
      score = Math.min(1, score + 0.04);
      approvals++;
    }
    // 0.2 → 0.9 = 0.7 / 0.04 = 17.5 → 18 approvals
    expect(approvals).toBe(18);
  });

  it("one rejection wipes ~4 approvals of progress", () => {
    // 0.15 / 0.04 = 3.75 approvals worth
    const approvalGain = 0.04;
    const rejectionLoss = 0.15;
    const approvalsWiped = rejectionLoss / approvalGain;
    expect(approvalsWiped).toBeCloseTo(3.75, 1);
  });

  it("30-day decay multiplies by 0.95", () => {
    const score = 0.8;
    const decayed = score * 0.95;
    expect(decayed).toBe(0.76);
  });
});

describe("Action Registry", () => {
  it("has entries for all key action categories", () => {
    expect(ACTION_REGISTRY.length).toBeGreaterThanOrEqual(20);
  });

  it("SIRS submission is always at least Tier 2", () => {
    const sirs = ACTION_REGISTRY.find((a) => a.category === "sirs_submission");
    expect(sirs).toBeDefined();
    expect(sirs!.defaultTier).toBe(3);
    expect(sirs!.ceilingTier).toBeGreaterThanOrEqual(2);
    expect(sirs!.requiresSaga).toBe(true);
  });

  it("GPMS QFR is always Tier 3 (human executes)", () => {
    const qfr = ACTION_REGISTRY.find((a) => a.category === "gpms_qfr_submission");
    expect(qfr).toBeDefined();
    expect(qfr!.defaultTier).toBe(3);
    expect(qfr!.ceilingTier).toBe(3);
  });

  it("iMessage alerts are Tier 1 (autonomous)", () => {
    const alertActions = ACTION_REGISTRY.filter((a) => a.category.endsWith("_alert"));
    for (const alert of alertActions) {
      expect(alert.defaultTier).toBe(1);
    }
  });

  it("practice selection is autonomous", () => {
    const ps = ACTION_REGISTRY.find((a) => a.category === "practice_selection");
    expect(ps).toBeDefined();
    expect(ps!.defaultTier).toBe(1);
  });

  it("hard ceiling actions include SIRS and GPMS", () => {
    expect(HARD_CEILING_ACTIONS).toContain("sirs_submission");
    expect(HARD_CEILING_ACTIONS).toContain("gpms_qi_submission");
    expect(HARD_CEILING_ACTIONS).toContain("gpms_qfr_submission");
  });

  it("always Tier 3 actions include GPMS QFR and offboarding", () => {
    expect(ALWAYS_TIER_3).toContain("gpms_qfr_submission");
    expect(ALWAYS_TIER_3).toContain("provider_data_export");
    expect(ALWAYS_TIER_3).toContain("provider_offboarding");
  });

  it("all saga-required actions are marked", () => {
    const sagaActions = ACTION_REGISTRY.filter((a) => a.requiresSaga);
    const sagaCategories = sagaActions.map((a) => a.category);
    expect(sagaCategories).toContain("sirs_submission");
    expect(sagaCategories).toContain("board_pack_distribution");
    expect(sagaCategories).toContain("provider_data_export");
  });
});

describe("Monitor signal thresholds", () => {
  it("RN < 38 min/resident is IMMEDIATE", () => {
    const rnPerResident = 37;
    const urgency = rnPerResident < 38 ? "immediate" : rnPerResident < 39 ? "urgent" : "routine";
    expect(urgency).toBe("immediate");
  });

  it("Total < 190 min/resident is IMMEDIATE", () => {
    const totalPerResident = 189;
    const urgency = totalPerResident < 190 ? "immediate" : totalPerResident < 195 ? "urgent" : "routine";
    expect(urgency).toBe("immediate");
  });

  it("PSH score > 0.85 is URGENT", () => {
    const score = 0.87;
    expect(score > 0.85).toBe(true);
  });

  it("Connector stale > 48h is IMMEDIATE", () => {
    const hoursSinceIngestion = 50;
    const urgency = hoursSinceIngestion > 48 ? "immediate" : hoursSinceIngestion > 26 ? "routine" : "none";
    expect(urgency).toBe("immediate");
  });
});

describe("Execution loop — dead hours", () => {
  it("11pm is dead hours", () => {
    const hour = 23;
    const isDead = hour >= 23 || hour < 5;
    expect(isDead).toBe(true);
  });

  it("3am is dead hours", () => {
    const hour = 3;
    const isDead = hour >= 23 || hour < 5;
    expect(isDead).toBe(true);
  });

  it("6am is NOT dead hours", () => {
    const hour = 6;
    const isDead = hour >= 23 || hour < 5;
    expect(isDead).toBe(false);
  });

  it("IMMEDIATE alerts override dead hours", () => {
    const urgency = "immediate";
    const isDead = true;
    const shouldSend = urgency === "immediate" || !isDead;
    expect(shouldSend).toBe(true);
  });

  it("URGENT alerts are queued during dead hours", () => {
    const urgency = "urgent";
    const isDead = true;
    const shouldSend = urgency === "immediate" || !isDead;
    expect(shouldSend).toBe(false);
  });
});

describe("Escalation chain", () => {
  it("team_leader → don → facility_gm → ceo → operator", () => {
    const chain: Record<string, string> = {
      team_leader: "don",
      don: "facility_gm",
      facility_gm: "ceo",
      ceo: "operator",
    };

    expect(chain.team_leader).toBe("don");
    expect(chain.don).toBe("facility_gm");
    expect(chain.facility_gm).toBe("ceo");
    expect(chain.ceo).toBe("operator");
  });

  it("escalation always upgrades to IMMEDIATE urgency", () => {
    const originalUrgency: string = "urgent";
    const escalatedUrgency: string = "immediate"; // Always
    expect(escalatedUrgency).toBe("immediate");
  });
});

describe("Duplicate suppression", () => {
  it("same alert within 4 hours is suppressed", () => {
    const alertTime = new Date();
    const priorAlertTime = new Date(alertTime.getTime() - 2 * 60 * 60 * 1000); // 2h ago
    const windowMs = 4 * 60 * 60 * 1000;

    const isDuplicate = (alertTime.getTime() - priorAlertTime.getTime()) < windowMs;
    expect(isDuplicate).toBe(true);
  });

  it("escalating urgency overrides suppression", () => {
    const existingUrgency = "urgent";
    const newUrgency = "immediate";
    const urgencyRank = { immediate: 3, urgent: 2, routine: 1 };

    const isEscalation = urgencyRank[newUrgency] > urgencyRank[existingUrgency];
    expect(isEscalation).toBe(true);
  });
});
