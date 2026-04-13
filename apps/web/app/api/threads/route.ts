// ============================================================================
// POST /api/threads — Create a thread comment on any object
// TODO: Ivan — wire to threads table in Neon
// ============================================================================

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { facility_id, object_type, object_id, author_role, content } = body;

  if (!facility_id || !object_type || !object_id || !author_role || !content) {
    return NextResponse.json(
      { error: "Missing required fields: facility_id, object_type, object_id, author_role, content" },
      { status: 400 }
    );
  }

  const threadId = `thread-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  // TODO: Ivan — write to threads table
  console.log(
    `[ThreadAPI] New comment: ${threadId} | ${object_type}/${object_id} | ${author_role} | facility=${facility_id}`
  );

  const thread = {
    id: threadId,
    facility_id,
    object_type,
    object_id,
    author_role,
    content,
    created_at: new Date().toISOString(),
    resolved: false,
  };

  return NextResponse.json({ thread });
}
