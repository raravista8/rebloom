import { NextResponse, type NextRequest } from 'next/server';

// Server-side auth gate for the authenticated app routes. Without it those pages
// render the signed-in chrome (header + «Продать букет» CTA + skeletons) for a beat
// before the client-side /me check redirects — a visible flash of the logged-in UI
// for signed-out users (e.g. clicking «Опубликовать букет» from the public landing).
//
// We can't validate the opaque session here (it lives in Redis), but cookie-presence
// is enough to gate the render flash; the API + page still enforce real auth (a stale
// cookie falls through and the client /me check redirects). Public routes — landing,
// /[city] SEO pages, listing /l, profile /u, /search, /city picker, /login — are
// intentionally NOT matched so crawlers and signed-out browsing keep working.
export function middleware(req: NextRequest) {
  if (req.cookies.has('session')) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = '/login';
  url.search = '';
  url.searchParams.set('next', req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/sell/:path*',
    '/deal/:path*',
    '/deals/:path*',
    '/notifications/:path*',
    '/me/:path*',
    '/settings/:path*',
    '/admin/:path*',
  ],
};
