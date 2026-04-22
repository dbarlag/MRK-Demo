import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { mockParorende } from '@/data/mockUser';

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;

  return NextResponse.json(mockParorende);
}
