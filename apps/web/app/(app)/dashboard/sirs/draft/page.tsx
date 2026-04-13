"use client";

import { CHRISDocumentViewer } from "@/components/documents/CHRISDocumentViewer";

export default function SIRSDraftPage() {
  const now = new Date();
  const generatedAt = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();
  const regulatoryDeadline = new Date(now.getTime() + 6.25 * 60 * 60 * 1000).toISOString();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <CHRISDocumentViewer
        documentId="sirs-2026-001"
        documentType="sirs_notification"
        title="SIRS Category 1 Notification"
        subtitle="Unexpected fall — Wing B bathroom · The Holy Grail Bowral"
        generatedBy="chronicler"
        generatedAt={generatedAt}
        status="ready"
        regulatoryDeadline={regulatoryDeadline}
        penaltyExposure="Maximum penalty: $783,000 per contravention for late notification"
        submitLabel="Approve and submit via GPMS →"
        submitDestination="ACQSC GPMS portal"
        sections={[
          {
            id: "provider_name",
            title: "Provider Name",
            content: "Knights of the Holy Grail",
            editable: false,
            required: true,
            type: "readonly",
          },
          {
            id: "service_name",
            title: "Service Name",
            content: "The Holy Grail Bowral",
            editable: false,
            required: true,
            type: "readonly",
          },
          {
            id: "incident_date",
            title: "Incident Date",
            content: "2026-04-13",
            editable: true,
            required: true,
            type: "date",
          },
          {
            id: "incident_time",
            title: "Incident Time",
            content: "06:03",
            editable: true,
            required: true,
            type: "text",
            placeholder: "HH:MM (24-hour format)",
          },
          {
            id: "incident_type",
            title: "Incident Type",
            content: "Unexpected fall resulting in injury",
            editable: true,
            required: true,
            type: "select",
            options: [
              "Unexpected fall resulting in injury",
              "Medication incident",
              "Unexpected death",
              "Unreasonable use of force",
              "Unlawful sexual contact",
              "Neglect",
              "Psychological or emotional abuse",
              "Stealing or financial coercion",
              "Inappropriate physical or chemical restraint",
              "Missing consumer",
            ],
          },
          {
            id: "location",
            title: "Location",
            content: "Wing B — bathroom",
            editable: true,
            required: true,
            type: "text",
            placeholder: "Specific location within the facility",
          },
          {
            id: "resident_details",
            title: "Resident Details",
            content: "[REVIEW REQUIRED] Enter resident identifier, age, and relevant care needs. Do not include full name — use internal reference only.",
            editable: true,
            required: true,
            type: "textarea",
            placeholder: "Resident identifier, age, mobility status, relevant diagnoses",
          },
          {
            id: "description",
            title: "Description of Incident",
            content: "Resident was found on the bathroom floor at 06:03 by EN on morning round. Resident had attempted to transfer from wheelchair to toilet without assistance. Wet floor identified as contributing factor. Resident reported right hip pain on assessment. No loss of consciousness observed. Call bell was within reach but not activated.",
            editable: true,
            required: true,
            type: "textarea",
          },
          {
            id: "immediate_actions",
            title: "Immediate Actions Taken",
            content: "1. Resident assessed in situ — vitals stable (BP 128/76, HR 82, O2 98%)\n2. No-lift policy followed — mechanical lift used for transfer to bed\n3. Ice applied to right hip, analgesia administered per PRN chart\n4. GP notified at 06:18 — ordered X-ray of right hip\n5. Ambulance called at 06:22 for transfer to Bowral Hospital ED\n6. RN completed neurological observations — GCS 15",
            editable: true,
            required: true,
            type: "textarea",
          },
          {
            id: "medical_outcome",
            title: "Medical Outcome",
            content: "[REVIEW REQUIRED] Awaiting radiology results from Bowral Hospital. Update with confirmed diagnosis and treatment plan once available.",
            editable: true,
            required: true,
            type: "textarea",
            placeholder: "Confirmed diagnosis, treatment, and ongoing care plan",
          },
          {
            id: "family_notification",
            title: "Family / Representative Notification",
            content: "Primary contact (daughter) notified by phone at 06:35 by DON. Advised of incident, immediate actions taken, and transfer to Bowral Hospital ED. Daughter confirmed she would attend ED. Follow-up call scheduled for 14:00 today.",
            editable: true,
            required: true,
            type: "textarea",
          },
          {
            id: "corrective_actions",
            title: "Corrective Actions",
            content: "1. Falls risk reassessment scheduled for return from hospital\n2. Bathroom non-slip mats to be audited across Wing B — maintenance work order raised\n3. Toileting assistance plan to be updated in care plan\n4. Staff reminded of 2-hourly rounding protocol during night shift\n5. Incident to be reviewed at next clinical governance meeting (17 April)",
            editable: true,
            required: true,
            type: "textarea",
          },
        ]}
      />
    </div>
  );
}
