// ============================================================================
// GET /api/don/queue — Fetch pending DON review items
// PATCH /api/don/queue — Update item status (approve/modify/reject)
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { db, donReviewItems } from "@chris/db";
import { eq, and, desc, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const facilityId = request.nextUrl.searchParams.get("facilityId");

  if (!facilityId) {
    return NextResponse.json({ error: "facilityId required" }, { status: 400 });
  }

  const items = await db
    .select()
    .from(donReviewItems)
    .where(
      and(
        eq(donReviewItems.facilityId, facilityId),
        eq(donReviewItems.status, "pending")
      )
    )
    .orderBy(
      sql`CASE urgency WHEN 'immediate' THEN 1 WHEN 'urgent' THEN 2 WHEN 'routine' THEN 3 END`,
      desc(donReviewItems.createdAt)
    );

  return NextResponse.json({ items });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { itemId, action, note, modifications, decidedBy } = body;

  if (!itemId || !action) {
    return NextResponse.json({ error: "itemId and action required" }, { status: 400 });
  }

  if (action === "reject" && (!note || note.length < 20)) {
    return NextResponse.json({ error: "Rejection requires a note of at least 20 characters" }, { status: 400 });
  }

  if (action === "modify" && !note) {
    return NextResponse.json({ error: "Modification requires a note" }, { status: 400 });
  }

  const status = action === "approve" ? "approved" : action === "modify" ? "modified" : "rejected";

  await db
    .update(donReviewItems)
    .set({
      status,
      decidedAt: new Date(),
      decidedBy: decidedBy ?? "DON",
      donNote: note ?? null,
      modifiedContent: modifications ?? null,
      actionExecutedAt: action === "approve" ? new Date() : null,
    })
    .where(eq(donReviewItems.id, itemId));

  return NextResponse.json({ success: true, status });
}
