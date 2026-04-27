"use client";

import { CHRISDocumentViewer } from "@/components/documents/CHRISDocumentViewer";

export default function QISubmissionPage() {
  const now = new Date();
  const generatedAt = new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <CHRISDocumentViewer
        documentId="qi-q2-2026-001"
        documentType="qi_submission"
        title="Quality Indicators — Q2 2026 Submission"
        subtitle="Due 21 April 2026 · 14 indicators"
        generatedBy="chronicler"
        generatedAt={generatedAt}
        status="ready"
        regulatoryDeadline={new Date("2026-04-21T23:59:00").toISOString()}
        submitLabel="Review and submit via GPMS →"
        submitDestination="GPMS Quality Indicators portal"
        sections={[
          {
            id: "qi_period",
            title: "Reporting Period",
            content: "Q2 2026 — 1 January 2026 to 31 March 2026\nProvider: Mt Gib Gardens\nService: Mt Gib Gardens Bowral\nTotal care recipients at end of quarter: 68",
            editable: false,
            required: true,
            type: "readonly",
          },
          {
            id: "qi_01",
            title: "QI-01: Pressure Injuries",
            content: "Stage 1: 3 residents (4.4%)\nStage 2: 1 resident (1.5%)\nStage 3+: 0 residents (0%)\nNew pressure injuries this quarter: 2\nHealed this quarter: 1\n\nBenchmark: National average Stage 2+ is 2.1%. The Holy Grail is tracking at 1.5% — within acceptable range.",
            editable: true,
            required: true,
            type: "textarea",
          },
          {
            id: "qi_02",
            title: "QI-02: Physical Restraint",
            content: "Residents with physical restraint in use: 0 (0%)\nNational average: 1.2%\n\nNo physical restraint in use during the reporting period. Bedrails classified as enablers are documented separately in care plans.",
            editable: true,
            required: true,
            type: "textarea",
          },
          {
            id: "qi_03",
            title: "QI-03: Unplanned Weight Loss",
            content: "Residents with significant unplanned weight loss (≥5% in 30 days): 2 (2.9%)\nResidents with weight loss (≥10% in 180 days): 1 (1.5%)\n\nBoth cases have dietitian referrals in progress. Supplementary nutrition plans initiated.",
            editable: true,
            required: true,
            type: "textarea",
          },
          {
            id: "qi_04",
            title: "QI-04: Falls and Major Injury",
            content: "Total falls this quarter: 14\nFalls resulting in major injury: 2 (14.3%)\nFalls rate per 1,000 bed days: 8.2\n\n⚠ ABOVE BENCHMARK — National average falls rate is 6.8 per 1,000 bed days. The Holy Grail is 20.6% above benchmark. CHRIS analysis indicates 78% of falls occurred during shifts with >40% agency staff. A corrective action plan has been initiated (CA-2026-041).",
            editable: true,
            required: true,
            type: "textarea",
          },
          {
            id: "qi_05",
            title: "QI-05: Medication Management",
            content: "Residents on 9+ medications (polypharmacy): 18 (26.5%)\nMedication incidents this quarter: 3\nAntipsychotic use without diagnosis: 0\n\nAll polypharmacy cases have current medication reviews by pharmacist. Next bulk review due May 2026.",
            editable: true,
            required: true,
            type: "textarea",
          },
          {
            id: "qi_06_14",
            title: "QI-06 to QI-14: Remaining Indicators",
            content: "[REVIEW REQUIRED] The Chronicler has compiled data for the remaining indicators but requires your verification before submission:\n\nQI-06 Incontinence care: 89% have continence plan — verify\nQI-07 Hospitalisation: 4 unplanned transfers — verify\nQI-08 Infection control: 2 outbreaks managed — verify\nQI-09 Workforce: see workforce module — verify\nQI-10 Consumer experience: 4.1/5.0 — verify\nQI-11 Activities of daily living: 94% assessed — verify\nQI-12 Depression/mood: 6 residents flagged — verify\nQI-13 Behavioural symptoms: 3 residents — verify\nQI-14 Continuity of care: 72% same staff — verify\n\nPlease review each indicator and update with confirmed figures.",
            editable: true,
            required: true,
            type: "textarea",
          },
          {
            id: "certification",
            title: "Certification",
            content: "[REVIEW REQUIRED] I certify that the information in this Quality Indicator submission is true and correct to the best of my knowledge. I understand that providing false or misleading information to the Aged Care Quality and Safety Commission is a serious offence.\n\nCertified by: _______________\nPosition: _______________\nDate: _______________",
            editable: true,
            required: true,
            type: "textarea",
          },
        ]}
      />
    </div>
  );
}
