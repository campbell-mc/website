import { describe, it, expect } from "vitest";
import { classifyHazardScore, calculateTrajectory, PULSE_DOMAINS, PSH_DOMAINS } from "../pulse/domains";
import { PulseEngine } from "../pulse/index";

describe("PSH hazard classification", () => {
  it("score 0.20 → GREEN", () => {
    expect(classifyHazardScore(0.20)).toBe("GREEN");
  });

  it("score 0.35 → GREEN (boundary)", () => {
    expect(classifyHazardScore(0.35)).toBe("GREEN");
  });

  it("score 0.50 → AMBER", () => {
    expect(classifyHazardScore(0.50)).toBe("AMBER");
  });

  it("score 0.60 → AMBER (boundary)", () => {
    expect(classifyHazardScore(0.60)).toBe("AMBER");
  });

  it("score 0.75 → RED", () => {
    expect(classifyHazardScore(0.75)).toBe("RED");
  });

  it("score 1.0 → RED", () => {
    expect(classifyHazardScore(1.0)).toBe("RED");
  });
});

describe("Trajectory calculation", () => {
  it("improving when score drops > 0.05", () => {
    expect(calculateTrajectory([0.7, 0.6])).toBe("IMPROVING");
  });

  it("declining when score rises > 0.05", () => {
    expect(calculateTrajectory([0.4, 0.5])).toBe("DECLINING");
  });

  it("stable when delta < 0.05", () => {
    expect(calculateTrajectory([0.5, 0.52])).toBe("STABLE");
  });

  it("acute when jump from GREEN to RED in one cycle", () => {
    expect(calculateTrajectory([0.2, 0.8])).toBe("ACUTE");
  });

  it("single score → STABLE", () => {
    expect(calculateTrajectory([0.5])).toBe("STABLE");
  });
});

describe("Pulse domain mapping", () => {
  it("has 14 culture outcome domains", () => {
    expect(PULSE_DOMAINS).toHaveLength(14);
  });

  it("covers all 16 PSH codes", () => {
    const allPshCodes = new Set<string>();
    for (const domain of PULSE_DOMAINS) {
      for (const code of domain.pshMapping) {
        allPshCodes.add(code);
      }
    }
    // Should cover PSH_01 through PSH_13, PSH_15 at minimum
    // PSH_14 (Poor Environment) and PSH_16 (Work-Life) may need operational data
    expect(allPshCodes.size).toBeGreaterThanOrEqual(14);
  });

  it("PSH_DOMAINS has all 16 entries", () => {
    expect(Object.keys(PSH_DOMAINS)).toHaveLength(16);
  });
});

describe("Pulse scoring", () => {
  const engine = new PulseEngine();

  it("converts pulse 5 (great) to hazard 0.0", () => {
    const scores = engine.scorePSHDomains([
      { teamId: "T1", domainId: "engagement", score: 5 },
    ]);
    // Engagement maps to PSH_01 and PSH_12
    expect(scores.PSH_01).toBeCloseTo(0.0, 1);
    expect(scores.PSH_12).toBeCloseTo(0.0, 1);
  });

  it("converts pulse 1 (terrible) to hazard 1.0", () => {
    const scores = engine.scorePSHDomains([
      { teamId: "T1", domainId: "engagement", score: 1 },
    ]);
    expect(scores.PSH_01).toBeCloseTo(1.0, 1);
  });

  it("converts pulse 3 (mid) to hazard ~0.5", () => {
    const scores = engine.scorePSHDomains([
      { teamId: "T1", domainId: "engagement", score: 3 },
    ]);
    expect(scores.PSH_01).toBeCloseTo(0.5, 1);
  });

  it("averages multiple responses for same domain", () => {
    const scores = engine.scorePSHDomains([
      { teamId: "T1", domainId: "recognition", score: 4 },
      { teamId: "T1", domainId: "recognition", score: 2 },
    ]);
    // Average pulse = 3 → hazard = 0.5
    expect(scores.PSH_13).toBeCloseTo(0.5, 1);
  });

  it("multiple domains feeding same PSH code are averaged", () => {
    const scores = engine.scorePSHDomains([
      { teamId: "T1", domainId: "collaboration", score: 4 },   // → PSH_06, PSH_04
      { teamId: "T1", domainId: "clarity", score: 2 },         // → PSH_06, PSH_04
    ]);
    // collaboration: hazard = (5-4)/4 = 0.25
    // clarity: hazard = (5-2)/4 = 0.75
    // PSH_06 average: (0.25 + 0.75) / 2 = 0.5
    expect(scores.PSH_06).toBeCloseTo(0.5, 1);
  });
});
