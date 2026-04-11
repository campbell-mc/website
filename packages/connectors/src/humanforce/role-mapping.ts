// ============================================================================
// Humanforce Role Mapping
// Maps Humanforce Award-based categories to CHRIS canonical role categories.
// Humanforce uses more structured taxonomy than Deputy.
// ============================================================================

import type { RoleCategory } from "@chris/db";

// Humanforce Award categories map more cleanly than Deputy free-text
const AWARD_PATTERNS: Array<{ patterns: string[]; category: RoleCategory }> = [
  {
    patterns: ["registered nurse", "clinical nurse", "nurse practitioner", "rnsg", "rn -"],
    category: "rn",
  },
  {
    patterns: ["enrolled nurse", "en -"],
    category: "en",
  },
  {
    patterns: ["personal care", "ain", "carer", "care assistant", "care worker", "assistant in nursing", "senior carer"],
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

export function mapHumanforceRoleToCategory(awardTitle: string): RoleCategory {
  const lower = awardTitle.toLowerCase().trim();

  for (const { patterns, category } of AWARD_PATTERNS) {
    for (const pattern of patterns) {
      if (lower.includes(pattern)) {
        return category;
      }
    }
  }

  return "other";
}
