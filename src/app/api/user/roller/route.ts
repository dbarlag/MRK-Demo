import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;

  // Vakt /roles returns role definitions (Administrator/Volunteer/etc.), not
  // the user's assigned roles. Empty until backend exposes a user-scoped endpoint.
  return NextResponse.json([]);
}
