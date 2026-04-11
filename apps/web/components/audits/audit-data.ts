// ============================================================================
// Clinical Audit Data — All mandatory audit types for residential aged care
// ============================================================================

export interface AuditType {
  id: string;
  name: string;
  frequency: "monthly" | "quarterly";
  domains: string[];
  qiLinks: string[];
  sirsLink?: string;
  regulatoryLinks: string[];
  lastCompleted: string;
  lastScore: number;
  lastCriteria: { met: number; total: number };
  nextDue: string;
  daysUntilDue: number;
  status: "overdue" | "due_soon" | "on_schedule";
  openNonConformances: number;
  chrisNote?: string;
  history: Array<{ date: string; score: number; met: number; total: number }>;
}

export const AUDIT_TYPES: AuditType[] = [
  {
    id: "medication", name: "Medication Management", frequency: "monthly",
    domains: ["Medication orders current and signed", "Administration records complete", "Controlled substance register accurate", "Medication storage conditions", "PRN medication protocols", "Medication incidents reviewed", "High-risk medication monitoring"],
    qiLinks: ["QI_05 (Polypharmacy)", "QI_06 (Antipsychotics)"],
    sirsLink: "Medication errors can be SIRS Cat 2",
    regulatoryLinks: ["Quality Standard 5 — Clinical Care", "Quality Standard 8 — Governance"],
    lastCompleted: "12 Mar 2026", lastScore: 94, lastCriteria: { met: 45, total: 48 },
    nextDue: "12 Apr 2026", daysUntilDue: -3, status: "overdue", openNonConformances: 2,
    chrisNote: "Storage domain is the recurring gap — temperature logging has appeared as a non-conformance 3 times in 6 months.",
    history: [
      { date: "Oct 2025", score: 88, met: 42, total: 48 },
      { date: "Nov 2025", score: 94, met: 45, total: 48 },
      { date: "Dec 2025", score: 92, met: 44, total: 48 },
      { date: "Jan 2026", score: 96, met: 46, total: 48 },
      { date: "Feb 2026", score: 91, met: 44, total: 48 },
      { date: "Mar 2026", score: 94, met: 45, total: 48 },
    ],
  },
  {
    id: "restraint", name: "Restraint Register Review", frequency: "monthly",
    domains: ["All restraints authorised", "Documentation current", "Reduction plans in place", "Resident consent documented", "Regular review occurring"],
    qiLinks: ["QI_02 (Restrictive Practices)"],
    regulatoryLinks: ["Quality Standard 5", "Section 17 Aged Care Act 2024"],
    lastCompleted: "5 Apr 2026", lastScore: 100, lastCriteria: { met: 30, total: 30 },
    nextDue: "5 May 2026", daysUntilDue: 23, status: "on_schedule", openNonConformances: 0,
    history: [
      { date: "Nov 2025", score: 97, met: 29, total: 30 },
      { date: "Dec 2025", score: 100, met: 30, total: 30 },
      { date: "Jan 2026", score: 100, met: 30, total: 30 },
      { date: "Feb 2026", score: 97, met: 29, total: 30 },
      { date: "Mar 2026", score: 100, met: 30, total: 30 },
      { date: "Apr 2026", score: 100, met: 30, total: 30 },
    ],
  },
  {
    id: "falls", name: "Falls Prevention", frequency: "quarterly",
    domains: ["Falls risk assessments current", "Prevention plans in place", "Environmental risk factors addressed", "Post-fall assessment process", "Bed rail and mobility documentation"],
    qiLinks: ["QI_03 (Falls)", "QI_04 (Falls — Major Injury)"],
    sirsLink: "Falls with major injury are SIRS Cat 1 or 2",
    regulatoryLinks: ["Quality Standard 5 — Clinical Care"],
    lastCompleted: "15 Jan 2026", lastScore: 87, lastCriteria: { met: 34, total: 39 },
    nextDue: "15 Apr 2026", daysUntilDue: 3, status: "due_soon", openNonConformances: 2,
    chrisNote: "Environmental risk assessment for Wing B bathroom is 6 months old. 8 of 19 falls this quarter occurred there.",
    history: [
      { date: "Apr 2025", score: 92, met: 36, total: 39 },
      { date: "Jul 2025", score: 90, met: 35, total: 39 },
      { date: "Oct 2025", score: 85, met: 33, total: 39 },
      { date: "Jan 2026", score: 87, met: 34, total: 39 },
    ],
  },
  {
    id: "wound", name: "Wound & Pressure Injury", frequency: "monthly",
    domains: ["Wound care plans current", "Wound assessment documentation", "Wound care competency", "Specialist referrals", "Wound care products appropriate"],
    qiLinks: ["QI_01 (Pressure Injuries)"],
    regulatoryLinks: ["Quality Standard 5 — Clinical Care"],
    lastCompleted: "8 Apr 2026", lastScore: 96, lastCriteria: { met: 23, total: 24 },
    nextDue: "8 May 2026", daysUntilDue: 26, status: "on_schedule", openNonConformances: 0,
    history: [
      { date: "Nov 2025", score: 88, met: 21, total: 24 },
      { date: "Dec 2025", score: 92, met: 22, total: 24 },
      { date: "Jan 2026", score: 92, met: 22, total: 24 },
      { date: "Feb 2026", score: 96, met: 23, total: 24 },
      { date: "Mar 2026", score: 96, met: 23, total: 24 },
      { date: "Apr 2026", score: 96, met: 23, total: 24 },
    ],
  },
  {
    id: "infection", name: "Infection Control", frequency: "monthly",
    domains: ["Infection control policy current", "Hand hygiene compliance", "PPE availability and use", "Outbreak management protocol", "Vaccination records", "Antibiotic stewardship"],
    qiLinks: ["QI_09 (ED Presentations)", "QI_10 (Hospitalisation)"],
    regulatoryLinks: ["Quality Standard 5 — Clinical Care"],
    lastCompleted: "1 Apr 2026", lastScore: 91, lastCriteria: { met: 32, total: 35 },
    nextDue: "1 May 2026", daysUntilDue: 19, status: "on_schedule", openNonConformances: 1,
    history: [
      { date: "Nov 2025", score: 86, met: 30, total: 35 },
      { date: "Dec 2025", score: 89, met: 31, total: 35 },
      { date: "Jan 2026", score: 91, met: 32, total: 35 },
      { date: "Feb 2026", score: 89, met: 31, total: 35 },
      { date: "Mar 2026", score: 91, met: 32, total: 35 },
      { date: "Apr 2026", score: 91, met: 32, total: 35 },
    ],
  },
  {
    id: "nutrition", name: "Nutritional Care", frequency: "quarterly",
    domains: ["Nutritional screening current", "Dietary plans in place", "Mealtime assistance documented", "Dietitian referrals current", "Weight monitoring", "Modified texture documentation"],
    qiLinks: ["QI_03 (Unplanned Weight Loss)"],
    regulatoryLinks: ["Quality Standard 5 — Clinical Care"],
    lastCompleted: "20 Feb 2026", lastScore: 88, lastCriteria: { met: 29, total: 33 },
    nextDue: "20 May 2026", daysUntilDue: 38, status: "on_schedule", openNonConformances: 1,
    history: [
      { date: "May 2025", score: 82, met: 27, total: 33 },
      { date: "Aug 2025", score: 85, met: 28, total: 33 },
      { date: "Nov 2025", score: 85, met: 28, total: 33 },
      { date: "Feb 2026", score: 88, met: 29, total: 33 },
    ],
  },
  {
    id: "pain", name: "Pain Management", frequency: "quarterly",
    domains: ["Pain assessment tools in use", "Pain management plans documented", "Medication review currency", "Non-pharmacological pain management"],
    qiLinks: [],
    regulatoryLinks: ["Quality Standard 5 — Clinical Care"],
    lastCompleted: "10 Mar 2026", lastScore: 92, lastCriteria: { met: 22, total: 24 },
    nextDue: "10 Jun 2026", daysUntilDue: 59, status: "on_schedule", openNonConformances: 0,
    history: [
      { date: "Jun 2025", score: 88, met: 21, total: 24 },
      { date: "Sep 2025", score: 88, met: 21, total: 24 },
      { date: "Dec 2025", score: 92, met: 22, total: 24 },
      { date: "Mar 2026", score: 92, met: 22, total: 24 },
    ],
  },
];

export function getAuditById(id: string): AuditType | undefined {
  return AUDIT_TYPES.find((a) => a.id === id);
}
