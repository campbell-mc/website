// ============================================================================
// Care Minutes Calculation Engine
//
// AN-ACC requirement: 200 minutes care/resident/day (total), 40 minutes RN.
// Legal requirement under Aged Care Act 2024.
// Non-compliance has financial penalties.
//
// Runs daily at 6am AEST after connector pull.
// Triggers immediate DON alert on non-compliant.
//
// Counting rules:
//   RN → counts toward TOTAL and RN component
//   EN → counts toward TOTAL only
//   AIN → counts toward TOTAL only
//   Allied Health, Admin, Management, Cleaning/Catering → DO NOT count
// ============================================================================

import { db, facilityRostering, facilities, donReviewItems } from "@chris/db";
import type { CareMinutesStatus, DONReviewUrgency } from "@chris/db";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";

export interface CareMinutesResult {
  facilityId: string;
  date: string;
  operationalBeds: number;
  totalRNMinutes: number;
  totalENMinutes: number;
  totalAINMinutes: number;
  totalCareMinutes: number;
  totalCareMinutesPerResident: number;
  rnMinutesPerResident: number;
  complianceStatus: CareMinutesStatus | "unknown";
  shortfallTotalMinutes: number;
  shortfallRNMinutes: number;
  unfilledShifts: number;
  agencyShifts: number;
  consecutiveDaysAtRisk: number;
  consecutiveDaysNonCompliant: number;
}

export interface RollingResult {
  facilityId: string;
  endDate: string;
  daysIncluded: number;
  avgTotalPerResident: number;
  avgRnPerResident: number;
  rollingComplianceStatus: CareMinutesStatus | "unknown";
}

export interface MonthlyReport {
  facilityId: string;
  month: string;
  dailyResults: CareMinutesResult[];
  avgTotalPerResident: number;
  avgRnPerResident: number;
  daysCompliant: number;
  daysAtRisk: number;
  daysNonCompliant: number;
  daysUnknown: number;
  overallStatus: CareMinutesStatus | "unknown";
}

// Default thresholds (configurable per facility)
const DEFAULT_THRESHOLDS = { total: 200, rn: 40 };
const DEFAULT_DIRECT_CARE_FACTOR = 0.9;

export class CareMinutesEngine {
  /**
   * Calculate care minutes for a single day.
   * Sums across ALL shifts for the day.
   */
  async calculateDaily(facilityId: string, date: string): Promise<CareMinutesResult> {
    // Get facility config
    const [facility] = await db
      .select()
      .from(facilities)
      .where(eq(facilities.id, facilityId));

    if (!facility) {
      throw new Error(`Facility ${facilityId} not found`);
    }

    const operationalBeds = facility.operationalBeds ?? 0;
    const config = (facility.config as Record<string, unknown>) ?? {};
    const directCareFactor = (config.direct_care_factor as number) ?? DEFAULT_DIRECT_CARE_FACTOR;
    const thresholds = (config.care_minutes_thresholds as { total: number; rn: number }) ?? DEFAULT_THRESHOLDS;

    // Guard: zero beds
    if (operationalBeds === 0) {
      console.warn(`[CareMinutes] Facility ${facilityId} has 0 operational beds — skipping calculation`);
      return {
        facilityId,
        date,
        operationalBeds: 0,
        totalRNMinutes: 0,
        totalENMinutes: 0,
        totalAINMinutes: 0,
        totalCareMinutes: 0,
        totalCareMinutesPerResident: 0,
        rnMinutesPerResident: 0,
        complianceStatus: "unknown",
        shortfallTotalMinutes: 0,
        shortfallRNMinutes: 0,
        unfilledShifts: 0,
        agencyShifts: 0,
        consecutiveDaysAtRisk: 0,
        consecutiveDaysNonCompliant: 0,
      };
    }

    // Query all rostering rows for this facility and date (all shift types)
    const rows = await db
      .select()
      .from(facilityRostering)
      .where(
        and(
          eq(facilityRostering.facilityId, facilityId),
          eq(facilityRostering.shiftDate, date)
        )
      );

    // Sum actual hours across all shifts
    let totalRnHours = 0;
    let totalEnHours = 0;
    let totalAinHours = 0;
    let totalUnfilled = 0;
    let totalAgency = 0;

    for (const row of rows) {
      totalRnHours += Number(row.actualRnHours ?? 0);
      totalEnHours += Number(row.actualEnHours ?? 0);
      totalAinHours += Number(row.actualAinHours ?? 0);
      totalUnfilled += row.unfilledShifts ?? 0;
      totalAgency += row.agencyShifts ?? 0;
    }

    // Convert to care minutes
    const totalRNMinutes = totalRnHours * 60 * directCareFactor;
    const totalENMinutes = totalEnHours * 60 * directCareFactor;
    const totalAINMinutes = totalAinHours * 60 * directCareFactor;
    const totalCareMinutes = totalRNMinutes + totalENMinutes + totalAINMinutes;

    // Per-resident figures
    const totalCareMinutesPerResident = totalCareMinutes / operationalBeds;
    const rnMinutesPerResident = totalRNMinutes / operationalBeds;

    // Compliance status
    let complianceStatus: CareMinutesStatus;
    if (totalCareMinutesPerResident >= thresholds.total && rnMinutesPerResident >= thresholds.rn) {
      complianceStatus = "compliant";
    } else if (totalCareMinutesPerResident >= thresholds.total * 0.95 && rnMinutesPerResident >= thresholds.rn * 0.95) {
      complianceStatus = "at_risk";
    } else {
      complianceStatus = "non_compliant";
    }

    // Shortfalls
    const shortfallTotalMinutes = Math.max(0, (thresholds.total * operationalBeds) - totalCareMinutes);
    const shortfallRNMinutes = Math.max(0, (thresholds.rn * operationalBeds) - totalRNMinutes);

    // Consecutive days — query prior 6 days
    const { consecutiveDaysAtRisk, consecutiveDaysNonCompliant } =
      await this.calculateConsecutiveDays(facilityId, date);

    // Update compliance status on all rostering rows for this date
    await db
      .update(facilityRostering)
      .set({ careMinutesComplianceStatus: complianceStatus })
      .where(
        and(
          eq(facilityRostering.facilityId, facilityId),
          eq(facilityRostering.shiftDate, date)
        )
      );

    const result: CareMinutesResult = {
      facilityId,
      date,
      operationalBeds,
      totalRNMinutes,
      totalENMinutes,
      totalAINMinutes,
      totalCareMinutes,
      totalCareMinutesPerResident,
      rnMinutesPerResident,
      complianceStatus,
      shortfallTotalMinutes,
      shortfallRNMinutes,
      unfilledShifts: totalUnfilled,
      agencyShifts: totalAgency,
      consecutiveDaysAtRisk,
      consecutiveDaysNonCompliant,
    };

    // DON alerts
    if (complianceStatus === "non_compliant") {
      await this.createDONAlert(facilityId, result, "immediate");
    } else if (consecutiveDaysAtRisk >= 3) {
      await this.createDONAlert(facilityId, result, "urgent");
    }

    return result;
  }

  /**
   * 7-day rolling average for ACQSC reporting.
   */
  async calculateRolling7Day(facilityId: string, endDate: string): Promise<RollingResult> {
    const end = new Date(endDate);
    const start = new Date(end);
    start.setDate(start.getDate() - 6);

    const results: CareMinutesResult[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      const result = await this.calculateDaily(facilityId, dateStr);
      results.push(result);
    }

    const validResults = results.filter((r) => r.complianceStatus !== "unknown");
    if (validResults.length === 0) {
      return {
        facilityId,
        endDate,
        daysIncluded: 0,
        avgTotalPerResident: 0,
        avgRnPerResident: 0,
        rollingComplianceStatus: "unknown",
      };
    }

    const avgTotal = validResults.reduce((s, r) => s + r.totalCareMinutesPerResident, 0) / validResults.length;
    const avgRn = validResults.reduce((s, r) => s + r.rnMinutesPerResident, 0) / validResults.length;

    let status: CareMinutesStatus;
    if (avgTotal >= DEFAULT_THRESHOLDS.total && avgRn >= DEFAULT_THRESHOLDS.rn) {
      status = "compliant";
    } else if (avgTotal >= DEFAULT_THRESHOLDS.total * 0.95 && avgRn >= DEFAULT_THRESHOLDS.rn * 0.95) {
      status = "at_risk";
    } else {
      status = "non_compliant";
    }

    return {
      facilityId,
      endDate,
      daysIncluded: validResults.length,
      avgTotalPerResident: avgTotal,
      avgRnPerResident: avgRn,
      rollingComplianceStatus: status,
    };
  }

  /**
   * Monthly report for Board Pack and Q&R Committee.
   */
  async calculateMonthlyReport(facilityId: string, month: string): Promise<MonthlyReport> {
    const [year, mon] = month.split("-").map(Number);
    const daysInMonth = new Date(year, mon, 0).getDate();

    const dailyResults: CareMinutesResult[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(mon).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const result = await this.calculateDaily(facilityId, dateStr);
      dailyResults.push(result);
    }

    const valid = dailyResults.filter((r) => r.complianceStatus !== "unknown");
    const avgTotal = valid.length > 0
      ? valid.reduce((s, r) => s + r.totalCareMinutesPerResident, 0) / valid.length
      : 0;
    const avgRn = valid.length > 0
      ? valid.reduce((s, r) => s + r.rnMinutesPerResident, 0) / valid.length
      : 0;

    const daysCompliant = dailyResults.filter((r) => r.complianceStatus === "compliant").length;
    const daysAtRisk = dailyResults.filter((r) => r.complianceStatus === "at_risk").length;
    const daysNonCompliant = dailyResults.filter((r) => r.complianceStatus === "non_compliant").length;
    const daysUnknown = dailyResults.filter((r) => r.complianceStatus === "unknown").length;

    let overallStatus: CareMinutesStatus | "unknown";
    if (daysNonCompliant > 0) overallStatus = "non_compliant";
    else if (daysAtRisk > 3) overallStatus = "at_risk";
    else if (valid.length === 0) overallStatus = "unknown";
    else overallStatus = "compliant";

    return {
      facilityId,
      month,
      dailyResults,
      avgTotalPerResident: avgTotal,
      avgRnPerResident: avgRn,
      daysCompliant,
      daysAtRisk,
      daysNonCompliant,
      daysUnknown,
      overallStatus,
    };
  }

  /**
   * Create a DON review item for care minutes breach.
   */
  async createDONAlert(
    facilityId: string,
    result: CareMinutesResult,
    urgency: DONReviewUrgency
  ): Promise<void> {
    const summary = `Care minutes ${result.totalCareMinutesPerResident.toFixed(1)} min/resident (target 200). RN: ${result.rnMinutesPerResident.toFixed(1)} (target 40).`;

    const deadline = urgency === "immediate"
      ? new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 hours
      : new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await db.insert(donReviewItems).values({
      facilityId,
      itemType: "care_minutes_breach",
      urgency,
      summary,
      fullContext: {
        result,
        date: result.date,
        consecutiveDaysAtRisk: result.consecutiveDaysAtRisk,
        consecutiveDaysNonCompliant: result.consecutiveDaysNonCompliant,
      },
      chrisRecommendation: `Review roster for ${result.date}. Unfilled shifts: ${result.unfilledShifts}. Agency shifts: ${result.agencyShifts}. ${
        result.shortfallRNMinutes > 0
          ? `RN shortfall: ${result.shortfallRNMinutes.toFixed(0)} minutes.`
          : ""
      }`,
      deadline,
    });
  }

  /**
   * Calculate consecutive days at risk / non-compliant ending before the given date.
   */
  private async calculateConsecutiveDays(
    facilityId: string,
    date: string
  ): Promise<{ consecutiveDaysAtRisk: number; consecutiveDaysNonCompliant: number }> {
    const d = new Date(date);
    let consecutiveDaysAtRisk = 0;
    let consecutiveDaysNonCompliant = 0;

    // Check prior 6 days
    for (let i = 1; i <= 6; i++) {
      const priorDate = new Date(d);
      priorDate.setDate(priorDate.getDate() - i);
      const priorDateStr = priorDate.toISOString().split("T")[0];

      const rows = await db
        .select({ status: facilityRostering.careMinutesComplianceStatus })
        .from(facilityRostering)
        .where(
          and(
            eq(facilityRostering.facilityId, facilityId),
            eq(facilityRostering.shiftDate, priorDateStr)
          )
        );

      if (rows.length === 0) break;

      // Use the worst status across shifts for the day
      const statuses = rows.map((r) => r.status).filter(Boolean);
      const hasNonCompliant = statuses.includes("non_compliant");
      const hasAtRisk = statuses.includes("at_risk");

      if (hasNonCompliant) {
        consecutiveDaysNonCompliant++;
        consecutiveDaysAtRisk++; // Non-compliant is also "at risk"
      } else if (hasAtRisk) {
        consecutiveDaysAtRisk++;
        consecutiveDaysNonCompliant = 0; // Reset non-compliant streak
      } else {
        break; // Compliant day breaks both streaks
      }
    }

    return { consecutiveDaysAtRisk, consecutiveDaysNonCompliant };
  }
}
