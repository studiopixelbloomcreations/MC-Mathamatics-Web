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

  // Handle host-based routing (e.g. admin.mcmaths.lk)
  if (isAdminHost) {
    if (!pathname.startsWith("/admin")) {
      const url = req.nextUrl.clone();
      url.pathname = `/admin${pathname}`;
      const res = NextResponse.rewrite(url);
      res.headers.set("X-Robots-Tag", "noindex, nofollow");
      return res;
    }
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  // Allow /admin on vercel.app domains, dev, or when explicitly accessed
  if (pathname.startsWith("/admin")) {
    if (isVercel || isDev) {
      const res = NextResponse.next();
      res.headers.set("X-Robots-Tag", "noindex, nofollow");
      return res;
    }
    return new NextResponse("Not Found", { status: 404 });
  }

  // For internationalized public routes
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
