export const dynamic = "force-static";
import { NextResponse } from 'next/server';
import { mockVerv } from '@/data/mockEngagement';

export async function GET() {
  return NextResponse.json(mockVerv);
}
