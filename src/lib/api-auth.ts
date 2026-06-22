import { NextResponse } from 'next/server';
import { getSession } from './auth';

/**
 * Check auth on API routes.
 * Returns null if authorized, or a 401 response if not.
 */
export async function requireAuth(): Promise<NextResponse | null> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
