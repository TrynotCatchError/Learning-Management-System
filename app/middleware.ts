import { getToken } from 'next-auth/jwt';
import { NextResponse, NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

const authProtectedRoutes = ['/protected'];
const defaultLocale = 'en';
const supportedLocales = ['en', 'de'];

// Create the i18n middleware handler
const handleI18nRouting = createIntlMiddleware({
  locales: supportedLocales,
  defaultLocale: defaultLocale,
});

// Main middleware function
export async function middleware(request: NextRequest) {
  // 1. Check Authentication
  const user = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const { pathname } = request.nextUrl;

  // If a user tries to access a protected route and is not an admin, redirect to home
  if (
    authProtectedRoutes.some((route) => pathname.startsWith(route)) &&
    (!user || user.role !== 'admin')
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. Handle i18n routing if the request is not redirected
  return handleI18nRouting(request);
}

// Export config for route matching
export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
