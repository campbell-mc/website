import { NextRequest, NextResponse } from "next/server";

// TODO (Ivan): Replace with real DB update — set dismissed_at on queue_items table
// TODO (Ivan): Add auth middleware to verify user session and provider_id
// TODO (Ivan): Log dismissal reason for audit trail (append-only evidence table)

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  console.log(`[queue/dismiss] Item ${id} dismissed at ${new Date().toISOString()}`);

  return NextResponse.json({
    success: true,
    queue_item_id: id,
    dismissed_at: new Date().toISOString(),
    message: "Queue item dismissed.",
  });
}
