// ============================================================================
// POST /api/threads/[id]/resolve — Mark a thread comment as resolved
// TODO: Ivan — wire to threads table in Neon
// ============================================================================

import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // TODO: Ivan — update resolved=true in threads table
  console.log(`[ThreadAPI] Resolved: ${id}`);

  return NextResponse.json({ success: true, id });
}
