"use client";

import { CHRISDocumentViewer } from "@/components/documents/CHRISDocumentViewer";

export default function StewardAnalysisPage() {
  return (
    <div className="p-4 lg:p-6">
      {/* Steward header */}
      <div className="max-w-3xl mx-auto mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#6BAF92] flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">
              The Steward — Operational Analysis
            </p>
          </div>
        </div>
      </div>

      <CHRISDocumentViewer
        documentId="steward-gap-sunday-rn"
        documentType="operational-analysis"
        title="Structural Gap — Sunday PM RN Coverage"
        subtitle="6 of last 8 Sundays · $4,940 annualised premium"
        generatedBy="chronicler"
        generatedAt={new Date().toISOString()}
        status="ready"
        submitLabel="Add to action plan →"
        submitDestination="Operations Action Plan"
        requiresAllSections={false}
        sections={[
          {
            id: "finding",
            title: "Finding",
            type: "readonly",
            editable: false,
            required: false,
            content:
              "The Steward has identified a structural rostering gap on Sunday PM shifts.\n\n" +
              "Pattern: 6 of the last 8 Sundays required agency RN backfill for the PM shift.\n\n" +
              "Cost breakdown:\n" +
              "  Agency call-out rate: $95/hr\n" +
              "  Average shift length: 8 hours\n" +
              "  Annual frequency: ~39 Sundays affected\n" +
              "  Annualised premium: $4,940 above base RN cost\n" +
              "  12-month agency spend (Sunday PM only): $29,640",
          },
          {
            id: "root_cause",
            title: "Root Cause",
            type: "readonly",
            editable: false,
            required: false,
            content:
              "Three permanent RNs (out of 7 in the Sunday rotation) have standing availability blocks on Sundays:\n\n" +
              "  - RN-A: Religious observance (permanent)\n" +
              "  - RN-B: Childcare arrangement (since Jan 2026)\n" +
              "  - RN-C: Secondary employment (since Nov 2025)\n\n" +
              "This reduces the available pool to 4 RNs for 2 required positions, creating a structural deficit whenever any single RN takes leave.",
          },
          {
            id: "recommendation",
            title: "Recommendation",
            type: "readonly",
            editable: false,
            required: false,
            content:
              "The Steward recommends one of the following options:\n\n" +
              "Option A — Recruit 1 additional part-time RN with guaranteed Sunday availability. Estimated cost: $38K/yr. Saves $29.6K agency spend. Net cost: $8.4K but eliminates continuity-of-care risk.\n\n" +
              "Option B — Negotiate with RN-C to restore Sunday availability in exchange for preferred weekday roster. No direct cost. Requires conversation with employee.\n\n" +
              "Option C — Establish a standing agency booking (same nurse weekly) to reduce handover risk. Estimated cost: $24K/yr (discounted from ad-hoc rate). Maintains flexibility.",
          },
          {
            id: "decision",
            title: "Decision",
            type: "select",
            editable: true,
            required: true,
            content: "",
            options: [
              "Select a decision...",
              "Option A — Recruit part-time RN",
              "Option B — Negotiate with RN-C",
              "Option C — Standing agency booking",
              "Defer — revisit next month",
              "Other — see notes",
            ],
          },
          {
            id: "notes",
            title: "Notes",
            type: "textarea",
            editable: true,
            required: false,
            content: "",
            placeholder: "Add any notes or context for your decision...",
          },
        ]}
      />
    </div>
  );
}
