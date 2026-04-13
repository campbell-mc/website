"use client";

import { CHRISDocumentViewer } from "@/components/documents/CHRISDocumentViewer";

export default function OracleWeeklyReportPage() {
  const now = new Date();
  const generatedAt = new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto mb-4">
        {/* Oracle Agent Header */}
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#2D7D73" }}
          >
            <span className="text-white text-lg font-bold">O</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">The Oracle</p>
            <p className="text-xs text-muted-foreground">
              Revenue intelligence agent — identifies funding optimisation and
              benchmarking opportunities
            </p>
          </div>
        </div>
      </div>

      <CHRISDocumentViewer
        documentId="oracle-w15-2026"
        documentType="oracle_weekly"
        title="Revenue Intelligence — Week 15"
        subtitle="3 opportunities · Combined uplift: $11,400/month"
        generatedBy="oracle"
        generatedAt={generatedAt}
        status="ready"
        requiresAllSections={false}
        submitLabel="Mark as reviewed and create action items →"
        submitDestination="Action items queue"
        sections={[
          {
            id: "summary",
            title: "Weekly Summary",
            content: "The Oracle has identified 3 revenue optimisation opportunities for The Holy Grail Bowral this week, with a combined potential uplift of $11,400 per month ($136,800 annualised).\n\nPriority: AN-ACC reclassification is the highest-value opportunity and has the shortest action window. 4 residents have had significant care need changes since their last assessment that may warrant AN-ACC reclassification.\n\nAll figures are based on current IHACPA pricing and StewartBrown benchmarking data.",
            editable: false,
            required: false,
            type: "readonly",
          },
          {
            id: "opportunity_1",
            title: "Opportunity 1: AN-ACC Reclassification — $8,200/month",
            content: "4 residents have had care need changes that may support a higher AN-ACC classification:\n\n• Resident A (current Class 4 → potential Class 6): Increased mobility assistance needs following recent fall. New physiotherapy program commenced. Estimated uplift: $2,800/month\n• Resident B (current Class 3 → potential Class 5): Cognitive decline documented over 90 days. Behavioural support needs increased. Estimated uplift: $2,400/month\n• Resident C (current Class 5 → potential Class 7): Complex wound care commenced. Daily RN time increased by 25 minutes. Estimated uplift: $1,800/month\n• Resident D (current Class 2 → potential Class 3): Continence needs increased. New continence plan documented. Estimated uplift: $1,200/month\n\nAction: Schedule AN-ACC reassessments via My Aged Care portal. Clinical evidence is already documented in care plans.\nConfidence: High (clinical documentation supports all four cases)",
            editable: false,
            required: false,
            type: "readonly",
          },
          {
            id: "opportunity_2",
            title: "Opportunity 2: Accommodation Pricing Review — $1,800/month",
            content: "6 rooms are currently priced below comparable facilities in the Southern Highlands region:\n\n• 3 single rooms with ensuite: Current DAP $380,000 — comparable median $420,000\n• 2 single rooms shared bathroom: Current DAP $300,000 — comparable median $340,000\n• 1 premium suite: Current DAP $500,000 — comparable median $550,000\n\nRefundable deposit differential: $280,000 across 6 rooms\nEstimated additional DAD revenue at current MPIR: $1,800/month\n\nAction: Review accommodation pricing against ACFA published data and update pricing schedule for next vacancy.\nConfidence: Medium (market comparison based on published ACFA data — local conditions may vary)",
            editable: false,
            required: false,
            type: "readonly",
          },
          {
            id: "opportunity_3",
            title: "Opportunity 3: Home Care Exit Linkage (HELF) — $1,400/month",
            content: "The Oracle has identified 3 residents who transitioned from Home Care Packages in the last 90 days where the Home Care Exit Linkage Fee may not have been claimed:\n\n• Resident E: Entered 18 Jan 2026 from Level 4 HCP — HELF eligible $4,200\n• Resident F: Entered 02 Feb 2026 from Level 3 HCP — HELF eligible $3,100\n• Resident G: Entered 28 Feb 2026 from Level 2 HCP — HELF eligible $2,100\n\nTotal potential one-off claims: $9,400\nAmortised monthly impact (if claimed within deadline): $1,400/month for 6 months\n\nAction: Verify HCP exit dates with Services Australia and lodge claims via GPMS.\nConfidence: High (admission records confirm prior HCP status)\nDeadline: Claims must be lodged within 120 days of admission",
            editable: false,
            required: false,
            type: "readonly",
          },
          {
            id: "benchmarks",
            title: "Benchmarking — StewartBrown Comparison",
            content: "The Holy Grail Bowral vs StewartBrown Aged Care Financial Performance Survey (Q1 2026):\n\n                          Actual        Benchmark     Status\nEBITDA per bed day        $31.50        $28.00        ✓ Above\nCare labour ratio         71.2%         68.0%         ⚠ Above (watch)\nOccupancy                 94.1%         92.5%         ✓ Above\nAgency as % of labour     7.5%          4.8%          ⚠ Above (act)\nRevenue per bed day       $312          $298          ✓ Above\nFood cost per bed day     $28.40        $24.80        ⚠ Above (watch)\nAdmin cost ratio          8.2%          9.1%          ✓ Below\n\nKey insight: Agency cost reduction from 7.5% to benchmark 4.8% would save approximately $4,200/month. Combined with the 3 opportunities above, total addressable revenue gap is $15,600/month.",
            editable: false,
            required: false,
            type: "readonly",
          },
          {
            id: "action_items",
            title: "Action Items",
            content: "",
            editable: true,
            required: false,
            type: "textarea",
            placeholder: "Add action items, assign owners, and set due dates for each opportunity you want to pursue...",
          },
        ]}
      />
    </div>
  );
}
