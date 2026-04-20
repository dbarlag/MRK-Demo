import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { getSession } from '@/lib/auth';
import { getUserByOktaId } from '@/lib/vakt-client';

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;

  const session = await getSession();
  const oktaId = session?.user?.id;
  if (!oktaId) return NextResponse.json([]);

  try {
    const vaktUser = await getUserByOktaId(oktaId);
    if (!vaktUser) return NextResponse.json([]);
    // Aggregating past-signups + shifts + shift-blocks into TimeplanEvent is pending;
    // until then, return empty so the UI shows a proper empty state.
    return NextResponse.json([]);
  } catch {
    return NextResponse.json([]);
  }
}
