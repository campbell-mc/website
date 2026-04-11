import { NextRequest, NextResponse } from "next/server";
import { verifyMagicLink } from "@/lib/auth/magic-link";

export async function POST(request: NextRequest) {
  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  // Detect mobile from user agent
  const ua = request.headers.get("user-agent") ?? "";
  const isMobile = /iPhone|iPad|Android|Mobile/i.test(ua);

  const result = await verifyMagicLink(token, isMobile);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  // Set session cookie
  const response = NextResponse.json({
    success: true,
    user: result.user,
  });

  response.cookies.set("chris-session", result.sessionToken!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: isMobile ? 30 * 24 * 60 * 60 : 8 * 60 * 60, // 30 days mobile, 8h desktop
    path: "/",
  });

  return response;
}
