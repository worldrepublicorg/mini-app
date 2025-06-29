import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

// Add your supported locales here
const locales = [
  "en",
  "es",
  "pt",
  "hr",
  "ja",
  "ms",
  "fil",
  "ko",
  "hi",
  "bn",
  "ar",
  "ru",
  "zh",
  "id",
  "fr",
  "de",
  "pl",
  "ur",
  "sw",
  "pcm",
  "tl",
  "tr",
  "th",
];
const defaultLocale = "en";

function getLocale(request: NextRequest): string {
  // Check for stored preference in cookie
  const preferredLanguage = request.cookies.get("preferredLanguage")?.value;
  if (preferredLanguage && locales.includes(preferredLanguage)) {
    return preferredLanguage;
  }

  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  return match(languages, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip if the request is for an asset or API route
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".")
  ) {
    return;
  }

  // Check if the pathname is missing a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname === "/" ? "" : pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next|api|.*\\.).*)",
    // Optional: Match all root level pages
    "/",
  ],
};
