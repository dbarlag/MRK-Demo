import { NextResponse } from 'next/server';
import { getSession } from './auth';

/**
 * Check auth on API routes. Skipped during static export (GitHub Pages).
 * Returns null if authorized, or a 401 response if not.
 */
export async function requireAuth(): Promise<NextResponse | null> {
  // Static export: no auth available, allow all requests (uses mock data anyway)
  if (process.env.IS_STATIC_EXPORT === 'true') return null;

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
