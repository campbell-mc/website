import { NextResponse } from "next/server";
import { exerciseAgents, getLastExercise } from "@/lib/agents/exercise";

export async function POST() {
  const result = exerciseAgents();
  return NextResponse.json(result);
}

export async function GET() {
  const last = getLastExercise();
  if (!last) {
    // Run on first GET if never exercised
    const result = exerciseAgents();
    return NextResponse.json(result);
  }
  return NextResponse.json(last);
}
