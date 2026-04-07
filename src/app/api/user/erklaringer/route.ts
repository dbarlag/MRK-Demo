import { NextResponse } from 'next/server';
import { mockErklaringer } from '@/data/mockUser';

export async function GET() {
  return NextResponse.json(mockErklaringer);
}
