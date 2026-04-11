// ============================================================================
// Deputy Connector
// Pulls rostering and workforce data from Deputy, de-identifies at boundary,
// and writes to CHRIS canonical tables.
//
// Deputy API: https://developer.deputy.com/deputy-docs/reference/
// Auth: OAuth2, per-installation base URL
// Rate limit: 500 requests/hour, exponential backoff on 429
// ============================================================================

import { BaseConnector } from "../base";
import type {
  ConnectorConfig,
  ConnectorPullResult,
  ConnectorHealth,
  DataAnomaly,
} from "../types";
import {
  buildEmployeeMap,
  type DeputyEmployee,
  type AnonymisedEmployee,
} from "./deidentify";
import type { RoleCategory } from "@chris/db";
import { db, facilityRostering, facilityWorkforce, facilities } from "@chris/db";
import { eq, and, sql } from "drizzle-orm";

// --- Internal types (never stored) ---

interface DeputyRoster {
  Id: number;
  Employee: number;
  StartTime: number; // Unix timestamp
  EndTime: number;
  Date: string; // YYYY-MM-DD
  OperationalUnitObject?: { ShowName?: string };
  [key: string]: unknown;
}

interface DeputyTimesheet {
  Id: number;
  Employee: number;
  StartTime: number;
  EndTime: number;
  Date: string;
  [key: string]: unknown;
}

interface DeputyLeave {
  Id: number;
  Employee: number;
  DateFrom: string;
  DateTo: string;
  Hours: number;
  LeaveRuleId: number;
  [key: string]: unknown;
}

// --- Aggregated (de-identified) types ---

interface ShiftAggregation {
  shiftDate: string;
  shiftType: "morning" | "afternoon" | "night" | "split";
  scheduledHours: Record<RoleCategory, number>;
  actualHours: Record<RoleCategory, number>;
  agencyShifts: number;
  unfilledShifts: number;
}

interface WorkforceAggregation {
  roleCategory: RoleCategory;
  employmentType: string;
  headcount: number;
  fte: number;
  sickLeaveHours: number;
  sickLeaveOccasions: number;
}

interface ProcessedDeputyData {
  shifts: ShiftAggregation[];
  workforce: WorkforceAggregation[];
  operationalBeds: number;
  directCareFactor: number;
  careMinutesThresholds: { total: number; rn: number };
}

export class DeputyConnector extends BaseConnector {
  private baseUrl: string;
  private accessToken: string;

  constructor(config: ConnectorConfig) {
    super(config);
    this.baseUrl = config.credentials.baseUrl ?? "";
    this.accessToken = config.credentials.accessToken ?? "";
  }

  async pull(since: Date): Promise<ConnectorPullResult> {
    const errors: ConnectorPullResult["errors"] = [];
    const warnings: string[] = [];
    const until = new Date();

    try {
      // 1. Fetch and de-identify employees
      const employees = await this.fetchEmployees();
      const employeeMap = buildEmployeeMap(employees);

      // 2. Fetch rosters
      const rosters = await this.fetchRosters(since, until);

      // 3. Fetch timesheets
      const timesheets = await this.fetchTimesheets(since, until);

      // 4. Fetch leave
      const leave = await this.fetchLeave(since, until);

      // 5. Aggregate into de-identified shifts and workforce
      const processed = this.processData(
        employeeMap,
        rosters,
        timesheets,
        leave,
        since,
        until
      );

      // 6. Detect anomalies
      const anomalies = this.detectAnomalies(processed);

      // 7. Write to canonical store (idempotent upserts)
      const recordsWritten = await this.writeToCanonical(processed);

      return this.buildResult({
        periodStart: since,
        periodEnd: until,
        recordsExtracted: employees.length + rosters.length + timesheets.length + leave.length,
        recordsWritten,
        errors,
        warnings,
        anomalies,
      });
    } catch (err) {
      errors.push({
        code: "PULL_FAILED",
        message: err instanceof Error ? err.message : String(err),
        retryable: true,
      });
      return this.buildResult({
        periodStart: since,
        periodEnd: until,
        recordsExtracted: 0,
        recordsWritten: 0,
        errors,
        warnings,
        anomalies: [],
      });
    }
  }

  async healthCheck(): Promise<ConnectorHealth> {
    try {
      const response = await this.fetchWithRetry(
        `${this.baseUrl}/api/v1/my/location`,
        {
          headers: { Authorization: `Bearer ${this.accessToken}` },
        },
        0 // No retries on health check
      );

      if (response.ok) {
        return {
          status: "healthy",
          sourceSystem: "deputy",
          lastSuccessfulPull: this.config.lastSuccessfulPull,
        };
      }

      if (response.status === 401) {
        return {
          status: "degraded",
          sourceSystem: "deputy",
          lastSuccessfulPull: this.config.lastSuccessfulPull,
          error: "authentication_failed",
        };
      }

      return {
        status: "degraded",
        sourceSystem: "deputy",
        lastSuccessfulPull: this.config.lastSuccessfulPull,
        error: `http_${response.status}`,
      };
    } catch {
      return {
        status: "degraded",
        sourceSystem: "deputy",
        lastSuccessfulPull: this.config.lastSuccessfulPull,
        error: "timeout",
      };
    }
  }

  // --- Private: Fetch from Deputy API ---

  private async fetchEmployees(): Promise<DeputyEmployee[]> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/v1/resource/Employee`,
      {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      }
    );

    if (!response.ok) {
      throw new Error(`Deputy employees fetch failed: ${response.status}`);
    }

    return response.json();
  }

  private async fetchRosters(since: Date, until: Date): Promise<DeputyRoster[]> {
    const sinceStr = since.toISOString().split("T")[0];
    const untilStr = until.toISOString().split("T")[0];

    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/v1/resource/Roster?search[Date][gt]=${sinceStr}&search[Date][lte]=${untilStr}`,
      {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      }
    );

    if (!response.ok) {
      throw new Error(`Deputy rosters fetch failed: ${response.status}`);
    }

    return response.json();
  }

  private async fetchTimesheets(since: Date, until: Date): Promise<DeputyTimesheet[]> {
    const sinceStr = since.toISOString().split("T")[0];

    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/v1/resource/Timesheet?search[Date][gt]=${sinceStr}`,
      {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      }
    );

    if (!response.ok) {
      throw new Error(`Deputy timesheets fetch failed: ${response.status}`);
    }

    return response.json();
  }

  private async fetchLeave(since: Date, until: Date): Promise<DeputyLeave[]> {
    const sinceStr = since.toISOString().split("T")[0];

    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/v1/resource/Leave?search[DateFrom][gt]=${sinceStr}`,
      {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      }
    );

    if (!response.ok) {
      throw new Error(`Deputy leave fetch failed: ${response.status}`);
    }

    return response.json();
  }

  // --- Private: Process and aggregate (all de-identified) ---

  private processData(
    employeeMap: Map<number, AnonymisedEmployee>,
    rosters: DeputyRoster[],
    timesheets: DeputyTimesheet[],
    leave: DeputyLeave[],
    since: Date,
    until: Date
  ): ProcessedDeputyData {
    // Aggregate roster hours by date + shift type + role category
    const shiftMap = new Map<string, ShiftAggregation>();

    for (const roster of rosters) {
      const employee = employeeMap.get(roster.Employee);
      if (!employee) continue;

      const shiftDate = roster.Date;
      const shiftType = this.classifyShiftType(roster.StartTime);
      const key = `${shiftDate}:${shiftType}`;

      if (!shiftMap.has(key)) {
        shiftMap.set(key, {
          shiftDate,
          shiftType,
          scheduledHours: this.emptyRoleHours(),
          actualHours: this.emptyRoleHours(),
          agencyShifts: 0,
          unfilledShifts: 0,
        });
      }

      const shift = shiftMap.get(key)!;
      const hours = (roster.EndTime - roster.StartTime) / 3600;
      shift.scheduledHours[employee.roleCategory] += hours;

      if (employee.employmentType === "agency") {
        shift.agencyShifts++;
      }
    }

    // Layer in actual hours from timesheets
    for (const timesheet of timesheets) {
      const employee = employeeMap.get(timesheet.Employee);
      if (!employee) continue;

      const shiftDate = timesheet.Date;
      const shiftType = this.classifyShiftType(timesheet.StartTime);
      const key = `${shiftDate}:${shiftType}`;

      if (!shiftMap.has(key)) {
        shiftMap.set(key, {
          shiftDate,
          shiftType,
          scheduledHours: this.emptyRoleHours(),
          actualHours: this.emptyRoleHours(),
          agencyShifts: 0,
          unfilledShifts: 0,
        });
      }

      const shift = shiftMap.get(key)!;
      const hours = (timesheet.EndTime - timesheet.StartTime) / 3600;
      shift.actualHours[employee.roleCategory] += hours;
    }

    // Aggregate workforce by role + employment type
    const workforceMap = new Map<string, WorkforceAggregation>();
    for (const [, employee] of employeeMap) {
      const key = `${employee.roleCategory}:${employee.employmentType}`;
      if (!workforceMap.has(key)) {
        workforceMap.set(key, {
          roleCategory: employee.roleCategory,
          employmentType: employee.employmentType,
          headcount: 0,
          fte: 0,
          sickLeaveHours: 0,
          sickLeaveOccasions: 0,
        });
      }
      const wf = workforceMap.get(key)!;
      wf.headcount++;
    }

    // Aggregate leave hours into workforce
    for (const leaveRecord of leave) {
      const employee = employeeMap.get(leaveRecord.Employee);
      if (!employee) continue;

      const key = `${employee.roleCategory}:${employee.employmentType}`;
      const wf = workforceMap.get(key);
      if (wf) {
        wf.sickLeaveHours += leaveRecord.Hours;
        wf.sickLeaveOccasions++;
      }
    }

    return {
      shifts: Array.from(shiftMap.values()),
      workforce: Array.from(workforceMap.values()),
      operationalBeds: 0, // Will be fetched from facility record
      directCareFactor: 0.9, // Default, overridden by facility config
      careMinutesThresholds: { total: 200, rn: 40 },
    };
  }

  private classifyShiftType(unixTimestamp: number): "morning" | "afternoon" | "night" | "split" {
    const date = new Date(unixTimestamp * 1000);
    const hour = date.getHours();

    if (hour >= 6 && hour < 14) return "morning";
    if (hour >= 14 && hour < 22) return "afternoon";
    return "night";
  }

  private emptyRoleHours(): Record<RoleCategory, number> {
    return {
      rn: 0,
      en: 0,
      ain: 0,
      allied_health: 0,
      admin: 0,
      management: 0,
      cleaning_catering: 0,
      other: 0,
    };
  }

  // --- Private: Write to canonical store (idempotent upserts) ---

  async writeToCanonical(data: ProcessedDeputyData): Promise<number> {
    let recordsWritten = 0;

    // Fetch facility for operational_beds and config
    const [facility] = await db
      .select()
      .from(facilities)
      .where(eq(facilities.id, this.config.facilityId));

    if (!facility) {
      throw new Error(`Facility ${this.config.facilityId} not found`);
    }

    const operationalBeds = facility.operationalBeds ?? 0;
    const facilityConfig = (facility.config as Record<string, unknown>) ?? {};
    const directCareFactor =
      (facilityConfig.direct_care_factor as number) ?? 0.9;
    const thresholds = (facilityConfig.care_minutes_thresholds as {
      total: number;
      rn: number;
    }) ?? { total: 200, rn: 40 };

    // Upsert rostering rows
    for (const shift of data.shifts) {
      const rnMinutes = shift.actualHours.rn * 60 * directCareFactor;
      const enMinutes = shift.actualHours.en * 60 * directCareFactor;
      const ainMinutes = shift.actualHours.ain * 60 * directCareFactor;
      const totalMinutes = rnMinutes + enMinutes + ainMinutes;

      // Care minutes compliance (per-shift, daily total calculated elsewhere)
      let complianceStatus: string | null = null;
      if (operationalBeds > 0) {
        const perResidentTotal = totalMinutes / operationalBeds;
        const perResidentRn = rnMinutes / operationalBeds;

        if (
          perResidentTotal >= thresholds.total &&
          perResidentRn >= thresholds.rn
        ) {
          complianceStatus = "compliant";
        } else if (
          perResidentTotal >= thresholds.total * 0.95 &&
          perResidentRn >= thresholds.rn * 0.95
        ) {
          complianceStatus = "at_risk";
        } else {
          complianceStatus = "non_compliant";
        }
      }

      await db
        .insert(facilityRostering)
        .values({
          facilityId: this.config.facilityId,
          shiftDate: shift.shiftDate,
          shiftType: shift.shiftType,
          sourceSystem: "deputy",
          scheduledRnHours: String(shift.scheduledHours.rn),
          actualRnHours: String(shift.actualHours.rn),
          scheduledEnHours: String(shift.scheduledHours.en),
          actualEnHours: String(shift.actualHours.en),
          scheduledAinHours: String(shift.scheduledHours.ain),
          actualAinHours: String(shift.actualHours.ain),
          operationalBeds,
          requiredTotalMinutes: String(thresholds.total),
          requiredRnMinutes: String(thresholds.rn),
          actualTotalMinutes: String(totalMinutes),
          actualRnMinutes: String(rnMinutes),
          careMinutesComplianceStatus: complianceStatus,
          agencyShifts: shift.agencyShifts,
          unfilledShifts: shift.unfilledShifts,
          rnCoverageGap: shift.actualHours.rn === 0,
          rnCoverageGapHours:
            shift.actualHours.rn === 0
              ? String(shift.scheduledHours.rn)
              : "0",
        })
        .onConflictDoUpdate({
          target: [
            facilityRostering.facilityId,
            facilityRostering.shiftDate,
            facilityRostering.shiftType,
            facilityRostering.sourceSystem,
          ],
          set: {
            scheduledRnHours: String(shift.scheduledHours.rn),
            actualRnHours: String(shift.actualHours.rn),
            scheduledEnHours: String(shift.scheduledHours.en),
            actualEnHours: String(shift.actualHours.en),
            scheduledAinHours: String(shift.scheduledHours.ain),
            actualAinHours: String(shift.actualHours.ain),
            operationalBeds,
            actualTotalMinutes: String(totalMinutes),
            actualRnMinutes: String(rnMinutes),
            careMinutesComplianceStatus: complianceStatus,
            agencyShifts: shift.agencyShifts,
            unfilledShifts: shift.unfilledShifts,
            rnCoverageGap: shift.actualHours.rn === 0,
            rnCoverageGapHours:
              shift.actualHours.rn === 0
                ? String(shift.scheduledHours.rn)
                : "0",
            ingestedAt: sql`NOW()`,
          },
        });

      recordsWritten++;
    }

    // Upsert workforce rows
    const periodStart = data.shifts.length > 0
      ? data.shifts.reduce((min, s) => (s.shiftDate < min ? s.shiftDate : min), data.shifts[0].shiftDate)
      : new Date().toISOString().split("T")[0];
    const periodEnd = data.shifts.length > 0
      ? data.shifts.reduce((max, s) => (s.shiftDate > max ? s.shiftDate : max), data.shifts[0].shiftDate)
      : periodStart;

    for (const wf of data.workforce) {
      await db
        .insert(facilityWorkforce)
        .values({
          facilityId: this.config.facilityId,
          periodStart,
          periodEnd,
          sourceSystem: "deputy",
          roleCategory: wf.roleCategory,
          employmentType: wf.employmentType,
          headcount: wf.headcount,
          fte: String(wf.fte || wf.headcount),
          sickLeaveHours: String(wf.sickLeaveHours),
          sickLeaveOccasions: wf.sickLeaveOccasions,
        })
        .onConflictDoUpdate({
          target: [
            facilityWorkforce.facilityId,
            facilityWorkforce.periodStart,
            facilityWorkforce.periodEnd,
            facilityWorkforce.roleCategory,
            facilityWorkforce.employmentType,
            facilityWorkforce.sourceSystem,
          ],
          set: {
            headcount: wf.headcount,
            fte: String(wf.fte || wf.headcount),
            sickLeaveHours: String(wf.sickLeaveHours),
            sickLeaveOccasions: wf.sickLeaveOccasions,
            ingestedAt: sql`NOW()`,
          },
        });

      recordsWritten++;
    }

    // Update facility last_ingestion_at
    await db
      .update(facilities)
      .set({ lastIngestionAt: new Date() })
      .where(eq(facilities.id, this.config.facilityId));

    return recordsWritten;
  }

  // --- Private: Anomaly detection ---

  detectAnomalies(data: ProcessedDeputyData): DataAnomaly[] {
    const anomalies: DataAnomaly[] = [];

    // zero_rn_shift: any shift with 0 actual RN hours → CRITICAL
    for (const shift of data.shifts) {
      if (shift.actualHours.rn === 0) {
        anomalies.push({
          type: "zero_rn_shift",
          description: `Zero RN hours on ${shift.shiftDate} (${shift.shiftType} shift). Facility may be non-compliant with 24/7 RN requirement.`,
          severity: "critical",
          affectedDate: shift.shiftDate,
          recommendation:
            "Immediate review required. Check if RN coverage was provided by agency staff not captured in Deputy.",
        });
      }
    }

    // care_minutes_gap: 3+ consecutive non-compliant days → HIGH
    const datesSorted = [...new Set(data.shifts.map((s) => s.shiftDate))].sort();
    let consecutiveNonCompliant = 0;

    for (const date of datesSorted) {
      const dayShifts = data.shifts.filter((s) => s.shiftDate === date);
      const totalRnHours = dayShifts.reduce(
        (sum, s) => sum + s.actualHours.rn,
        0
      );
      // Simplified check — full care minutes check happens in the engine
      if (totalRnHours === 0) {
        consecutiveNonCompliant++;
        if (consecutiveNonCompliant >= 3) {
          anomalies.push({
            type: "care_minutes_gap",
            description: `${consecutiveNonCompliant} consecutive days with potential care minutes non-compliance ending ${date}.`,
            severity: "high",
            affectedDate: date,
            recommendation:
              "Review rostering patterns. Sustained non-compliance triggers ACQSC reporting obligations.",
          });
        }
      } else {
        consecutiveNonCompliant = 0;
      }
    }

    // agency_spike: agency shifts > 30% in any 7-day window → MEDIUM
    if (datesSorted.length >= 7) {
      for (let i = 6; i < datesSorted.length; i++) {
        const windowDates = datesSorted.slice(i - 6, i + 1);
        const windowShifts = data.shifts.filter((s) =>
          windowDates.includes(s.shiftDate)
        );
        const totalShifts = windowShifts.length;
        const agencyShifts = windowShifts.reduce(
          (sum, s) => sum + s.agencyShifts,
          0
        );

        if (totalShifts > 0 && agencyShifts / totalShifts > 0.3) {
          anomalies.push({
            type: "agency_spike",
            description: `Agency shifts at ${Math.round((agencyShifts / totalShifts) * 100)}% in 7-day window ending ${datesSorted[i]}.`,
            severity: "medium",
            affectedDate: datesSorted[i],
            recommendation:
              "High agency dependency increases cost and reduces care continuity. Review recruitment pipeline.",
          });
          break; // One alert per pull is sufficient
        }
      }
    }

    return anomalies;
  }
}
