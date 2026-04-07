export const dynamic = "force-static";
import { NextResponse } from 'next/server';
import { mockMedlemskap } from '@/data/mockEngagement';

export async function GET() {
  return NextResponse.json(mockMedlemskap);
}
