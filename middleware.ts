import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of routes that do not require authentication
const PUBLIC_PATHS = [
  "/login",
  "/logout",
  "/_next",
  "/favicon.ico",
  "/sipoma-logo.png",
  "/api",
  "/public",
  "/manifest.json",
  "/sw.js",
  "/workbox-",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }
  // Check for Supabase session cookie
  const supabaseToken =
    request.cookies.get("sb-access-token") || request.cookies.get("sb:token");
  if (!supabaseToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next|favicon.ico|sipoma-logo.png|manifest.json|sw.js|workbox-).*)",
  ],
};
