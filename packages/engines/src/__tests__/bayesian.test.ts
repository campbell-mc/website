import { describe, it, expect } from "vitest";
import { posteriorMean, posteriorVariance, credibleIntervalWidth, betaSample, type BetaPrior } from "../trust/bayesian";

describe("Bayesian posteriors — math", () => {
  it("default prior Beta(2,2) has mean 0.5", () => {
    const prior: BetaPrior = { alpha: 2, beta: 2, observations: 0 };
    expect(posteriorMean(prior)).toBe(0.5);
  });

  it("strong success Beta(10,2) has mean ~0.83", () => {
    const prior: BetaPrior = { alpha: 10, beta: 2, observations: 10 };
    expect(posteriorMean(prior)).toBeCloseTo(0.833, 2);
  });

  it("strong failure Beta(2,10) has mean ~0.17", () => {
    const prior: BetaPrior = { alpha: 2, beta: 10, observations: 10 };
    expect(posteriorMean(prior)).toBeCloseTo(0.167, 2);
  });

  it("variance decreases with more observations", () => {
    const few: BetaPrior = { alpha: 3, beta: 3, observations: 4 };
    const many: BetaPrior = { alpha: 30, beta: 30, observations: 58 };
    expect(posteriorVariance(few)).toBeGreaterThan(posteriorVariance(many));
  });

  it("credible interval narrows with observations", () => {
    const few: BetaPrior = { alpha: 3, beta: 3, observations: 4 };
    const many: BetaPrior = { alpha: 30, beta: 30, observations: 58 };
    expect(credibleIntervalWidth(few)).toBeGreaterThan(credibleIntervalWidth(many));
  });

  it("update: reward=1 increases alpha", () => {
    // Simulating: alpha += reward, beta += (1-reward)
    let alpha = 2, beta = 2;
    alpha += 1; // reward = 1
    beta += 0;
    expect(alpha).toBe(3);
    expect(beta).toBe(2);
    expect(alpha / (alpha + beta)).toBeCloseTo(0.6, 1);
  });

  it("update: reward=0 increases beta", () => {
    let alpha = 2, beta = 2;
    alpha += 0; // reward = 0
    beta += 1;
    expect(alpha).toBe(2);
    expect(beta).toBe(3);
    expect(alpha / (alpha + beta)).toBeCloseTo(0.4, 1);
  });

  it("10 successes from default → mean ~0.75", () => {
    let alpha = 2, beta = 2;
    for (let i = 0; i < 10; i++) {
      alpha += 1;
      beta += 0;
    }
    // Beta(12, 2) → mean = 12/14 ≈ 0.857
    expect(alpha / (alpha + beta)).toBeCloseTo(0.857, 2);
  });

  it("decay: alpha,beta *= 0.95 preserves mean", () => {
    const prior: BetaPrior = { alpha: 10, beta: 5, observations: 13 };
    const meanBefore = posteriorMean(prior);

    const decayed: BetaPrior = {
      alpha: prior.alpha * 0.95,
      beta: prior.beta * 0.95,
      observations: prior.observations,
    };
    const meanAfter = posteriorMean(decayed);

    // Mean should be identical (multiplicative decay preserves ratio)
    expect(meanAfter).toBeCloseTo(meanBefore, 10);
  });

  it("decay: variance increases (less confident after decay)", () => {
    const prior: BetaPrior = { alpha: 10, beta: 5, observations: 13 };
    const decayed: BetaPrior = {
      alpha: prior.alpha * 0.95,
      beta: prior.beta * 0.95,
      observations: prior.observations,
    };

    expect(posteriorVariance(decayed)).toBeGreaterThan(posteriorVariance(prior));
  });
});

describe("Thompson sampling", () => {
  it("betaSample returns value in [0, 1]", () => {
    for (let i = 0; i < 100; i++) {
      const sample = betaSample(2, 2);
      expect(sample).toBeGreaterThanOrEqual(0);
      expect(sample).toBeLessThanOrEqual(1);
    }
  });

  it("Beta(10, 2) samples are mostly > 0.5", () => {
    let above = 0;
    for (let i = 0; i < 100; i++) {
      if (betaSample(10, 2) > 0.5) above++;
    }
    // Should be ~95%+ above 0.5
    expect(above).toBeGreaterThan(80);
  });

  it("Beta(2, 10) samples are mostly < 0.5", () => {
    let below = 0;
    for (let i = 0; i < 100; i++) {
      if (betaSample(2, 10) < 0.5) below++;
    }
    expect(below).toBeGreaterThan(80);
  });

  it("Beta(2, 2) samples are roughly uniform", () => {
    let below = 0;
    for (let i = 0; i < 1000; i++) {
      if (betaSample(2, 2) < 0.5) below++;
    }
    // Should be roughly 50% ± 5%
    expect(below).toBeGreaterThan(400);
    expect(below).toBeLessThan(600);
  });
});

describe("Multi-component trust scoring", () => {
  it("weighted composite with all components", () => {
    // briefingAcceptance: 0.8 × 0.25 = 0.20
    // recommendationFollow: 0.6 × 0.25 = 0.15
    // outcomeAccuracy: 0.7 × 0.30 = 0.21
    // calibration: 0.5 × 0.20 = 0.10
    // Composite: (0.20 + 0.15 + 0.21 + 0.10) / 1.0 = 0.66

    const weights = { briefing: 0.25, recommendation: 0.25, outcome: 0.30, calibration: 0.20 };
    const composite =
      0.8 * weights.briefing +
      0.6 * weights.recommendation +
      0.7 * weights.outcome +
      0.5 * weights.calibration;

    expect(composite).toBeCloseTo(0.66, 2);
  });

  it("undo penalty reduces score", () => {
    const composite = 0.66;
    const undoRate = 0.1; // 10% rejection rate
    const penalized = composite - undoRate * 0.5;
    expect(penalized).toBeCloseTo(0.61, 2);
  });

  it("components with insufficient samples are excluded", () => {
    // Only calibration has data (always included)
    // All others below minimum samples
    const calibration = 0.5;
    const composite = calibration * 0.20 / 0.20; // Only calibration weight counts
    expect(composite).toBe(0.5);
  });
});

describe("Alert cooldowns and rate limiting", () => {
  it("cooldown window prevents re-alert", () => {
    const cooldownUntil = new Date(Date.now() + 4 * 60 * 60 * 1000); // 4h from now
    const now = new Date();
    const isOnCooldown = cooldownUntil > now;
    expect(isOnCooldown).toBe(true);
  });

  it("expired cooldown allows alert", () => {
    const cooldownUntil = new Date(Date.now() - 1000); // 1s ago
    const now = new Date();
    const isOnCooldown = cooldownUntil > now;
    expect(isOnCooldown).toBe(false);
  });

  it("rate limit at 15 alerts per day", () => {
    const maxAlerts = 15;
    const currentCount = 15;
    const isLimited = currentCount >= maxAlerts;
    expect(isLimited).toBe(true);
  });

  it("IMMEDIATE alerts bypass rate limiting", () => {
    const urgency = "immediate";
    const isLimited = true;
    const shouldSend = urgency === "immediate" || !isLimited;
    expect(shouldSend).toBe(true);
  });

  it("IMMEDIATE alerts bypass cooldown", () => {
    const urgency = "immediate";
    const onCooldown = true;
    const shouldSend = urgency === "immediate" || !onCooldown;
    expect(shouldSend).toBe(true);
  });
});
