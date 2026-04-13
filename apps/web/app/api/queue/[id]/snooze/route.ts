import { NextRequest, NextResponse } from "next/server";

// TODO (Ivan): Replace with real DB update — set snoozed_until on queue_items table
// TODO (Ivan): Add auth middleware to verify user session and provider_id
// TODO (Ivan): Re-surface the item when snoozed_until expires (cron job or realtime check)

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const hours = body.hours || 1;

  const snoozedUntil = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

  console.log(`[queue/snooze] Item ${id} snoozed for ${hours}h until ${snoozedUntil}`);

  return NextResponse.json({
    success: true,
    queue_item_id: id,
    snoozed_until: snoozedUntil,
    message: `Snoozed for ${hours} hour${hours === 1 ? "" : "s"}.`,
  });
}
