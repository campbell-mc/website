"use client";

import { useParams, useRouter } from "next/navigation";
import { CHRISDocumentViewer } from "@/components/documents/CHRISDocumentViewer";

export default function CorrectiveActionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const now = new Date();
  const generatedAt = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  const daysOverdue = 3;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto mb-4">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        {/* Finding Header */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Corrective Action
              </p>
              <h1 className="text-lg font-bold text-foreground">{id}</h1>
            </div>
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: "#FEF7F0",
                color: "#C4704A",
                border: "1px solid #C4704A",
              }}
            >
              {daysOverdue} days overdue
            </span>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="bg-muted px-2 py-1 rounded">
              Finding: Falls rate above national benchmark
            </span>
            <span className="bg-muted px-2 py-1 rounded">
              Source: QI-04 Q2 2026
            </span>
            <span className="bg-muted px-2 py-1 rounded">
              Priority: High
            </span>
          </div>
        </div>
      </div>

      <CHRISDocumentViewer
        documentId={`ca-${id}`}
        documentType="corrective_action"
        title={`Corrective Action Plan — ${id}`}
        subtitle="Falls rate above national benchmark — Mt Gib Gardens Bowral"
        generatedBy="chronicler"
        generatedAt={generatedAt}
        status="draft"
        submitLabel="Approve corrective action plan →"
        submitDestination="Compliance register"
        sections={[
          {
            id: "root_cause",
            title: "Root Cause Analysis",
            content:
              "[REVIEW REQUIRED] CHRIS has identified a pattern: 78% of falls this quarter occurred during shifts with greater than 40% agency staff. Contributing factors to investigate:\n\n• Agency staff unfamiliarity with resident mobility profiles\n• Inconsistent handover of falls risk information\n• Bathroom environmental hazards (wet floors, grab rail gaps)\n• Night shift staffing ratios below recommended levels\n\nPlease review and confirm or amend the root cause analysis based on your clinical judgement.",
            editable: true,
            required: true,
            type: "textarea",
            placeholder:
              "Confirm root cause findings or provide amended analysis",
          },
          {
            id: "corrective_actions",
            title: "Corrective Actions",
            content:
              "1. Implement mandatory falls risk handover checklist for all agency staff at shift commencement — include resident-specific mobility profiles, bathroom assistance requirements, and call bell locations\n\n2. Complete environmental safety audit of all bathrooms in Wing A and Wing B — install non-slip surfaces, verify grab rail compliance, ensure adequate lighting. Work order #WO-2026-089 raised with Facilities Manager\n\n3. Establish minimum 60% permanent staff ratio on all night shifts effective immediately — roster to be adjusted by Workforce Manager within 7 days\n\n4. Implement post-fall debrief protocol — every fall to be reviewed within 24 hours by RN and DON with contributing factors documented in RiskMan",
            editable: true,
            required: true,
            type: "textarea",
          },
          {
            id: "preventive_actions",
            title: "Preventive Actions",
            content:
              "1. Quarterly falls trend analysis to be presented at Clinical Governance meeting — The Chronicler will auto-generate this report from incident data\n\n2. Agency staff orientation package to include facility-specific falls prevention module — 30-minute online completion required before first shift\n\n3. Sensor mat trial for 8 highest-risk residents — procurement approval required ($3,200 for initial deployment). Evidence shows 40-60% reduction in unwitnessed falls",
            editable: true,
            required: true,
            type: "textarea",
          },
          {
            id: "evidence_required",
            title: "Evidence Required for Closure",
            content:
              "1. Completed environmental audit report with photos of remediated bathrooms\n2. Updated agency staff orientation package with falls prevention module\n3. Roster evidence showing ≥60% permanent staff on night shifts for 4 consecutive weeks\n4. Falls rate data showing reduction toward benchmark (6.8 per 1,000 bed days) over next reporting period",
            editable: true,
            required: true,
            type: "textarea",
          },
          {
            id: "assigned_owner",
            title: "Assigned Owner",
            content: "DON",
            editable: true,
            required: true,
            type: "select",
            options: [
              "DON",
              "Facility Manager",
              "Quality Manager",
              "WHS Coordinator",
              "HR Manager",
              "Clinical Director",
            ],
          },
          {
            id: "new_due_date",
            title: "Due Date",
            content: "2026-05-13",
            editable: true,
            required: true,
            type: "date",
          },
          {
            id: "review_date",
            title: "Review Date",
            content: "2026-04-28",
            editable: true,
            required: true,
            type: "date",
          },
        ]}
      />
    </div>
  );
}
