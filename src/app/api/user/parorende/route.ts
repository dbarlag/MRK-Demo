import { NextResponse } from 'next/server';
import { mockParorende } from '@/data/mockUser';

export async function GET() {
  return NextResponse.json(mockParorende);
}
