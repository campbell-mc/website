// api/team-loop/practice/route.ts
// Leader commits to a practice for their team this fortnight.
// Records: original practice ID, personalised version, CHRIS-optimised version.
// Feeds into: action log, next Team Briefing, ISO 45003 evidence, outcome measurement.

import { NextRequest, NextResponse } from 'next/server';
import { callClaudeText } from '@/lib/anthropic/client';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { facility_id, team_id, cycle_id, practice_id, original_text, personalised_text, action } = body as {
    facility_id: string;
    team_id: string;
    cycle_id: number;
    practice_id: string;
    original_text: string;
    personalised_text: string;
    action: 'optimise' | 'submit';
  };

  if (!facility_id || !team_id || !practice_id) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Step 1: If action is 'optimise', call Claude to refine the practice
  if (action === 'optimise') {
    const optimised = await callClaudeText({
      system: `You are CHRIS — refining a leader's personalised practice for their aged care team. The original practice comes from the canonical library. The leader has adapted it for their context. Your job: sharpen it, make it more specific, and add one coaching suggestion. Never remove the leader's personal touch. Keep their voice. Add one practical detail that makes it more implementable. Keep under 150 words. No preamble.`,
      messages: [{
        role: 'user',
        content: `Original practice:\n${original_text}\n\nLeader's version:\n${personalised_text}\n\nRefine this for their specific team context. Keep their voice. Add one practical coaching detail.`,
      }],
      maxTokens: 300,
      facilityId: facility_id,
      agentName: 'briefing_engine',
      callType: 'practice_optimisation',
    });

    return NextResponse.json({ success: true, optimised_text: optimised });
  }

  // Step 2: If action is 'submit', record the practice commitment
  // TODO: Ivan — write to facility_interventions table:
  //   facility_id, team_id, cycle_id, practice_id,
  //   practice_personalised (the final text), prescribed_at, team_loop_completed: false

  // TODO: Ivan — transition cycle state to 'in_progress'
  // TODO: Ivan — add to action_log for this team leader
  // TODO: Ivan — include in next Team Briefing (briefing_engine)

  console.log(`[PracticeAPI] Practice committed — team: ${team_id}, cycle: ${cycle_id}, practice: ${practice_id}`);

  return NextResponse.json({
    success: true,
    message: 'Practice committed. Added to your action log.',
  });
}
