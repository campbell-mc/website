import { NextRequest, NextResponse } from "next/server";

// Routes that don't require auth
const PUBLIC_PATHS = [
  "/",
  "/auth/login",
  "/auth/verify",
  "/api/auth/send-link",
  "/api/auth/verify",
  "/comply",
  "/comply/results",
  "/api/comply/submit",
];

export function middleware(request: NextRequest) {
  // DEV MODE: auth bypass — remove this block before production
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // Allow static files
  if (pathname.startsWith("/_next") || pathname.startsWith("/icons") || pathname === "/manifest.json" || pathname === "/sw.js") {
    return NextResponse.next();
  }

  // Check for session cookie
  const session = request.cookies.get("chris-session");

  if (!session) {
    // Redirect to login
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Session exists — allow through
  // Full validation happens in API routes / server components
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
