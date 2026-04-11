import { describe, it, expect } from "vitest";
import { mapDeputyRoleToCategory } from "../deputy/role-mapping";

describe("Deputy role mapping", () => {
  it("maps Registered Nurse → rn", () => {
    expect(mapDeputyRoleToCategory("Registered Nurse")).toBe("rn");
  });

  it("maps Clinical Nurse Specialist → rn", () => {
    expect(mapDeputyRoleToCategory("Clinical Nurse Specialist")).toBe("rn");
  });

  it("maps Senior Enrolled Nurse → en", () => {
    expect(mapDeputyRoleToCategory("Senior Enrolled Nurse")).toBe("en");
  });

  it("maps Personal Care Worker → ain", () => {
    expect(mapDeputyRoleToCategory("Personal Care Worker")).toBe("ain");
  });

  it("maps Care Assistant → ain", () => {
    expect(mapDeputyRoleToCategory("Care Assistant")).toBe("ain");
  });

  it("maps Occupational Therapist → allied_health", () => {
    expect(mapDeputyRoleToCategory("Occupational Therapist")).toBe("allied_health");
  });

  it("maps Receptionist → admin", () => {
    expect(mapDeputyRoleToCategory("Receptionist")).toBe("admin");
  });

  it("maps Facility Manager → management", () => {
    expect(mapDeputyRoleToCategory("Facility Manager")).toBe("management");
  });

  it("maps Team Leader → management", () => {
    expect(mapDeputyRoleToCategory("Team Leader")).toBe("management");
  });

  it("maps Head Chef → cleaning_catering", () => {
    expect(mapDeputyRoleToCategory("Head Chef")).toBe("cleaning_catering");
  });

  it("maps Cleaner → cleaning_catering", () => {
    expect(mapDeputyRoleToCategory("Cleaner")).toBe("cleaning_catering");
  });

  it("maps Unknown XYZ → other", () => {
    expect(mapDeputyRoleToCategory("Unknown XYZ")).toBe("other");
  });

  it("is case-insensitive", () => {
    expect(mapDeputyRoleToCategory("REGISTERED NURSE")).toBe("rn");
    expect(mapDeputyRoleToCategory("personal care worker")).toBe("ain");
  });
});
