import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { cycle, answers } = await request.json();

  // TODO: Ivan — write to leaderReflections table (private — never joined to reporting)
  // TODO: Ivan — send reflection summary via iMessage before next cycle
  // TODO: Ivan — feed into next Leader Briefing generation (Keeper reads reflection)

  console.log(`[SelfReflectionAPI] Reflection saved — cycle: ${cycle}, prompts answered: ${Object.keys(answers).length}`);

  return NextResponse.json({ success: true, cycle, saved_at: new Date().toISOString() });
}
