// ============================================================================
// Humanforce Connector
// Rostering connector — ~75% code reuse from Deputy.
// Differences: Award-based role taxonomy, Employee Groups for shift types,
// more explicit overtime, different API endpoints.
//
// API: https://api.humanforce.com/
// Auth: OAuth2
// Rate limit: 300 requests/hour
// ============================================================================

import { BaseConnector } from "../base";
import type {
  ConnectorConfig,
  ConnectorPullResult,
  ConnectorHealth,
  DataAnomaly,
} from "../types";
import { mapHumanforceRoleToCategory } from "./role-mapping";
import type { RoleCategory, EmploymentType } from "@chris/db";
import { db, facilityRostering, facilityWorkforce, facilities } from "@chris/db";
import { eq, sql } from "drizzle-orm";

interface AnonymisedEmployee {
  internalId: number;
  roleCategory: RoleCategory;
  employmentType: EmploymentType;
}

interface ShiftAggregation {
  shiftDate: string;
  shiftType: "morning" | "afternoon" | "night" | "split";
  scheduledHours: Record<RoleCategory, number>;
  actualHours: Record<RoleCategory, number>;
  agencyShifts: number;
  unfilledShifts: number;
}

interface ProcessedData {
  shifts: ShiftAggregation[];
  workforce: Array<{
    roleCategory: RoleCategory;
    employmentType: string;
    headcount: number;
    fte: number;
    sickLeaveHours: number;
    sickLeaveOccasions: number;
    overtimeHours: number;
  }>;
}

export class HumanforceConnector extends BaseConnector {
  private baseUrl: string;
  private accessToken: string;

  constructor(config: ConnectorConfig) {
    super(config);
    this.baseUrl = config.credentials.baseUrl ?? "https://api.humanforce.com";
    this.accessToken = config.credentials.accessToken ?? "";
  }

  async pull(since: Date): Promise<ConnectorPullResult> {
    const errors: ConnectorPullResult["errors"] = [];
    const warnings: string[] = [];
    const until = new Date();

    try {
      // 1. Fetch employees → de-identify immediately
      const employeeMap = await this.fetchAndDeidentifyEmployees();

      // 2. Fetch shifts
      const shifts = await this.fetchShifts(since, until, employeeMap);

      // 3. Fetch timesheets
      const timesheets = await this.fetchTimesheets(since, until, employeeMap);

      // 4. Aggregate
      const processed = this.aggregate(employeeMap, shifts, timesheets);

      // 5. Anomalies
      const anomalies = this.detectAnomalies(processed);

      // 6. Write to canonical
      const recordsWritten = await this.writeToCanonical(processed);

      return this.buildResult({
        periodStart: since,
        periodEnd: until,
        recordsExtracted: employeeMap.size + shifts.length + timesheets.length,
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
        `${this.baseUrl}/api/v1/health`,
        { headers: { Authorization: `Bearer ${this.accessToken}` } },
        0
      );

      if (response.ok) {
        return { status: "healthy", sourceSystem: "humanforce", lastSuccessfulPull: this.config.lastSuccessfulPull };
      }
      if (response.status === 401) {
        return { status: "degraded", sourceSystem: "humanforce", lastSuccessfulPull: this.config.lastSuccessfulPull, error: "authentication_failed" };
      }
      return { status: "degraded", sourceSystem: "humanforce", lastSuccessfulPull: this.config.lastSuccessfulPull, error: `http_${response.status}` };
    } catch {
      return { status: "degraded", sourceSystem: "humanforce", lastSuccessfulPull: this.config.lastSuccessfulPull, error: "timeout" };
    }
  }

  private async fetchAndDeidentifyEmployees(): Promise<Map<number, AnonymisedEmployee>> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/v1/employees`,
      { headers: { Authorization: `Bearer ${this.accessToken}` } }
    );
    if (!response.ok) throw new Error(`Humanforce employees fetch failed: ${response.status}`);

    const employees = await response.json() as Array<{
      Id: number;
      Award?: string;
      EmploymentType?: string;
      [key: string]: unknown;
    }>;

    // De-identify: only keep role category and employment type
    const map = new Map<number, AnonymisedEmployee>();
    for (const emp of employees) {
      map.set(emp.Id, {
        internalId: emp.Id,
        roleCategory: mapHumanforceRoleToCategory(emp.Award ?? ""),
        employmentType: this.mapEmploymentType(emp.EmploymentType),
      });
    }
    return map;
  }

  private mapEmploymentType(hfType?: string): EmploymentType {
    switch (hfType?.toLowerCase()) {
      case "full-time":
      case "full_time":
        return "permanent_ft";
      case "part-time":
      case "part_time":
        return "permanent_pt";
      case "casual":
        return "casual";
      case "agency":
        return "agency";
      case "contract":
      case "contractor":
        return "contract";
      default:
        return "casual";
    }
  }

  private async fetchShifts(
    since: Date,
    until: Date,
    employeeMap: Map<number, AnonymisedEmployee>
  ): Promise<ShiftAggregation[]> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/v1/shifts?from=${since.toISOString()}&to=${until.toISOString()}`,
      { headers: { Authorization: `Bearer ${this.accessToken}` } }
    );
    if (!response.ok) throw new Error(`Humanforce shifts fetch failed: ${response.status}`);

    const rawShifts = await response.json() as Array<{
      EmployeeId: number;
      Date: string;
      StartTime: string;
      EndTime: string;
      Hours: number;
      [key: string]: unknown;
    }>;

    const shiftMap = new Map<string, ShiftAggregation>();
    for (const raw of rawShifts) {
      const employee = employeeMap.get(raw.EmployeeId);
      if (!employee) continue;

      const shiftType = this.classifyShiftTime(raw.StartTime);
      const key = `${raw.Date}:${shiftType}`;

      if (!shiftMap.has(key)) {
        shiftMap.set(key, {
          shiftDate: raw.Date,
          shiftType,
          scheduledHours: this.emptyRoleHours(),
          actualHours: this.emptyRoleHours(),
          agencyShifts: 0,
          unfilledShifts: 0,
        });
      }

      const shift = shiftMap.get(key)!;
      shift.scheduledHours[employee.roleCategory] += raw.Hours;
      if (employee.employmentType === "agency") shift.agencyShifts++;
    }

    return Array.from(shiftMap.values());
  }

  private async fetchTimesheets(
    since: Date,
    until: Date,
    employeeMap: Map<number, AnonymisedEmployee>
  ): Promise<ShiftAggregation[]> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/v1/timesheets?from=${since.toISOString()}&to=${until.toISOString()}`,
      { headers: { Authorization: `Bearer ${this.accessToken}` } }
    );
    if (!response.ok) throw new Error(`Humanforce timesheets fetch failed: ${response.status}`);

    const rawTimesheets = await response.json() as Array<{
      EmployeeId: number;
      Date: string;
      StartTime: string;
      Hours: number;
      [key: string]: unknown;
    }>;

    const shiftMap = new Map<string, ShiftAggregation>();
    for (const raw of rawTimesheets) {
      const employee = employeeMap.get(raw.EmployeeId);
      if (!employee) continue;

      const shiftType = this.classifyShiftTime(raw.StartTime);
      const key = `${raw.Date}:${shiftType}`;

      if (!shiftMap.has(key)) {
        shiftMap.set(key, {
          shiftDate: raw.Date,
          shiftType,
          scheduledHours: this.emptyRoleHours(),
          actualHours: this.emptyRoleHours(),
          agencyShifts: 0,
          unfilledShifts: 0,
        });
      }

      shiftMap.get(key)!.actualHours[employee.roleCategory] += raw.Hours;
    }

    return Array.from(shiftMap.values());
  }

  private aggregate(
    employeeMap: Map<number, AnonymisedEmployee>,
    scheduledShifts: ShiftAggregation[],
    actualShifts: ShiftAggregation[]
  ): ProcessedData {
    // Merge scheduled and actual into combined shifts
    const combined = new Map<string, ShiftAggregation>();

    for (const shift of scheduledShifts) {
      combined.set(`${shift.shiftDate}:${shift.shiftType}`, { ...shift });
    }

    for (const actual of actualShifts) {
      const key = `${actual.shiftDate}:${actual.shiftType}`;
      const existing = combined.get(key);
      if (existing) {
        existing.actualHours = actual.actualHours;
      } else {
        combined.set(key, actual);
      }
    }

    // Workforce aggregation
    const workforceMap = new Map<string, ProcessedData["workforce"][0]>();
    for (const [, emp] of employeeMap) {
      const key = `${emp.roleCategory}:${emp.employmentType}`;
      if (!workforceMap.has(key)) {
        workforceMap.set(key, {
          roleCategory: emp.roleCategory,
          employmentType: emp.employmentType,
          headcount: 0,
          fte: 0,
          sickLeaveHours: 0,
          sickLeaveOccasions: 0,
          overtimeHours: 0,
        });
      }
      workforceMap.get(key)!.headcount++;
    }

    return {
      shifts: Array.from(combined.values()),
      workforce: Array.from(workforceMap.values()),
    };
  }

  private detectAnomalies(data: ProcessedData): DataAnomaly[] {
    const anomalies: DataAnomaly[] = [];

    for (const shift of data.shifts) {
      if (shift.actualHours.rn === 0) {
        anomalies.push({
          type: "zero_rn_shift",
          description: `Zero RN hours on ${shift.shiftDate} (${shift.shiftType} shift).`,
          severity: "critical",
          affectedDate: shift.shiftDate,
          recommendation: "Immediate review required for 24/7 RN compliance.",
        });
      }
    }

    const dates = [...new Set(data.shifts.map((s) => s.shiftDate))].sort();
    let consecutive = 0;
    for (const date of dates) {
      const dayRn = data.shifts.filter((s) => s.shiftDate === date).reduce((sum, s) => sum + s.actualHours.rn, 0);
      if (dayRn === 0) {
        consecutive++;
        if (consecutive >= 3) {
          anomalies.push({
            type: "care_minutes_gap",
            description: `${consecutive} consecutive days with zero RN hours ending ${date}.`,
            severity: "high",
            affectedDate: date,
          });
        }
      } else {
        consecutive = 0;
      }
    }

    return anomalies;
  }

  private async writeToCanonical(data: ProcessedData): Promise<number> {
    let written = 0;

    const [facility] = await db.select().from(facilities).where(eq(facilities.id, this.config.facilityId));
    if (!facility) throw new Error(`Facility ${this.config.facilityId} not found`);

    const operationalBeds = facility.operationalBeds ?? 0;
    const config = (facility.config as Record<string, unknown>) ?? {};
    const dcf = (config.direct_care_factor as number) ?? 0.9;
    const thresholds = (config.care_minutes_thresholds as { total: number; rn: number }) ?? { total: 200, rn: 40 };

    for (const shift of data.shifts) {
      const rnMin = shift.actualHours.rn * 60 * dcf;
      const enMin = shift.actualHours.en * 60 * dcf;
      const ainMin = shift.actualHours.ain * 60 * dcf;
      const totalMin = rnMin + enMin + ainMin;

      let status: string | null = null;
      if (operationalBeds > 0) {
        const perResTotal = totalMin / operationalBeds;
        const perResRn = rnMin / operationalBeds;
        if (perResTotal >= thresholds.total && perResRn >= thresholds.rn) status = "compliant";
        else if (perResTotal >= thresholds.total * 0.95 && perResRn >= thresholds.rn * 0.95) status = "at_risk";
        else status = "non_compliant";
      }

      await db.insert(facilityRostering).values({
        facilityId: this.config.facilityId,
        shiftDate: shift.shiftDate,
        shiftType: shift.shiftType,
        sourceSystem: "humanforce",
        scheduledRnHours: String(shift.scheduledHours.rn),
        actualRnHours: String(shift.actualHours.rn),
        scheduledEnHours: String(shift.scheduledHours.en),
        actualEnHours: String(shift.actualHours.en),
        scheduledAinHours: String(shift.scheduledHours.ain),
        actualAinHours: String(shift.actualHours.ain),
        operationalBeds,
        actualTotalMinutes: String(totalMin),
        actualRnMinutes: String(rnMin),
        careMinutesComplianceStatus: status,
        agencyShifts: shift.agencyShifts,
        rnCoverageGap: shift.actualHours.rn === 0,
      }).onConflictDoUpdate({
        target: [facilityRostering.facilityId, facilityRostering.shiftDate, facilityRostering.shiftType, facilityRostering.sourceSystem],
        set: {
          actualRnHours: String(shift.actualHours.rn),
          actualEnHours: String(shift.actualHours.en),
          actualAinHours: String(shift.actualHours.ain),
          actualTotalMinutes: String(totalMin),
          actualRnMinutes: String(rnMin),
          careMinutesComplianceStatus: status,
          agencyShifts: shift.agencyShifts,
          rnCoverageGap: shift.actualHours.rn === 0,
          ingestedAt: sql`NOW()`,
        },
      });
      written++;
    }

    const periodStart = data.shifts[0]?.shiftDate ?? new Date().toISOString().split("T")[0];
    const periodEnd = data.shifts.at(-1)?.shiftDate ?? periodStart;

    for (const wf of data.workforce) {
      await db.insert(facilityWorkforce).values({
        facilityId: this.config.facilityId,
        periodStart,
        periodEnd,
        sourceSystem: "humanforce",
        roleCategory: wf.roleCategory,
        employmentType: wf.employmentType,
        headcount: wf.headcount,
        fte: String(wf.headcount),
        overtimeHours: String(wf.overtimeHours),
      }).onConflictDoUpdate({
        target: [facilityWorkforce.facilityId, facilityWorkforce.periodStart, facilityWorkforce.periodEnd, facilityWorkforce.roleCategory, facilityWorkforce.employmentType, facilityWorkforce.sourceSystem],
        set: { headcount: wf.headcount, overtimeHours: String(wf.overtimeHours), ingestedAt: sql`NOW()` },
      });
      written++;
    }

    await db.update(facilities).set({ lastIngestionAt: new Date() }).where(eq(facilities.id, this.config.facilityId));
    return written;
  }

  private classifyShiftTime(startTime: string): "morning" | "afternoon" | "night" | "split" {
    const hour = new Date(startTime).getHours();
    if (hour >= 6 && hour < 14) return "morning";
    if (hour >= 14 && hour < 22) return "afternoon";
    return "night";
  }

  private emptyRoleHours(): Record<RoleCategory, number> {
    return { rn: 0, en: 0, ain: 0, allied_health: 0, admin: 0, management: 0, cleaning_catering: 0, other: 0 };
  }
}
