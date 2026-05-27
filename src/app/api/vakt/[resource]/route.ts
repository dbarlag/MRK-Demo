import { NextRequest, NextResponse } from 'next/server';
import { vakt } from '@/lib/vakt-client';
import { requireAuth } from '@/lib/api-auth';

const RESOURCE_MAP: Record<string, keyof typeof vakt> = {
  districts: 'districts',
  activities: 'activities',
  departments: 'departments',
  subactivities: 'subactivities',
  'shift-blocks': 'shiftBlocks',
  shifts: 'shifts',
  roles: 'roles',
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ resource: string }> },
) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { resource } = await params;
  const method = RESOURCE_MAP[resource];
  if (!method) {
    return NextResponse.json({ error: `Unknown resource: ${resource}` }, { status: 404 });
  }

  const queryParams: Record<string, string> = {};
  req.nextUrl.searchParams.forEach((v, k) => { queryParams[k] = v; });

  try {
    const data = await vakt[method](Object.keys(queryParams).length ? queryParams : undefined);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
