import { describe, it, expect } from "vitest";
import {
  deidentifyEmployee,
  assertNoPII,
  type DeputyEmployee,
} from "../deputy/deidentify";

describe("Deputy de-identification", () => {
  it("strips all PII from employee records", () => {
    const employee: DeputyEmployee = {
      Id: 1,
      FirstName: "Jane",
      LastName: "Smith",
      DisplayName: "Jane Smith",
      Email: "jane@example.com",
      Phone: "0412345678",
      Mobile: "0412345678",
      Address1: "123 Main St",
      DateOfBirth: "1985-03-15",
      Role: 5,
      RoleObject: { Name: "Registered Nurse" },
      Active: true,
      EmploymentType: 1,
    };

    const result = deidentifyEmployee(employee);

    // Should have ONLY these three fields
    expect(result).toEqual({
      internalId: 1,
      roleCategory: "rn",
      employmentType: "permanent_ft",
    });

    // Verify no PII survived
    const resultObj = result as unknown as Record<string, unknown>;
    expect(resultObj.FirstName).toBeUndefined();
    expect(resultObj.LastName).toBeUndefined();
    expect(resultObj.Email).toBeUndefined();
    expect(resultObj.Phone).toBeUndefined();
    expect(resultObj.Address1).toBeUndefined();
    expect(resultObj.DateOfBirth).toBeUndefined();
  });

  it("assertNoPII throws on PII fields", () => {
    expect(() =>
      assertNoPII({ FirstName: "Jane", roleCategory: "rn" })
    ).toThrow("PII field");
  });

  it("assertNoPII passes on clean records", () => {
    expect(() =>
      assertNoPII({ roleCategory: "rn", headcount: 5 })
    ).not.toThrow();
  });

  it("maps Deputy employment types correctly", () => {
    const ft = deidentifyEmployee({
      Id: 1,
      EmploymentType: 1,
      RoleObject: { Name: "AIN" },
    });
    expect(ft.employmentType).toBe("permanent_ft");

    const pt = deidentifyEmployee({
      Id: 2,
      EmploymentType: 2,
      RoleObject: { Name: "AIN" },
    });
    expect(pt.employmentType).toBe("permanent_pt");

    const casual = deidentifyEmployee({
      Id: 3,
      EmploymentType: 3,
      RoleObject: { Name: "AIN" },
    });
    expect(casual.employmentType).toBe("casual");
  });
});
