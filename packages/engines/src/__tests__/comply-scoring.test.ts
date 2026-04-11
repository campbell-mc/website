import { describe, it, expect } from "vitest";
import { scoreAudit, COMPLY_QUESTIONS } from "../comply/scoring";

describe("Comply scoring engine", () => {
  it("all Yes → 100 points, compliant", () => {
    const answers = COMPLY_QUESTIONS.map((q) => ({
      questionId: q.id,
      response: "yes" as const,
    }));
    const result = scoreAudit(answers);

    expect(result.total).toBe(100);
    expect(result.percentage).toBe(100);
    expect(result.conversionPriority).toBe("low");
    expect(result.criticalGaps).toHaveLength(0);
  });

  it("all No → 0 points, critical priority", () => {
    const answers = COMPLY_QUESTIONS.map((q) => ({
      questionId: q.id,
      response: "no" as const,
    }));
    const result = scoreAudit(answers);

    expect(result.total).toBe(0);
    expect(result.conversionPriority).toBe("critical");
    expect(result.criticalGaps.length).toBeGreaterThan(0);
    expect(result.criticalGaps.length).toBeLessThanOrEqual(3);
  });

  it("all Partially → 50 points, high priority", () => {
    const answers = COMPLY_QUESTIONS.map((q) => ({
      questionId: q.id,
      response: "partially" as const,
    }));
    const result = scoreAudit(answers);

    expect(result.total).toBe(50);
    expect(result.conversionPriority).toBe("high");
  });

  it("Unsure treated as No (0 points)", () => {
    const answers = COMPLY_QUESTIONS.map((q) => ({
      questionId: q.id,
      response: "unsure" as const,
    }));
    const result = scoreAudit(answers);

    expect(result.total).toBe(0);
  });

  it("domain scores add up to total", () => {
    const answers = COMPLY_QUESTIONS.map((q, i) => ({
      questionId: q.id,
      response: (i % 3 === 0 ? "yes" : i % 3 === 1 ? "partially" : "no") as "yes" | "partially" | "no",
    }));
    const result = scoreAudit(answers);

    const domainSum = result.domains.reduce((s, d) => s + d.score, 0);
    expect(Math.abs(domainSum - result.total)).toBeLessThan(0.2); // Rounding tolerance
  });

  it("conversion priority thresholds are correct", () => {
    // < 50 → critical
    expect(scoreAudit(COMPLY_QUESTIONS.map((q) => ({ questionId: q.id, response: "no" as const }))).conversionPriority).toBe("critical");

    // 50 → high (all partially = 50)
    expect(scoreAudit(COMPLY_QUESTIONS.map((q) => ({ questionId: q.id, response: "partially" as const }))).conversionPriority).toBe("high");

    // 100 → low
    expect(scoreAudit(COMPLY_QUESTIONS.map((q) => ({ questionId: q.id, response: "yes" as const }))).conversionPriority).toBe("low");
  });

  it("has 19 total questions across 5 domains", () => {
    expect(COMPLY_QUESTIONS).toHaveLength(19);
    expect(new Set(COMPLY_QUESTIONS.map((q) => q.domain)).size).toBe(5);
  });

  it("max points sum to 100", () => {
    const total = COMPLY_QUESTIONS.reduce((s, q) => s + q.maxPoints, 0);
    expect(total).toBeCloseTo(100, 0);
  });
});
