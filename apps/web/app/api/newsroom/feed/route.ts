import { NextRequest, NextResponse } from "next/server";
import { getUpdates, getUpdatesByCategory } from "@/lib/agents/curator";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category");
  const limit = parseInt(request.nextUrl.searchParams.get("limit") ?? "50", 10);

  const updates = category
    ? getUpdatesByCategory(category, limit)
    : getUpdates(limit);

  return NextResponse.json({ updates, count: updates.length });
}
