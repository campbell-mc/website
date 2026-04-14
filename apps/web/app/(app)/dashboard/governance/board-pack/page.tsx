"use client";

import { CHRISDocumentViewer } from "@/components/documents/CHRISDocumentViewer";

export default function BoardPackPage() {
  const now = new Date();
  const generatedAt = new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <CHRISDocumentViewer
        documentId="board-pack-apr-2026"
        documentType="board_pack"
        title="Board Pack — April 2026"
        subtitle="Board Meeting 17 April 2026"
        generatedBy="chronicler"
        generatedAt={generatedAt}
        status="draft"
        regulatoryDeadline={new Date("2026-04-17T09:00:00").toISOString()}
        requiresAllSections={false}
        submitLabel="Approve Board Pack for distribution →"
        submitDestination="Board members"
        sections={[
          {
            id: "executive_summary",
            title: "Executive Summary",
            content: "The Holy Grail Bowral continues to operate within acceptable compliance parameters with one area of concern. Occupancy is stable at 94.1% (64/68 beds). Revenue is tracking 2.3% above budget YTD. Falls rate remains above national benchmark and is the primary quality focus for this period.\n\nKey highlights:\n• SIRS Cat 1 notification lodged 13 April (fall with injury) — within 24hr requirement\n• QI Q2 submission prepared — due 21 April\n• AN-ACC reassessment opportunity identified — potential $8,200/month uplift\n• Staff turnover reduced to 18.2% (from 24.1% prior quarter)\n• Zero restrictive practice incidents this quarter",
            editable: true,
            required: true,
            type: "textarea",
          },
          {
            id: "quality_safety",
            title: "Quality & Safety Report",
            content: "Clinical Governance:\n• Falls: 14 this quarter (8.2 per 1,000 bed days vs 6.8 benchmark) — corrective action plan CA-2026-041 in progress\n• Pressure injuries: 4 total (1 Stage 2) — within benchmark\n• Medication incidents: 3 — all low severity, no harm\n• Infections: 2 gastro outbreak episodes — contained within 72 hours each\n• Restraint: Zero physical restraint use\n• SIRS notifications: 1 Cat 1, 2 Cat 3 this quarter\n\nConsumer experience score: 4.1/5.0 (target 4.0)\nComplaint resolution within 21 days: 87% (target 90%)",
            editable: true,
            required: true,
            type: "textarea",
          },
          {
            id: "financial",
            title: "Financial Summary",
            content: "Revenue: $1,842,000 (MTD) — 2.3% above budget\nExpenditure: $1,697,000 (MTD) — 1.1% above budget\nEBITDA: $145,000 (7.9% margin)\n\nKey variances:\n• AN-ACC funding uplift from Q1 reassessments: +$6,400/month\n• Agency costs: $127,000 (7.5% of total labour) — above target of 5%\n• Food services: $12,000 over budget — supplier contract under review\n• Accommodation revenue: below benchmark — 6 rooms eligible for DAP review\n\nStewartBrown benchmarks:\n• Care revenue per bed day: $312 (benchmark $298) — above\n• Labour cost ratio: 71.2% (benchmark 68%) — above\n• EBITDA per bed day: $31.50 (benchmark $28) — above",
            editable: true,
            required: true,
            type: "textarea",
          },
          {
            id: "workforce",
            title: "Workforce Report",
            content: "Total headcount: 112 (86.4 FTE)\nVacancies: 4 (2 RN, 1 EN, 1 PCA)\nTurnover: 18.2% annualised (prior quarter 24.1%)\nAgency usage: 7.5% of total hours (target <5%)\nCare minutes compliance: 218 min/resident/day (target 215)\n  — RN component: 46 min (target 44)\n\nKey workforce actions:\n• 2 graduate RN positions offered — start dates May 2026\n• Night shift staffing model under review to reduce agency dependency\n• Leadership development program commenced for 6 team leaders\n• Annual mandatory training completion: 94% (target 95%)",
            editable: true,
            required: true,
            type: "textarea",
          },
          {
            id: "compliance",
            title: "Compliance & Regulatory",
            content: "Accreditation status: Current (expires October 2027)\nNext assessment contact: Estimated Q3 2026\n\nOpen corrective actions: 3\n• CA-2026-041: Falls rate above benchmark — due 13 May\n• CA-2026-038: Food complaint pattern — due 28 April\n• CA-2026-035: Night shift documentation — due 30 April (on track)\n\nSIRS compliance: All notifications lodged within required timeframes\nPrudential compliance: Refundable deposits $4.2M — fully liquid\nGovernance meetings held: Clinical (monthly), WHS (monthly), Infection Control (fortnightly during outbreak)",
            editable: true,
            required: true,
            type: "textarea",
          },
          {
            id: "risks",
            title: "Risk Register — Key Items",
            content: "1. ELEVATED — Falls rate above national benchmark\n   Impact: Regulatory scrutiny, potential compliance action\n   Controls: Corrective action plan, environmental audit, staffing review\n   Trend: Stable (not worsening)\n\n2. MODERATE — Agency dependency on night shift\n   Impact: Care continuity, cost, falls correlation\n   Controls: Graduate recruitment, roster optimisation\n   Trend: Improving (down from 12% to 7.5%)\n\n3. MODERATE — Food service complaints (3 in 60 days)\n   Impact: Consumer satisfaction, complaint escalation risk\n   Controls: Menu review, dietitian engagement, supplier review\n   Trend: New risk — monitoring\n\n4. LOW — Accommodation pricing below market\n   Impact: Revenue leakage estimated $1,800/month\n   Controls: DAP review scheduled for 6 eligible rooms\n   Trend: Stable",
            editable: true,
            required: true,
            type: "textarea",
          },
          {
            id: "resolutions",
            title: "Resolutions for Board Approval",
            content: "[REVIEW REQUIRED] The following resolutions are presented for board consideration:\n\n1. THAT the Board notes the Quality & Safety report and endorses the corrective action plan for falls rate reduction (CA-2026-041).\n\n2. THAT the Board approves the expenditure of up to $15,000 for bathroom safety upgrades across Wing B (non-slip surfaces, grab rail audit).\n\n3. THAT the Board notes the financial performance for the period and endorses the AN-ACC reassessment strategy for identified residents.\n\n4. THAT the Board approves the engagement of a consulting dietitian to review the food services program ($8,500).\n\n5. THAT the Board notes the workforce report and endorses the graduate nurse recruitment strategy.\n\nPlease review and amend resolutions as required before distribution.",
            editable: true,
            required: true,
            type: "textarea",
          },
        ]}
      />
    </div>
  );
}
