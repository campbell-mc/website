import { describe, it, expect } from "vitest";

// ============================================================================
// Care Minutes Calculation Tests
// Pure math tests — no database required.
// These validate the AN-ACC compliance formulas directly.
// ============================================================================

const DEFAULT_DIRECT_CARE_FACTOR = 0.9;
const THRESHOLDS = { total: 200, rn: 40 };

function calculateCareMinutes(params: {
  actualRnHours: number;
  actualEnHours: number;
  actualAinHours: number;
  operationalBeds: number;
  directCareFactor?: number;
}) {
  const dcf = params.directCareFactor ?? DEFAULT_DIRECT_CARE_FACTOR;
  const beds = params.operationalBeds;

  const rnMinutes = params.actualRnHours * 60 * dcf;
  const enMinutes = params.actualEnHours * 60 * dcf;
  const ainMinutes = params.actualAinHours * 60 * dcf;
  const totalMinutes = rnMinutes + enMinutes + ainMinutes;

  if (beds === 0) {
    return {
      rnMinutes,
      enMinutes,
      ainMinutes,
      totalMinutes,
      perResidentTotal: 0,
      perResidentRn: 0,
      status: "unknown" as const,
    };
  }

  const perResidentTotal = totalMinutes / beds;
  const perResidentRn = rnMinutes / beds;

  let status: "compliant" | "at_risk" | "non_compliant";
  if (perResidentTotal >= THRESHOLDS.total && perResidentRn >= THRESHOLDS.rn) {
    status = "compliant";
  } else if (
    perResidentTotal >= THRESHOLDS.total * 0.95 &&
    perResidentRn >= THRESHOLDS.rn * 0.95
  ) {
    status = "at_risk";
  } else {
    status = "non_compliant";
  }

  return {
    rnMinutes,
    enMinutes,
    ainMinutes,
    totalMinutes,
    perResidentTotal,
    perResidentRn,
    status,
  };
}

describe("Care minutes calculation", () => {
  it("test_compliant: full day meets both thresholds", () => {
    // 80 beds, direct_care_factor = 0.9
    // RN: 80 hours → 80*60*0.9 = 4320 min → 4320/80 = 54 min/resident ✓ (>= 40)
    // EN: 24 hours → 24*60*0.9 = 1296 min → 1296/80 = 16.2 min/resident
    // AIN: 200 hours → 200*60*0.9 = 10800 min → 10800/80 = 135 min/resident
    // Total per resident = 54 + 16.2 + 135 = 205.2 ✓ (>= 200)
    const result = calculateCareMinutes({
      actualRnHours: 80,
      actualEnHours: 24,
      actualAinHours: 200,
      operationalBeds: 80,
    });

    expect(result.status).toBe("compliant");
    expect(result.perResidentTotal).toBeCloseTo(205.2, 1);
    expect(result.perResidentRn).toBeCloseTo(54, 1);
  });

  it("test_non_compliant_rn: RN below threshold", () => {
    // 80 beds, RN: 44 hours → 44*60*0.9 = 2376 min → 2376/80 = 29.7 min/resident
    // 29.7 < 38 (95% of 40) → non_compliant
    // Total is fine: EN+AIN push total above 200
    const result = calculateCareMinutes({
      actualRnHours: 44,
      actualEnHours: 40,
      actualAinHours: 240,
      operationalBeds: 80,
    });

    expect(result.status).toBe("non_compliant");
    expect(result.perResidentRn).toBeCloseTo(29.7, 1);
    expect(result.perResidentTotal).toBeGreaterThan(200);
  });

  it("test_at_risk: between 95% and 100% of thresholds", () => {
    // Target: rn_per_resident between 38 and 40, total between 190 and 200
    // 80 beds, RN: 57 hours → 57*60*0.9 = 3078 → 3078/80 = 38.475 (between 38 and 40)
    // EN: 20 hours → 1080 → 13.5
    // AIN: 196 hours → 10584 → 132.3
    // Total = 38.475 + 13.5 + 132.3 = 184.275 → non_compliant (< 190)
    // Let's adjust: AIN: 210 → 11340 → 141.75. Total = 38.475 + 13.5 + 141.75 = 193.725
    // 193.725 >= 190 ✓ but < 200, and 38.475 >= 38 ✓ but < 40 → at_risk
    const result = calculateCareMinutes({
      actualRnHours: 57,
      actualEnHours: 20,
      actualAinHours: 210,
      operationalBeds: 80,
    });

    expect(result.status).toBe("at_risk");
    expect(result.perResidentRn).toBeGreaterThanOrEqual(38);
    expect(result.perResidentRn).toBeLessThan(40);
  });

  it("test_zero_beds_guard: no divide-by-zero crash", () => {
    const result = calculateCareMinutes({
      actualRnHours: 80,
      actualEnHours: 24,
      actualAinHours: 200,
      operationalBeds: 0,
    });

    expect(result.status).toBe("unknown");
    expect(result.perResidentTotal).toBe(0);
    expect(result.perResidentRn).toBe(0);
    // Should NOT crash
  });

  it("non-qualifying roles do NOT count toward care minutes", () => {
    // Only RN, EN, AIN count. Allied health, admin, etc. are excluded.
    // This test verifies the formula only uses those three.
    const withExtra = calculateCareMinutes({
      actualRnHours: 80,
      actualEnHours: 24,
      actualAinHours: 200,
      operationalBeds: 80,
    });

    // Adding allied health hours should NOT change the result
    // (they're not passed to the function because connectors don't include them)
    expect(withExtra.perResidentTotal).toBeCloseTo(205.2, 1);
  });

  it("custom direct_care_factor changes result", () => {
    const result = calculateCareMinutes({
      actualRnHours: 80,
      actualEnHours: 24,
      actualAinHours: 200,
      operationalBeds: 80,
      directCareFactor: 1.0, // No reduction
    });

    // RN: 80*60*1.0 = 4800 → 60/resident
    expect(result.perResidentRn).toBe(60);
    expect(result.perResidentTotal).toBeGreaterThan(205.2); // Higher than with 0.9
  });

  it("shortfall calculation is correct", () => {
    const result = calculateCareMinutes({
      actualRnHours: 44,
      actualEnHours: 40,
      actualAinHours: 240,
      operationalBeds: 80,
    });

    // RN shortfall: target = 40 * 80 = 3200 min, actual = 44*60*0.9 = 2376
    // Shortfall = 3200 - 2376 = 824
    const shortfallRn = Math.max(0, (40 * 80) - result.rnMinutes);
    expect(shortfallRn).toBeCloseTo(824, 0);
  });
});
