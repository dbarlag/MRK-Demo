import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { mockNyttigKort, mockTjenester } from '@/data/mockDashboard';

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;

  return NextResponse.json({ nyttig: mockNyttigKort, tjenester: mockTjenester });
}
