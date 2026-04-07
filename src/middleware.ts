import { NextRequest, NextResponse } from 'next/server';

// TODO: Replace with real Okta session validation
// import { getOktaSession } from './lib/auth';

const PUBLIC_PATHS = ['/login', '/api/auth'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // TODO: Uncomment when Okta is configured
  // const session = await getOktaSession(req);
  // if (!session) {
  //   return NextResponse.redirect(new URL('/login', req.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
};
