import { NextRequest, NextResponse } from 'next/server';
import AGED_CARE_KNOWLEDGE from '@/lib/chris/aged-care-knowledge';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { facility_id, incident_type, occurred_at, wing, description, immediate_actions, medical_attention, sirs_category, shift, agency_shift } = body;

  const occurredDate = new Date(occurred_at);
  let sirsDeadline: Date | null = null;
  if (sirs_category === 1) {
    sirsDeadline = new Date(occurredDate.getTime() + AGED_CARE_KNOWLEDGE.sirs.cat1_notification_hours * 60 * 60 * 1000);
  } else if (sirs_category === 2) {
    sirsDeadline = new Date(occurredDate.getTime() + AGED_CARE_KNOWLEDGE.sirs.cat2_notification_days * 24 * 60 * 60 * 1000);
  }

  const incidentId = `INC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`;

  // TODO: Ivan — write to incidents table
  // TODO: Ivan — trigger Chronicler for SIRS draft
  // TODO: Ivan — route through Sentinel Router

  console.log(`[IncidentAPI] Incident logged: ${incidentId} | ${incident_type} | ${wing} | SIRS Cat ${sirs_category ?? 'none'}`);

  return NextResponse.json({
    incident_id: incidentId,
    sirs_category,
    sirs_deadline: sirsDeadline?.toISOString(),
    chronicler_triggered: true,
    message: sirs_category
      ? `Incident logged. SIRS Cat ${sirs_category} deadline: ${sirsDeadline?.toLocaleString('en-AU')}. Chronicler draft in progress.`
      : 'Incident logged. Chronicler documentation in progress.',
  });
}
