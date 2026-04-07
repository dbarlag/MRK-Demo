import { NextResponse } from 'next/server';
import { mockSprak } from '@/data/mockCompetence';

export async function GET() {
  return NextResponse.json(mockSprak);
}
