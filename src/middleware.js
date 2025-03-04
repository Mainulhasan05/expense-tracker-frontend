// middleware.js
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("finance-tracker-token")?.value;

  // If the user is trying to access the login page but already has a token, redirect to dashboard
  if (request.nextUrl.pathname === "/" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If the user is trying to access any dashboard route but doesn't have a token, redirect to login
  if (request.nextUrl.pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Specify the paths the middleware should run on
export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};
