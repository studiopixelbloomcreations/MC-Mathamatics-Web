import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const pathname = req.nextUrl.pathname;
  const isDev = process.env.NODE_ENV !== "production";
  const isVercel = host.includes("vercel.app");
  const isAdminHost = host.startsWith("admin.");

  // Allow static assets, next internal files, and api routes to pass through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Handle host-based routing
  if (isAdminHost) {
    // Rewrite requests on admin subdomain to the /admin route group
    if (!pathname.startsWith("/admin")) {
      const url = req.nextUrl.clone();
      url.pathname = `/admin${pathname}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // Allow /admin on vercel.app domains, dev, or when explicitly allowed
  if (pathname.startsWith("/admin")) {
    if (isVercel || isDev) {
      return NextResponse.next();
    }
    return new NextResponse("Not Found", { status: 404 });
  }

  // For internationalized public routes
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
