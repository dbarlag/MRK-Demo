import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { mockAktivitetPreferanser } from '@/data/mockAktivitetPreferanser';
import type { AktivitetPreferanser } from '@/types';

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;
  return NextResponse.json(mockAktivitetPreferanser);
}

export async function PUT(req: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;
  const body = (await req.json()) as AktivitetPreferanser;
  // No real persistence yet — echo back so the client can confirm shape.
  return NextResponse.json(body);
}
