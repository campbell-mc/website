// lib/agents/prompts/chronicler.ts
// Maintained by Ivan Sanchez
// System prompt and document templates for The Chronicler — the auto-documentation agent

export const CHRONICLER_SYSTEM_PROMPT = `
You are The Chronicler — the auto-documentation agent for CHRIS, the operational OS for Australian residential aged care.

Your job is to draft every document that a leader would otherwise have to write from scratch. You draft it. They review and approve. Nothing gets missed because no one had time to write it up.

YOUR DOMAIN KNOWLEDGE:
- Aged Care Act 2024 and Strengthened Quality Standards
- SIRS notification requirements (Cat 1: 24h, Cat 2: 30 days)
- ACQSC audit documentation requirements
- ISO 45003:2021 worker consultation evidence requirements
- Complaint resolution obligations and timeframes
- Care plan review documentation standards
- AN-ACC reassessment evidence requirements
- Board and governance pack structures

YOUR VOICE:
Formal and precise for regulatory documents.
Warm and professional for family communications.
Structured and evidence-focused for audit reports.
Always mark fields requiring human input with [REVIEW REQUIRED: description of what is needed].
Never fabricate clinical details — use placeholders.
End every draft with:
DRAFT PREPARED BY CHRIS — REQUIRES REVIEW AND APPROVAL BEFORE USE

YOUR CARDINAL RULE:
You draft. Humans decide. Never auto-submit anything.
Every document requires explicit human approval before it leaves the facility.
`;

// ── TRIGGER DATA TYPES ────────────────────────────────────────

export interface SIRSEventData {
  sirs_id: string;
  category: 1 | 2;
  incident_type: string;
  incident_date: string;
  incident_time: string;
  wing: string;
  location_detail: string;
  shift: string;
  immediate_actions: string[];
  outcome_description: string;
  medical_attention: string;
}

export interface AuditCompletedData {
  audit_id: string;
  audit_type: string;
  audit_date: string;
  score_pct: number;
  criteria_met: number;
  criteria_total: number;
  conducted_by_role: string;
  duration_minutes: number;
  non_conformances: Array<{
    finding: string;
    domain: string;
    corrective_action: string;
    quality_standard?: string;
    severity?: string;
  }>;
}

export interface VoiceSessionData {
  session_id: string;
  session_type: string;
  session_date: string;
  participant_roles: string[];
  duration_minutes: number;
  transcript_summary: string;
  is_governance_session: boolean;
}

export interface ComplaintData {
  complaint_id: string;
  category: string;
  received_date: string;
  description: string;
  wing: string;
}

export interface CorrectiveActionData {
  corrective_action_id?: string;
  finding: string;
  source: string;
  source_type: string;
  domain: string;
  quality_standard?: string;
  severity?: string;
}

export interface PSHCycleData {
  cycle_id: string;
  cycle_label: string;
  cycle_start: string;
  cycle_end: string;
  total_responses: number;
  participation_rate: number;
  elevated_domains: string[];
  practices_prescribed: string[];
}

export interface CarePlanReviewData {
  review_id: string;
  care_plan_id: string;
  review_date: string;
  review_type: string;
  participant_roles: string[];
  goals_reviewed: string[];
  goals_achieved: string[];
  new_goals: string[];
  care_changes: string[];
}

export interface ANACCReassessmentData {
  resident_id: string;
  current_class: number;
  assessment_date: string;
  days_since_assessment: number;
  clinical_signals: string[];
  care_plan_summary: string[];
  incident_summary: string[];
  medication_changes: string[];
  allied_health: string[];
}

export interface MonthlyUpdateData {
  facility_name: string;
  month: string;
  month_label: string;
  activities: string[];
  improvements: string[];
  quality_narrative: string;
  upcoming: string[];
  seasonal: string;
}

// ── DOCUMENT PROMPTS ──────────────────────────────────────────

export const CHRONICLER_PROMPTS = {

  sirs_notification: (data: SIRSEventData) => `
Draft a SIRS ${data.category === 1 ? 'Category 1 (24-hour)' : 'Category 2 (30-day)'} notification for submission to the ACQSC via GPMS.

Use formal regulatory language appropriate for submission to the Aged Care Quality and Safety Commission.
Do not include the resident's name — use "the resident" throughout.
Mark all fields requiring DON input with [REVIEW REQUIRED].

Event data:
- Incident type: ${data.incident_type}
- Date: ${data.incident_date}
- Time: ${data.incident_time}
- Location: ${data.wing}, ${data.location_detail}
- Shift: ${data.shift}
- Immediate actions taken: ${JSON.stringify(data.immediate_actions)}
- Outcome: ${data.outcome_description}
- Medical attention: ${data.medical_attention}

Structure the notification with these sections:
1. Incident details (date, time, location, type)
2. Description of what occurred
3. Immediate actions taken
4. Medical attention and outcome
5. Family notification status
6. Fields requiring completion before submission

End with: DRAFT PREPARED BY CHRIS — REQUIRES DON REVIEW AND APPROVAL BEFORE GPMS SUBMISSION`,

  audit_report: (data: AuditCompletedData) => `
Draft the audit report for a completed ${data.audit_type} audit.

This report is evidence for ACQSC Quality Standard compliance.
Use formal, structured language appropriate for regulatory evidence.

Audit results:
- Type: ${data.audit_type}
- Date: ${data.audit_date}
- Score: ${data.score_pct}% (${data.criteria_met}/${data.criteria_total} criteria met)
- Conducted by: ${data.conducted_by_role}
- Duration: ${data.duration_minutes} minutes
- Non-conformances: ${JSON.stringify(data.non_conformances)}

Structure the report:
1. Audit summary (date, scope, assessor, score)
2. Results by domain
3. Non-conformances (finding, corrective action required, target date)
4. Strengths observed
5. Quality Standards evidenced
6. Next scheduled audit date

Tone: ${data.score_pct >= 95 ? 'affirming — sustained performance' : data.score_pct >= 85 ? 'neutral — focus on corrective actions' : 'direct — urgency of improvement'}

End with: DRAFT PREPARED BY CHRIS — REQUIRES REVIEW BEFORE FILING`,

  meeting_notes: (data: VoiceSessionData) => `
Draft meeting minutes from this governance session transcript.

Meeting: ${data.session_type}
Date: ${data.session_date}
Participants: ${data.participant_roles.join(', ')}
Duration: ${data.duration_minutes} minutes

Key points from session:
${data.transcript_summary}

Format as formal meeting minutes:
1. Meeting details (date, type, participants, duration)
2. Agenda items discussed
3. Decisions made (numbered, clear, actionable)
4. Actions arising (owner role, action, due date)
5. Next meeting details

End with: DRAFT PREPARED BY CHRIS FROM VOICE SESSION — CHAIR TO REVIEW AND CONFIRM BEFORE DISTRIBUTION`,

  complaint_response: (data: ComplaintData, priorResolutions: string[]) => `
Draft a response to a resident or family complaint.
This will be reviewed and personalised by the FM or DON before sending.

Complaint:
- Category: ${data.category}
- Received: ${data.received_date}
- Summary: ${data.description}
- Wing: ${data.wing}

Prior resolutions in this category:
${priorResolutions.length > 0 ? priorResolutions.join('\n') : 'No prior resolutions in this category.'}

Draft a response that:
1. Acknowledges the concern warmly and sincerely
2. Confirms it has been taken seriously
3. Describes investigation and action taken (use [SPECIFIC ACTION TAKEN] where DON adds detail)
4. States what has changed or will change
5. Invites further feedback

Tone: warm, sincere, professional. Length: under 200 words.
Do not make promises that cannot be kept.

End with: DRAFT — REVIEW AND PERSONALISE BEFORE SENDING`,

  corrective_action_plan: (data: CorrectiveActionData) => `
Draft a corrective action plan for this finding.

Finding: ${data.finding}
Source: ${data.source} (${data.source_type})
Domain: ${data.domain}
${data.quality_standard ? `Quality Standard: ${data.quality_standard}` : ''}
${data.severity ? `Severity: ${data.severity}` : ''}

Structure the plan:
1. Finding summary
2. Root cause analysis (preliminary — [REVIEW REQUIRED])
3. Corrective actions (specific, measurable, with suggested owner role and target date)
4. Preventive actions (to stop recurrence)
5. Evidence required to close the action
6. Review date

End with: DRAFT PREPARED BY CHRIS — REQUIRES REVIEW AND SIGN-OFF BEFORE IMPLEMENTATION`,

  iso_45003_evidence: (data: PSHCycleData) => `
Update the ISO 45003:2021 worker consultation evidence record for this cycle.

This is auto-generated from pulse participation data — no human drafting required.
Format as structured evidence record only.

Cycle: ${data.cycle_label}
Period: ${data.cycle_start} to ${data.cycle_end}
Participation: ${data.total_responses} workers (${Math.round(data.participation_rate * 100)}% participation rate)
Hazards identified: ${data.elevated_domains.join(', ') || 'None elevated this cycle'}
Controls implemented: ${data.practices_prescribed.join(', ') || 'No new practices prescribed'}

ISO 45003 sections satisfied:
- 5.4 Consultation and participation
- 6.1 Risk assessment
- 8.1 Operational planning and control

Evidence type: Systematic fortnightly psychosocial hazard monitoring and worker consultation via CHRIS pulse survey — ${data.cycle_label}`,

  family_monthly_update: (data: MonthlyUpdateData) => `
Draft the monthly family update for ${data.month_label}.

Facility: ${data.facility_name}
Month: ${data.month_label}

Highlights this month:
- Activities: ${JSON.stringify(data.activities)}
- Improvements: ${JSON.stringify(data.improvements)}
- Quality highlights: ${data.quality_narrative}
- Upcoming events: ${JSON.stringify(data.upcoming)}
- Seasonal notes: ${data.seasonal}

Write a warm, engaging monthly update. Approximately 300 words.
Tone: warm, professional, transparent, community-focused.
Never mention individual residents or specific incidents.
Focus on: what has been happening, what has improved, what is coming up.
Include a section inviting family feedback.

End with: DRAFT — FM TO REVIEW AND PERSONALISE BEFORE DISTRIBUTION`,

  care_plan_review_note: (data: CarePlanReviewData) => `
Draft the care plan review note for this review session.

Do not include the resident's name. Use "the resident" throughout.

Review date: ${data.review_date}
Review type: ${data.review_type}
Participants: ${data.participant_roles.join(', ')}
Goals reviewed: ${JSON.stringify(data.goals_reviewed)}
Goals achieved: ${JSON.stringify(data.goals_achieved)}
New goals: ${JSON.stringify(data.new_goals)}
Changes to care: ${JSON.stringify(data.care_changes)}

Structure the note:
1. Review details (date, type, participants)
2. Goals progress (achieved, partially achieved, not achieved with reason)
3. Changes to care plan
4. New goals established
5. Next review date

End with: DRAFT PREPARED BY CHRIS — REQUIRES CLINICAL SIGN-OFF BEFORE FILING`,

  annacc_evidence_package: (data: ANACCReassessmentData) => `
Compile the AN-ACC reassessment evidence package for this resident.

Do not include the resident's name. Use "the resident" throughout.

Current classification: Class ${data.current_class}
Last assessment: ${data.assessment_date}
Days since assessment: ${data.days_since_assessment}
Clinical signals identified by Oracle: ${JSON.stringify(data.clinical_signals)}

Evidence from clinical records:
- Care plan summary: ${JSON.stringify(data.care_plan_summary)}
- Incident history (90 days): ${JSON.stringify(data.incident_summary)}
- Medication changes (90 days): ${JSON.stringify(data.medication_changes)}
- Allied health involvement: ${JSON.stringify(data.allied_health)}

Structure the package:
1. Resident profile (de-identified)
2. Current classification and last assessment date
3. Clinical evidence supporting reassessment
4. Specific care needs documented since last assessment
5. Recommended classification direction (higher/maintain/lower) with clinical rationale

End with: EVIDENCE PACKAGE PREPARED BY CHRIS — REQUIRES CLINICAL REVIEW BEFORE ASSESSMENT SUBMISSION`,
};
