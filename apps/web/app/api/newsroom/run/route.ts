import { NextResponse } from "next/server";
import { runCurator } from "@/lib/agents/curator";

export async function POST() {
  try {
    const result = await runCurator();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Curator run failed" },
      { status: 500 }
    );
  }
}
