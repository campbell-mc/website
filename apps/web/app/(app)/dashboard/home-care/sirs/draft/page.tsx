"use client";

import { CHRISDocumentViewer } from "@/components/documents/CHRISDocumentViewer";

/* ── Compute deadline: 30 days from now ────────────────────────── */
const deadline = new Date();
deadline.setDate(deadline.getDate() + 30);
const deadlineISO = deadline.toISOString();

export default function HomeCaresSirsDraftPage() {
  return (
    <div className="px-4 py-8">
      <CHRISDocumentViewer
        documentId="sirs-hc-draft-001"
        documentType="SIRS Category 2 Notification"
        title="SIRS Category 2 Notification"
        subtitle="Client fall during visit — Balmain · Camelot Home Care"
        generatedBy="chronicler"
        generatedAt={new Date().toISOString()}
        status="ready"
        regulatoryDeadline={deadlineISO}
        penaltyExposure="$78,000 maximum penalty per contravention"
        submitLabel="Approve and submit via GPMS →"
        submitDestination="ACQSC GPMS portal"
        requiresAllSections
        sections={[
          {
            id: "provider_name",
            title: "Approved provider name",
            content: "Mt Gib Gardens Aged Care Ltd",
            editable: false,
            required: true,
            type: "readonly",
          },
          {
            id: "service_name",
            title: "Service name",
            content: "Camelot Home Care — Leichhardt",
            editable: true,
            required: true,
            type: "text",
          },
          {
            id: "incident_date",
            title: "Date of incident",
            content: "2026-02-14",
            editable: true,
            required: true,
            type: "date",
          },
          {
            id: "incident_type",
            title: "Incident type",
            content: "Client fall during visit",
            editable: true,
            required: true,
            type: "select",
            options: [
              "Client fall during visit",
              "Medication error",
              "Aggressive behaviour toward worker",
              "Aggressive behaviour toward client",
              "Neglect or missed care task",
              "Unreasonable use of force",
              "Financial exploitation",
              "Psychological or emotional abuse",
              "Restrictive practice — unregulated",
              "Unexpected death connected to care",
              "Other — describe below",
            ],
          },
          {
            id: "location",
            title: "Location (suburb + client home)",
            content: "Balmain — client residence",
            editable: true,
            required: true,
            type: "text",
          },
          {
            id: "client_details",
            title: "Client details",
            content: "[REVIEW REQUIRED — Enter de-identified client reference]",
            editable: true,
            required: true,
            type: "textarea",
            placeholder: "Enter client code and relevant details",
          },
          {
            id: "description",
            title: "Description of incident",
            content:
              "During a scheduled morning visit at the client's Balmain residence, the client sustained a fall while being assisted with a transfer from bed to wheelchair. The support worker (casual relief) was unfamiliar with the client's specific mobility requirements. The client reported pain in the right hip. No visible injury at time of incident. Ambulance was not required — client declined transport. GP notified same day.",
            editable: true,
            required: true,
            type: "textarea",
          },
          {
            id: "immediate_actions",
            title: "Immediate actions taken",
            content:
              "1. Worker assisted client to a safe, comfortable position.\n2. Client assessed for injury — reported hip pain, no visible bruising or swelling.\n3. Coordinator contacted immediately by phone.\n4. Client's GP notified within 2 hours.\n5. Client's family member (daughter) notified by coordinator same day.\n6. Incident report lodged in AlayaCare.\n7. Worker debriefed by coordinator.",
            editable: true,
            required: true,
            type: "textarea",
          },
          {
            id: "medical_outcome",
            title: "Medical outcome",
            content: "[REVIEW REQUIRED — Confirm medical outcome and any follow-up]",
            editable: true,
            required: true,
            type: "textarea",
            placeholder:
              "Confirm injury assessment outcome, GP follow-up, and any ongoing treatment",
          },
          {
            id: "family_notification",
            title: "Family / representative notification",
            content:
              "Client's daughter notified by phone on 14 February 2026 at 11:45 AM. Daughter acknowledged the incident and requested a follow-up call after the GP visit.",
            editable: true,
            required: true,
            type: "textarea",
          },
          {
            id: "corrective_actions",
            title: "Corrective actions",
            content:
              "1. Client mobility care plan updated with specific transfer instructions.\n2. Casual relief workers must review client care plan before first visit — added to onboarding checklist.\n3. Coordinator to conduct supervised visit with any new worker assigned to this client.\n4. Incident reviewed at weekly team meeting — 19 February 2026.\n5. The Keeper has flagged a broader pattern: both YTD incidents involved casual relief workers. Familiarity gap added to governance register.",
            editable: true,
            required: true,
            type: "textarea",
          },
        ]}
      />
    </div>
  );
}
