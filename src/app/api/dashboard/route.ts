export const dynamic = "force-static";
import { NextResponse } from 'next/server';
import { mockNyttigKort, mockTjenester } from '@/data/mockDashboard';

export async function GET() {
  return NextResponse.json({ nyttig: mockNyttigKort, tjenester: mockTjenester });
}
