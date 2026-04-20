import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;

  // Vakt API does not expose next-of-kin data — empty until backend extends scope
  return NextResponse.json([]);
}
