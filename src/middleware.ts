import { NextResponse, type NextRequest, type NextFetchEvent } from 'next/server';
import { withAuth } from 'next-auth/middleware';

const authMiddleware = withAuth({ pages: { signIn: '/login' } });

// Simple fixed-window rate limit for /api/* to curb scraping / abuse of the
// Vakt proxy. NOTE: this is per-edge-instance in-memory state — it resets on
// cold start and is not shared across regions, so it's a soft guardrail, not a
// hard quota. For a strict, distributed limit use Vercel WAF or Upstash Redis.
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 100;
const hits = new Map<string, { count: number; resetAt: number }>();

function clientId(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  return fwd?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
}

function rateLimited(req: NextRequest): NextResponse | null {
  const now = Date.now();
  const key = clientId(req);
  const entry = hits.get(key);

  if (!entry || now >= entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return null;
  }

  entry.count += 1;
  if (entry.count > MAX_REQUESTS) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    );
  }
  return null;
}

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  if (req.nextUrl.pathname.startsWith('/api/')) {
    const limited = rateLimited(req);
    if (limited) return limited;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (authMiddleware as any)(req, event);
}

export const config = {
  matcher: [
    /*
     * Protect all routes except:
     * - /login (sign-in page)
     * - /api/auth (NextAuth endpoints)
     * - /_next (Next.js internals)
     * - /images, /favicon.ico (static assets)
     */
    '/((?!login|api/auth|_next|images|favicon.ico).*)',
  ],
};
