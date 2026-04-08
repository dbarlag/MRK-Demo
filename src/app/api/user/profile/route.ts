import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { mockUser } from '@/data/mockUser';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // TODO: Replace mock data with backend call using session.accessToken
  return NextResponse.json(mockUser);
}
