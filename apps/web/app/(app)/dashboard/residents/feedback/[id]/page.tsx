"use client";

import { useParams } from "next/navigation";
import { CHRISDocumentViewer } from "@/components/documents/CHRISDocumentViewer";

export default function ComplaintResponsePage() {
  const { id } = useParams<{ id: string }>();
  const now = new Date();
  const generatedAt = new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto mb-4">
        {/* Complaint Details Card */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Complaint Response
              </p>
              <h1 className="text-lg font-bold text-foreground">
                Food quality — {id}
              </h1>
            </div>
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: "#FFFBF0",
                color: "#D4A017",
                border: "1px solid #D4A017",
              }}
            >
              8 days open
            </span>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
            <span className="bg-muted px-2 py-1 rounded">
              Category: Food quality
            </span>
            <span className="bg-muted px-2 py-1 rounded">
              Wing: Wattle Wing
            </span>
            <span className="bg-muted px-2 py-1 rounded">
              Source: Family representative
            </span>
          </div>

          {/* CHRIS Pattern Note */}
          <div
            className="rounded-lg p-3 flex items-start gap-2"
            style={{
              backgroundColor: "#FFFBF0",
              border: "1px solid #D4A017",
            }}
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={{ backgroundColor: "#1B4332" }}
            >
              <span className="text-white text-[9px] font-bold">C</span>
            </div>
            <p className="text-xs" style={{ color: "#D4A017" }}>
              <strong>CHRIS pattern detected:</strong> This is the 3rd food
              quality complaint in the last 60 days. All three complaints
              relate to Wattle Wing evening meals. The Chronicler has flagged
              this as a systemic issue and created corrective action
              CA-2026-038.
            </p>
          </div>
        </div>
      </div>

      <CHRISDocumentViewer
        documentId={`complaint-response-${id}`}
        documentType="complaint_response"
        title="Complaint Response — Food quality"
        subtitle={`Complaint ${id} · Wattle Wing · 8 days open`}
        generatedBy="chronicler"
        generatedAt={generatedAt}
        status="ready"
        submitLabel="Approve and send response to family →"
        submitDestination="Family representative"
        sections={[
          {
            id: "salutation",
            title: "Salutation",
            content:
              "[REVIEW REQUIRED] Dear [family member name],",
            editable: true,
            required: true,
            type: "text",
            placeholder: "Dear [family member name],",
          },
          {
            id: "acknowledgement",
            title: "Acknowledgement",
            content:
              "Thank you for taking the time to share your concerns about the quality of meals being provided to your mother in Wattle Wing. We take all feedback seriously, and I want to assure you that your complaint has been thoroughly investigated.\n\nWe understand how important nutrition and meal quality are to the wellbeing and dignity of our residents, and we appreciate you bringing this to our attention.",
            editable: true,
            required: true,
            type: "textarea",
          },
          {
            id: "investigation",
            title: "Investigation Summary",
            content:
              "Following your complaint lodged on 5 April 2026, we conducted a review of our food services in Wattle Wing. This included:\n\n• Interview with the catering team and Wattle Wing care staff\n• Review of the weekly menu cycle and meal preparation records\n• Temperature checks and food quality audit on 7 and 8 April\n• Review of your mother's dietary profile and documented preferences\n• Analysis of two prior food quality complaints received in the past 60 days\n\nOur investigation found that evening meals in Wattle Wing have been affected by a change in our food supplier's delivery schedule, resulting in some meals being prepared earlier than intended and held at serving temperature for longer periods. This has impacted both the quality and presentation of evening meals.",
            editable: true,
            required: true,
            type: "textarea",
          },
          {
            id: "findings_and_actions",
            title: "Findings & Actions Taken",
            content:
              "[REVIEW REQUIRED] Based on our investigation, we have implemented the following actions:\n\n1. Reverted evening meal preparation to the original schedule to ensure meals are freshly prepared closer to service time\n2. Engaged a consulting dietitian to review the full menu cycle and make recommendations (commencing 21 April)\n3. Established a food quality feedback register in Wattle Wing — residents and families can provide real-time feedback\n4. Scheduled a meeting with our food supplier to discuss delivery schedule and product quality (14 April)\n5. Your mother's individual meal preferences have been re-confirmed with her and updated in her care plan\n\nPlease review these actions and confirm they adequately address the complaint, or add further commitments.",
            editable: true,
            required: true,
            type: "textarea",
          },
          {
            id: "commitment",
            title: "Ongoing Commitment",
            content:
              "We are committed to providing high-quality, nutritious meals that our residents enjoy. The Facility Manager will personally follow up with you within 14 days to confirm that the improvements are having the desired effect.\n\nIf at any time you feel that the food quality has not improved, or if you have any other concerns, please do not hesitate to contact me directly.",
            editable: true,
            required: true,
            type: "textarea",
          },
          {
            id: "sign_off",
            title: "Sign Off",
            content:
              "[REVIEW REQUIRED] Yours sincerely,\n\n[Your name]\n[Your position]\nThe Holy Grail Bowral\nPhone: [direct number]\nEmail: [email address]",
            editable: true,
            required: true,
            type: "textarea",
            placeholder: "Complete with your name, position, and contact details",
          },
        ]}
      />
    </div>
  );
}
