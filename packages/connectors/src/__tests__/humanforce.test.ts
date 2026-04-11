import { describe, it, expect } from "vitest";
import { mapHumanforceRoleToCategory } from "../humanforce/role-mapping";

describe("Humanforce role mapping", () => {
  it("maps Registered Nurse → rn", () => {
    expect(mapHumanforceRoleToCategory("Registered Nurse")).toBe("rn");
  });

  it("maps Senior Carer → ain", () => {
    expect(mapHumanforceRoleToCategory("Senior Carer")).toBe("ain");
  });

  it("maps Enrolled Nurse → en", () => {
    expect(mapHumanforceRoleToCategory("Enrolled Nurse")).toBe("en");
  });

  it("maps Kitchen Staff → cleaning_catering", () => {
    expect(mapHumanforceRoleToCategory("Kitchen Staff")).toBe("cleaning_catering");
  });

  it("maps Team Leader → management", () => {
    expect(mapHumanforceRoleToCategory("Team Leader")).toBe("management");
  });

  it("maps unknown → other", () => {
    expect(mapHumanforceRoleToCategory("Volunteer")).toBe("other");
  });

  it("is case-insensitive", () => {
    expect(mapHumanforceRoleToCategory("REGISTERED NURSE")).toBe("rn");
    expect(mapHumanforceRoleToCategory("care worker")).toBe("ain");
  });
});
