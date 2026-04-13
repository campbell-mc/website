import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, description, frequency, target_roles, target_wings, questions } = body;

  // TODO: Ivan — write to customPulseSurveys table
  // TODO: Ivan — calculate next_send_at based on frequency
  // TODO: Ivan — wire to scheduler for automatic send

  console.log(`[PulseSurveyAPI] Survey created: ${name} | ${frequency} | ${target_roles.join(', ')} | ${questions.length} questions`);

  return NextResponse.json({
    id: `survey-${Date.now()}`,
    name,
    frequency,
    status: 'active',
    created_at: new Date().toISOString(),
  });
}
