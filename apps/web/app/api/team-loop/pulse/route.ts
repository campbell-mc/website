// api/team-loop/pulse/route.ts
// Receives anonymous pulse check-in responses from staff.
// De-identified at submission — no individual tracking.

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { team_id, responses, comment } = body as {
    team_id: string;
    responses: Record<string, number>;
    comment?: string;
  };

  if (!team_id || !responses || Object.keys(responses).length !== 4) {
    return NextResponse.json({ error: 'Invalid pulse submission' }, { status: 400 });
  }

  // Validate all responses are 1-5
  for (const [, value] of Object.entries(responses)) {
    if (value < 1 || value > 5) {
      return NextResponse.json({ error: 'Scores must be 1-5' }, { status: 400 });
    }
  }

  // TODO: Ivan — write to pulse_responses table (de-identified, no user_id)
  // The table stores: facility_id, team_id, cycle_id, q1-q4 scores, comment, submitted_at
  // No IP address, no session ID, no user identifier of any kind.

  console.log(`[PulseAPI] Anonymous pulse submitted — team: ${team_id}, responses: ${JSON.stringify(responses)}`);

  return NextResponse.json({
    success: true,
    message: 'Your responses have been recorded anonymously.',
  });
}
