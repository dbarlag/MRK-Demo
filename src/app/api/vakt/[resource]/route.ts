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

// Only these query params are forwarded upstream. Anything else (arbitrary
// filters a caller might try) is dropped, so the proxy can't be used to mine
// the Vakt API beyond plain pagination.
const ALLOWED_PARAMS = new Set(['page', 'per_page']);
const MAX_PER_PAGE = 100;

/** Keep only allowlisted params, drop the rest, and clamp per_page so a single
 * call can't pull an unbounded amount of data. */
function sanitizeParams(searchParams: URLSearchParams): Record<string, string> {
  const out: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    if (!ALLOWED_PARAMS.has(key)) return;
    if (key === 'per_page') {
      const n = Number.parseInt(value, 10);
      if (!Number.isFinite(n) || n < 1) return;
      out.per_page = String(Math.min(n, MAX_PER_PAGE));
      return;
    }
    if (key === 'page') {
      const n = Number.parseInt(value, 10);
      if (!Number.isFinite(n) || n < 1) return;
      out.page = String(n);
    }
  });
  return out;
}

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

  const queryParams = sanitizeParams(req.nextUrl.searchParams);

  try {
    const data = await vakt[method](Object.keys(queryParams).length ? queryParams : undefined);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
