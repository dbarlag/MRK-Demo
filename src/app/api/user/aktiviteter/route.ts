import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;

  // Vakt API only exposes all activities for a district, not the user's
  // personal activities. Empty until backend exposes a user-scoped endpoint.
  return NextResponse.json([]);
}
