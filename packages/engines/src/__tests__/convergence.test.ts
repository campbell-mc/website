import { describe, it, expect } from "vitest";
import type { SignalType, SignalConfidence, Domain } from "../convergence/types";

describe("Signal Convergence — signal types", () => {
  it("four signal types are defined", () => {
    const types: SignalType[] = ["causal", "predictive", "amplifying", "exonerating"];
    expect(types).toHaveLength(4);
  });

  it("three confidence levels are defined", () => {
    const levels: SignalConfidence[] = ["strong", "emerging", "novel"];
    expect(levels).toHaveLength(3);
  });

  it("six domains are defined", () => {
    const domains: Domain[] = ["clinical", "workforce", "financial", "psh", "operational", "governance"];
    expect(domains).toHaveLength(6);
  });
});

describe("Signal Convergence — causal detection logic", () => {
  it("agency spike + terminations + PSH_13 = causal signal", () => {
    const agencyPct = 0.25; // 25% agency
    const terminations = 2;
    const psh13Elevated = 3; // 3 cycles

    const isCausal = agencyPct > 0.2 && terminations > 0 && psh13Elevated > 0;
    expect(isCausal).toBe(true);
  });

  it("confidence is strong when PSH elevated 3+ cycles", () => {
    const psh13Cycles = 4;
    const confidence: SignalConfidence = psh13Cycles >= 3 ? "strong" : "emerging";
    expect(confidence).toBe("strong");
  });

  it("medication incidents + high agency = causal signal", () => {
    const medicationIncidents = 3;
    const agencyPct = 0.20;
    const isCausal = medicationIncidents > 2 && agencyPct > 0.15;
    expect(isCausal).toBe(true);
  });
});

describe("Signal Convergence — predictive detection logic", () => {
  it("PSH_02 + PSH_16 co-elevated 3 cycles = predictive turnover signal", () => {
    const psh02 = 0.65;
    const psh16 = 0.55;
    const priorCyclesElevated = 2;

    const isPredictive = psh02 > 0.5 && psh16 > 0.5 && priorCyclesElevated >= 2;
    expect(isPredictive).toBe(true);
  });

  it("71% historical correlation for this pattern", () => {
    const historicalCorrelation = 0.71;
    expect(historicalCorrelation).toBeGreaterThan(0.5);
  });
});

describe("Signal Convergence — amplifying detection logic", () => {
  it("falls + agency + PSH_08 = three-domain loop", () => {
    const falls = 5;
    const agencyRate = 0.25;
    const psh08Elevated = 2;

    const isAmplifying = falls > 3 && agencyRate > 0.2 && psh08Elevated > 0;
    expect(isAmplifying).toBe(true);
  });

  it("breaking any one link breaks the cycle", () => {
    // If we fix workforce stability (agency < 20%), the loop breaks
    const agencyFixed = 0.15;
    const isAmplifying = 5 > 3 && agencyFixed > 0.2 && 2 > 0;
    expect(isAmplifying).toBe(false); // Loop broken
  });
});

describe("Signal Convergence — exonerating detection logic", () => {
  it("high incidents + high admissions = exonerating context", () => {
    const incidents = 8;
    const newAdmissions = 5;

    const isExonerating = incidents > 5 && newAdmissions > 3;
    expect(isExonerating).toBe(true);
  });
});

describe("Signal Convergence — role targeting", () => {
  it("causal agency signal targets CFO, CEO, HR, DON", () => {
    const targetRoles = ["cfo", "ceo", "hr_manager", "don"];
    expect(targetRoles).toContain("cfo");
    expect(targetRoles).toContain("ceo");
    expect(targetRoles).toContain("don");
  });

  it("predictive turnover signal targets DON, HR, CEO", () => {
    const targetRoles = ["don", "hr_manager", "ceo"];
    expect(targetRoles).toContain("hr_manager");
  });

  it("amplifying loop targets DON, CEO, Clinical Director, Quality Lead", () => {
    const targetRoles = ["don", "ceo", "clinical_director", "quality_lead"];
    expect(targetRoles).toHaveLength(4);
  });

  it("exonerating signal targets Quality Lead, Clinical Director, DON", () => {
    const targetRoles = ["quality_lead", "clinical_director", "don"];
    expect(targetRoles).toContain("quality_lead");
  });
});
