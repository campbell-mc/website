import { NextRequest, NextResponse } from "next/server";
import { sendMagicLink } from "@/lib/auth/magic-link";

export async function POST(request: NextRequest) {
  const { phone } = await request.json();

  if (!phone) {
    return NextResponse.json({ error: "Phone number required" }, { status: 400 });
  }

  const result = await sendMagicLink(phone);

  // Always return success to avoid phone enumeration
  return NextResponse.json({ success: true });
}
