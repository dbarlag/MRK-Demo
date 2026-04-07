import { NextResponse } from 'next/server';
import { mockPameldinger } from '@/data/mockTimeplan';

export async function GET() {
  return NextResponse.json(mockPameldinger);
}
