// ============================================================================
// Deputy Role Mapping
// Maps Deputy role titles to CHRIS canonical role categories.
// Case-insensitive partial matching.
// ============================================================================

import type { RoleCategory } from "@chris/db";

const ROLE_PATTERNS: Array<{ patterns: string[]; category: RoleCategory }> = [
  {
    patterns: ["registered nurse", "clinical nurse", "nurse practitioner", "rnsg"],
    category: "rn",
  },
  {
    patterns: ["enrolled nurse"],
    category: "en",
  },
  {
    patterns: ["personal care", "ain", "carer", "care assistant", "care worker", "assistant in nursing"],
    category: "ain",
  },
  {
    patterns: ["physio", "occupational", "social worker", "dietitian", "speech", "allied health", "therapy", "podiatri"],
    category: "allied_health",
  },
  {
    patterns: ["admin", "reception", "accounts", "clerical", "office"],
    category: "admin",
  },
  {
    patterns: ["manager", "director", "coordinator", "team leader", "supervisor", "don ", "adon"],
    category: "management",
  },
  {
    patterns: ["cook", "chef", "clean", "laundry", "catering", "kitchen", "hospitality", "maintenance"],
    category: "cleaning_catering",
  },
];

export function mapDeputyRoleToCategory(roleTitle: string): RoleCategory {
  const lower = roleTitle.toLowerCase().trim();

  for (const { patterns, category } of ROLE_PATTERNS) {
    for (const pattern of patterns) {
      if (lower.includes(pattern)) {
        return category;
      }
    }
  }

  return "other";
}
