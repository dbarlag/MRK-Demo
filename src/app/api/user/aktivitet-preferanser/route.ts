import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { mockAktivitetPreferanser } from '@/data/mockAktivitetPreferanser';
import type { AktivitetPreferanser } from '@/types';

const FIELDS = [
  'activityId',
  'globalActivityName',
  'localActivityName',
  'municipality',
  'neighborhood',
  'branchName',
] as const;
const MAX_FIELD_LEN = 200;

function isAktivitetPreferanser(v: unknown): v is AktivitetPreferanser {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  for (const k of FIELDS) {
    if (!(k in o)) return false;
    const val = o[k];
    if (val === null) continue;
    if (typeof val !== 'string' || val.length > MAX_FIELD_LEN) return false;
  }
  return true;
}

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;
  return NextResponse.json(mockAktivitetPreferanser);
}

export async function PUT(req: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!isAktivitetPreferanser(body)) {
    return NextResponse.json({ error: 'Invalid body shape' }, { status: 400 });
  }

  // No real persistence yet — echo back so the client can confirm shape.
  return NextResponse.json(body);
}
