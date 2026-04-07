import { NextResponse } from 'next/server';
import { mockSertifikater } from '@/data/mockCompetence';

export async function GET() {
  return NextResponse.json(mockSertifikater);
}
