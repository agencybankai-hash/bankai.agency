import { NextResponse } from "next/server";

const locales = ["ru", "en"];
const defaultLocale = "ru";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) return;

  // Skip static files and api routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // static files like favicon.ico, icon.svg
  ) {
    return;
  }

  // Redirect to default locale
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Match all paths except static files and api
    "/((?!_next|api|favicon\\.ico|icon\\.svg|apple-icon\\.png|robots\\.txt|sitemap\\.xml).*)",
  ],
};
