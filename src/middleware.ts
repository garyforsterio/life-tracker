import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { routing } from '#i18n/routing';
import createMiddleware from 'next-intl/middleware';

const i18nMiddleware = createMiddleware(routing);

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

const PUBLIC_PATHS = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const locale = pathname.split('/')[1] || 'en';
  const pathnameWithoutLocale = pathname.replace(`/${locale}`, '');

  // Allow public paths
  if (!PUBLIC_PATHS.includes(pathnameWithoutLocale)) {
    console.log('here', {
      pathname,
      pathnameWithoutLocale,
    });

    const token = request.cookies.get('token')?.value;

    if (!token) {
      const url = new URL(`/${locale}/auth/login`, request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      const url = new URL(`/${locale}/auth/login`, request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  return i18nMiddleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
