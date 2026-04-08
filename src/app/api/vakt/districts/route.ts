import { NextRequest, NextResponse } from 'next/server';
import { vakt } from '@/lib/vakt-client';
import { requireAuth } from '@/lib/api-auth';

const METHOD_MAP: Record<string, keyof typeof vakt> = {
  'districts': 'districts',
  'activities': 'activities',
  'departments': 'departments',
  'subactivities': 'subactivities',
  'shift-blocks': 'shiftBlocks',
  'shifts': 'shifts',
  'roles': 'roles',
};

export async function GET(req: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;
  try {
    const params: Record<string, string> = {};
    req.nextUrl.searchParams.forEach((v, k) => { params[k] = v; });

    const fn = vakt[METHOD_MAP['districts']];
    const data = await fn(Object.keys(params).length ? params : undefined);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}
