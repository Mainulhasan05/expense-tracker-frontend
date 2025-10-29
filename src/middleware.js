// middleware.js
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// Helper function to decode JWT payload
function decodeJWT(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = Buffer.from(parts[1], "base64").toString("utf-8");
    return JSON.parse(payload);
  } catch (error) {
    return null;
  }
}

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

  // If the user is trying to access admin routes, check if they have admin role
  if (request.nextUrl.pathname.startsWith("/dashboard/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const decoded = decodeJWT(token);
    if (!decoded || decoded.role !== "admin") {
      // Redirect non-admin users to regular dashboard with error
      const response = NextResponse.redirect(new URL("/dashboard", request.url));
      response.cookies.set("admin-access-denied", "true", { maxAge: 5 });
      return response;
    }
  }

  return NextResponse.next();
}

// Specify the paths the middleware should run on
export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};
