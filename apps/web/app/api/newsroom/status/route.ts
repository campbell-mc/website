import { NextResponse } from "next/server";
import { getStats, getRunHistory } from "@/lib/agents/curator";

export async function GET() {
  return NextResponse.json({
    ...getStats(),
    runs: getRunHistory(),
  });
}
