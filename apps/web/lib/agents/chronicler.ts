// lib/agents/chronicler.ts
// Maintained by Ivan Sanchez
// The Chronicler — event-driven auto-documentation agent for CHRIS
//
// Fires the moment something happens that requires documentation.
// Never runs on a schedule. Listens for trigger events and drafts
// the document immediately. Leaders review and approve.
// Nothing goes undocumented because no one had time to write it up.
//
// Cardinal rule: The Chronicler drafts. Humans decide.
// Never auto-submit anything.

import { callClaudeText } from '@/lib/anthropic/client';
import {
  CHRONICLER_SYSTEM_PROMPT,
  CHRONICLER_PROMPTS,
  type SIRSEventData,
  type AuditCompletedData,
  type VoiceSessionData,
  type ComplaintData,
  type CorrectiveActionData,
  type PSHCycleData,
  type CarePlanReviewData,
  type ANACCReassessmentData,
  type MonthlyUpdateData,
} from '@/lib/agents/prompts/chronicler';

// ── TYPES ─────────────────────────────────────────────────────

export type DocumentStatus =
  | 'awaiting_review'   // needs human review before use
  | 'auto_filed'        // filed automatically (e.g. ISO evidence, clean audits)
  | 'approved'          // human has approved
  | 'submitted'         // submitted to regulator
  | 'superseded';       // replaced by a newer version

export type TriggerEvent =
  | 'sirs_event_logged'
  | 'audit_completed'
  | 'voice_session_completed'
  | 'complaint_logged'
  | 'corrective_action_created'
  | 'psh_cycle_complete'
  | 'care_plan_review_completed'
  | 'annacc_reassessment_flagged'
  | 'monthly_close';

export interface ChroniclerDocument {
  id?: number;
  facility_id: string;
  document_type: string;
  trigger_event: TriggerEvent;
  trigger_id?: string;
  draft_content: string;
  status: DocumentStatus;
  regulatory_deadline?: Date;
  review_required_by_roles: string[];
  created_at: Date;
}

export interface ChroniclerResult {
  success: boolean;
  document?: ChroniclerDocument;
  queueItem?: {
    targetRoles: string[];
    severity: string;
    title: string;
    description: string;
    route: string;
  };
  summary: string;
}

// ── MAIN TRIGGER HANDLER ──────────────────────────────────────

export async function handleChroniclerTrigger(
  event: TriggerEvent,
  data: Record<string, unknown>,
  facilityId: string
): Promise<ChroniclerResult> {

  const startTime = Date.now();

  try {
    let result: ChroniclerResult;

    switch (event) {
      case 'sirs_event_logged':
        result = await draftSIRSNotification(data as unknown as SIRSEventData, facilityId);
        break;
      case 'audit_completed':
        result = await draftAuditReport(data as unknown as AuditCompletedData, facilityId);
        break;
      case 'voice_session_completed':
        if ((data as unknown as VoiceSessionData).is_governance_session) {
          result = await draftMeetingNotes(data as unknown as VoiceSessionData, facilityId);
        } else {
          result = { success: true, summary: 'Non-governance voice session — no document required' };
        }
        break;
      case 'complaint_logged':
        result = await draftComplaintResponse(data as unknown as ComplaintData, facilityId);
        break;
      case 'corrective_action_created':
        result = await draftCorrectiveActionPlan(data as unknown as CorrectiveActionData, facilityId);
        break;
      case 'psh_cycle_complete':
        result = await updateISO45003Evidence(data as unknown as PSHCycleData, facilityId);
        break;
      case 'care_plan_review_completed':
        result = await draftCarePlanReviewNote(data as unknown as CarePlanReviewData, facilityId);
        break;
      case 'annacc_reassessment_flagged':
        result = await draftANACCEvidencePackage(data as unknown as ANACCReassessmentData, facilityId);
        break;
      case 'monthly_close':
        result = await draftFamilyMonthlyUpdate(data as unknown as MonthlyUpdateData, facilityId);
        break;
      default:
        result = { success: false, summary: `Unknown trigger event: ${event}` };
    }

    const durationMs = Date.now() - startTime;
    console.log(`[Chronicler] ${event} | ${facilityId} | ${result.summary} | ${durationMs}ms`);

    return result;

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Chronicler] ${event} FAILED | ${facilityId} | ${message}`);
    return { success: false, summary: `Failed: ${message}` };
  }
}

// ── SIRS NOTIFICATION ─────────────────────────────────────────

async function draftSIRSNotification(data: SIRSEventData, facilityId: string): Promise<ChroniclerResult> {
  const draftText = await callClaudeText({
    system: CHRONICLER_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: CHRONICLER_PROMPTS.sirs_notification(data) }],
    maxTokens: 1200,
    facilityId,
    agentName: 'chronicler',
    callType: 'sirs_draft',
  });

  const isCategory1 = data.category === 1;
  const deadline = isCategory1 ? addHours(new Date(), 24) : addDays(new Date(), 30);

  const document: ChroniclerDocument = {
    facility_id: facilityId,
    document_type: 'sirs_notification',
    trigger_event: 'sirs_event_logged',
    trigger_id: data.sirs_id,
    draft_content: draftText,
    status: 'awaiting_review',
    regulatory_deadline: deadline,
    review_required_by_roles: ['don', 'quality_lead'],
    created_at: new Date(),
  };

  // TODO: Ivan — write to chronicler_documents table + update sirs_items.draft_status

  return {
    success: true,
    document,
    queueItem: {
      targetRoles: ['don', 'quality_lead'],
      severity: isCategory1 ? 'immediate' : 'urgent',
      title: isCategory1
        ? `SIRS Cat 1 draft ready — review within ${Math.round((deadline.getTime() - Date.now()) / (1000 * 60 * 60))} hours`
        : `SIRS Cat 2 draft ready — due ${deadline.toLocaleDateString('en-AU')}`,
      description: `The Chronicler has drafted the SIRS ${isCategory1 ? 'Category 1' : 'Category 2'} notification. Review, add required details, and approve for GPMS submission.`,
      route: `/dashboard/sirs/${data.sirs_id}/draft`,
    },
    summary: `SIRS ${isCategory1 ? 'Cat 1' : 'Cat 2'} notification drafted — ${draftText.length} chars`,
  };
}

// ── AUDIT REPORT ──────────────────────────────────────────────

async function draftAuditReport(data: AuditCompletedData, facilityId: string): Promise<ChroniclerResult> {
  const draftText = await callClaudeText({
    system: CHRONICLER_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: CHRONICLER_PROMPTS.audit_report(data) }],
    maxTokens: 1500,
    facilityId,
    agentName: 'chronicler',
    callType: 'audit_report',
  });

  const hasNonConformances = data.non_conformances.length > 0;
  const status: DocumentStatus = hasNonConformances ? 'awaiting_review' : 'auto_filed';

  const document: ChroniclerDocument = {
    facility_id: facilityId,
    document_type: 'audit_report',
    trigger_event: 'audit_completed',
    trigger_id: data.audit_id,
    draft_content: draftText,
    status,
    review_required_by_roles: hasNonConformances ? ['don', 'quality_lead'] : [],
    created_at: new Date(),
  };

  // TODO: Ivan — write to chronicler_documents table
  // TODO: Ivan — auto-create corrective actions from non-conformances

  return {
    success: true,
    document,
    queueItem: hasNonConformances ? {
      targetRoles: ['don', 'quality_lead'],
      severity: 'routine',
      title: `${data.audit_type} audit report — ${data.non_conformances.length} non-conformance${data.non_conformances.length > 1 ? 's' : ''}`,
      description: `Report drafted and ${data.non_conformances.length} corrective action plan${data.non_conformances.length > 1 ? 's' : ''} created. Review report and confirm corrective action owners.`,
      route: `/dashboard/audits/${data.audit_id}/report`,
    } : undefined,
    summary: `${data.audit_type} audit report ${hasNonConformances ? 'drafted — awaiting review' : 'auto-filed — no non-conformances'}`,
  };
}

// ── MEETING NOTES ─────────────────────────────────────────────

async function draftMeetingNotes(data: VoiceSessionData, facilityId: string): Promise<ChroniclerResult> {
  const draftText = await callClaudeText({
    system: CHRONICLER_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: CHRONICLER_PROMPTS.meeting_notes(data) }],
    maxTokens: 1000,
    facilityId,
    agentName: 'chronicler',
    callType: 'meeting_notes',
  });

  const document: ChroniclerDocument = {
    facility_id: facilityId,
    document_type: 'meeting_notes',
    trigger_event: 'voice_session_completed',
    trigger_id: data.session_id,
    draft_content: draftText,
    status: 'awaiting_review',
    review_required_by_roles: ['facility_manager', 'don'],
    created_at: new Date(),
  };

  return {
    success: true,
    document,
    queueItem: {
      targetRoles: ['facility_manager', 'don'],
      severity: 'routine',
      title: `${data.session_type} minutes — ready for review`,
      description: `The Chronicler has drafted minutes from your ${data.duration_minutes}-minute session. Review and approve before distribution.`,
      route: `/dashboard/governance/minutes/${data.session_id}`,
    },
    summary: `${data.session_type} meeting notes drafted`,
  };
}

// ── COMPLAINT RESPONSE ────────────────────────────────────────

async function draftComplaintResponse(data: ComplaintData, facilityId: string): Promise<ChroniclerResult> {
  // TODO: Ivan — query prior resolutions in same category from complaints table
  const priorResolutions: string[] = [];

  const draftText = await callClaudeText({
    system: CHRONICLER_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: CHRONICLER_PROMPTS.complaint_response(data, priorResolutions) }],
    maxTokens: 600,
    facilityId,
    agentName: 'chronicler',
    callType: 'complaint_response',
  });

  const document: ChroniclerDocument = {
    facility_id: facilityId,
    document_type: 'complaint_response',
    trigger_event: 'complaint_logged',
    trigger_id: data.complaint_id,
    draft_content: draftText,
    status: 'awaiting_review',
    review_required_by_roles: ['facility_manager', 'don'],
    created_at: new Date(),
  };

  return {
    success: true,
    document,
    queueItem: {
      targetRoles: ['facility_manager', 'don'],
      severity: 'routine',
      title: `Complaint response drafted — ${data.category}`,
      description: 'Response drafted. Review, personalise, and send within the 14-day response window.',
      route: `/dashboard/residents/feedback/${data.complaint_id}`,
    },
    summary: `Complaint response drafted — ${data.category}`,
  };
}

// ── CORRECTIVE ACTION PLAN ────────────────────────────────────

async function draftCorrectiveActionPlan(data: CorrectiveActionData, facilityId: string): Promise<ChroniclerResult> {
  const draftText = await callClaudeText({
    system: CHRONICLER_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: CHRONICLER_PROMPTS.corrective_action_plan(data) }],
    maxTokens: 800,
    facilityId,
    agentName: 'chronicler',
    callType: 'corrective_action_plan',
  });

  const document: ChroniclerDocument = {
    facility_id: facilityId,
    document_type: 'corrective_action_plan',
    trigger_event: 'corrective_action_created',
    trigger_id: data.corrective_action_id,
    draft_content: draftText,
    status: 'awaiting_review',
    review_required_by_roles: ['quality_lead', 'facility_manager'],
    created_at: new Date(),
  };

  return {
    success: true,
    document,
    summary: 'Corrective action plan drafted',
  };
}

// ── ISO 45003 EVIDENCE ────────────────────────────────────────

async function updateISO45003Evidence(data: PSHCycleData, facilityId: string): Promise<ChroniclerResult> {
  const evidenceText = await callClaudeText({
    system: CHRONICLER_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: CHRONICLER_PROMPTS.iso_45003_evidence(data) }],
    maxTokens: 400,
    facilityId,
    agentName: 'chronicler',
    callType: 'iso_45003_evidence',
  });

  const document: ChroniclerDocument = {
    facility_id: facilityId,
    document_type: 'iso_45003_evidence',
    trigger_event: 'psh_cycle_complete',
    trigger_id: data.cycle_id,
    draft_content: evidenceText,
    status: 'auto_filed', // No human review needed — auto-files
    review_required_by_roles: [],
    created_at: new Date(),
  };

  // No queue item — auto-filed. WHS Lead sees it as current in their dashboard.

  return {
    success: true,
    document,
    summary: `ISO 45003 evidence auto-filed — ${data.cycle_label}`,
  };
}

// ── CARE PLAN REVIEW NOTE ─────────────────────────────────────

async function draftCarePlanReviewNote(data: CarePlanReviewData, facilityId: string): Promise<ChroniclerResult> {
  const draftText = await callClaudeText({
    system: CHRONICLER_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: CHRONICLER_PROMPTS.care_plan_review_note(data) }],
    maxTokens: 800,
    facilityId,
    agentName: 'chronicler',
    callType: 'care_plan_review',
  });

  const document: ChroniclerDocument = {
    facility_id: facilityId,
    document_type: 'care_plan_review_note',
    trigger_event: 'care_plan_review_completed',
    trigger_id: data.review_id,
    draft_content: draftText,
    status: 'awaiting_review',
    review_required_by_roles: ['don', 'clinical_director'],
    created_at: new Date(),
  };

  return {
    success: true,
    document,
    queueItem: {
      targetRoles: ['don'],
      severity: 'routine',
      title: 'Care plan review note ready for clinical sign-off',
      description: 'The Chronicler has drafted the care plan review note. Requires clinical sign-off before filing.',
      route: `/dashboard/residents/care-plans/${data.care_plan_id}/review`,
    },
    summary: 'Care plan review note drafted',
  };
}

// ── AN-ACC EVIDENCE PACKAGE ───────────────────────────────────

async function draftANACCEvidencePackage(data: ANACCReassessmentData, facilityId: string): Promise<ChroniclerResult> {
  const draftText = await callClaudeText({
    system: CHRONICLER_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: CHRONICLER_PROMPTS.annacc_evidence_package(data) }],
    maxTokens: 1000,
    facilityId,
    agentName: 'chronicler',
    callType: 'annacc_evidence',
  });

  const document: ChroniclerDocument = {
    facility_id: facilityId,
    document_type: 'annacc_evidence_package',
    trigger_event: 'annacc_reassessment_flagged',
    trigger_id: data.resident_id,
    draft_content: draftText,
    status: 'awaiting_review',
    review_required_by_roles: ['don', 'clinical_director'],
    created_at: new Date(),
  };

  return {
    success: true,
    document,
    queueItem: {
      targetRoles: ['don', 'clinical_director'],
      severity: 'routine',
      title: 'AN-ACC evidence package ready for clinical review',
      description: 'The Chronicler has compiled the clinical evidence package. Review before the assessment appointment.',
      route: '/dashboard/residents/care-plans?filter=annacc',
    },
    summary: 'AN-ACC evidence package compiled',
  };
}

// ── FAMILY MONTHLY UPDATE ─────────────────────────────────────

async function draftFamilyMonthlyUpdate(data: MonthlyUpdateData, facilityId: string): Promise<ChroniclerResult> {
  const draftText = await callClaudeText({
    system: CHRONICLER_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: CHRONICLER_PROMPTS.family_monthly_update(data) }],
    maxTokens: 800,
    facilityId,
    agentName: 'chronicler',
    callType: 'family_update',
  });

  const document: ChroniclerDocument = {
    facility_id: facilityId,
    document_type: 'family_monthly_update',
    trigger_event: 'monthly_close',
    trigger_id: `${facilityId}-${data.month}`,
    draft_content: draftText,
    status: 'awaiting_review',
    review_required_by_roles: ['facility_manager'],
    created_at: new Date(),
  };

  return {
    success: true,
    document,
    queueItem: {
      targetRoles: ['facility_manager'],
      severity: 'routine',
      title: `${data.month_label} family update — ready for review`,
      description: 'Monthly family newsletter drafted. Review, personalise, and distribute. Estimated 10 minutes.',
      route: '/dashboard/residents/families/monthly-update',
    },
    summary: `Family monthly update drafted — ${data.month_label}`,
  };
}

// ── HELPERS ───────────────────────────────────────────────────

function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}
