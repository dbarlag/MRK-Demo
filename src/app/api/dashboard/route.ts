import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { mockNyttigKort, mockTjenester } from '@/data/mockDashboard';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return NextResponse.json({ nyttig: mockNyttigKort, tjenester: mockTjenester });
}
