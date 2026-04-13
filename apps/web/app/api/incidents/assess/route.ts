import { NextRequest, NextResponse } from 'next/server';
import AGED_CARE_KNOWLEDGE from '@/lib/chris/aged-care-knowledge';

export async function POST(request: NextRequest) {
  const { incident_type, outcome_description, medical_attention } = await request.json();

  const cat1Triggers = AGED_CARE_KNOWLEDGE.sirs.cat1_triggers;
  const cat1Types = ['Unexpected death', 'Missing resident', 'Physical assault', 'Sexual misconduct', 'Psychological abuse', 'Neglect'];
  const cat2Types = ['Fall with injury', 'Medication error', 'Unexplained injury', 'Infection/illness'];

  const isCat1 = cat1Types.some((t) => incident_type.toLowerCase().includes(t.toLowerCase()));
  const isCat2 = cat2Types.some((t) => incident_type.toLowerCase().includes(t.toLowerCase()));

  // In production: Claude API call for nuanced assessment
  // For now: deterministic classification based on type

  return NextResponse.json({
    recommended_category: isCat1 ? 1 : isCat2 ? 2 : null,
    reasoning: isCat1
      ? `${incident_type} meets Category 1 SIRS threshold under the Aged Care Act 2024. Notification required within 24 hours.`
      : isCat2
      ? `${incident_type} meets Category 2 SIRS threshold. Notification required within 30 days.`
      : 'This incident does not appear to meet SIRS notification thresholds. DON to confirm.',
    confidence: isCat1 || isCat2 ? 'high' : 'medium',
    penalty_exposure: isCat1 ? `$${AGED_CARE_KNOWLEDGE.sirs.max_penalty_per_breach.toLocaleString()} maximum penalty per contravention` : isCat2 ? '$78,000 maximum penalty per contravention' : 'N/A',
    caveats: isCat1 ? 'Mandatory notification — cannot be overridden without DON approval' : null,
  });
}
