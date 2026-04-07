export const dynamic = "force-static";
import { NextResponse } from 'next/server';
import { mockKurser } from '@/data/mockCompetence';

export async function GET() {
  return NextResponse.json(mockKurser);
}
