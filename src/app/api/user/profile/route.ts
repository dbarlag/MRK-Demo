import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { mockUser } from '@/data/mockUser';

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;

  // TODO: Replace mock data with backend call using session.accessToken
  return NextResponse.json(mockUser);
}
