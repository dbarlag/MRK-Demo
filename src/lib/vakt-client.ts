import type {
  PaginatedResponse,
  VaktDistrict,
  VaktActivity,
  VaktDepartment,
  VaktSubactivity,
  VaktShiftBlock,
  VaktShift,
  VaktRole,
  VaktUser,
} from '@/types/vakt-api';

const BASE_URL = process.env.VAKT_API_URL || 'https://frivillig.rodekors.no';
const PREFIX = process.env.VAKT_API_PREFIX || 'main';

async function vaktGet<T>(
  resource: string,
  params?: Record<string, string>,
): Promise<PaginatedResponse<T>> {
  const token = process.env.VAKT_STATS_TOKEN;
  if (!token) {
    throw new Error('VAKT_STATS_TOKEN is not set');
  }

  const url = new URL(`${BASE_URL}/api/${PREFIX}/v1/${resource}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Vakt API ${resource} error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export const vakt = {
  districts: (params?: Record<string, string>) => vaktGet<VaktDistrict>('districts', params),
  activities: (params?: Record<string, string>) => vaktGet<VaktActivity>('activities', params),
  departments: (params?: Record<string, string>) => vaktGet<VaktDepartment>('departments', params),
  subactivities: (params?: Record<string, string>) =>
    vaktGet<VaktSubactivity>('subactivities', params),
  shiftBlocks: (params?: Record<string, string>) => vaktGet<VaktShiftBlock>('shift-blocks', params),
  shifts: (params?: Record<string, string>) => vaktGet<VaktShift>('shifts', params),
  roles: (params?: Record<string, string>) => vaktGet<VaktRole>('roles', params),
  users: (params?: Record<string, string>) => vaktGet<VaktUser>('users', params),
};

/**
 * Look up a Vakt user by their Okta id.
 *
 * NOTE: the `main` /users endpoint does NOT support filtering by okta_id (the
 * query param is silently ignored and the full list is returned). So we page
 * through users and match in code. per_page caps at 250 upstream; the cap below
 * is a safety stop so a misconfigured response can't loop forever.
 */
export async function getUserByOktaId(oktaId: string): Promise<VaktUser | null> {
  const MAX_PAGES = 10;
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const res = await vaktGet<VaktUser>('users', { per_page: '250', page: String(page) });
    const match = res.data.find((u) => u.okta_id === oktaId);
    if (match) return match;
    if (page >= res.meta.last_page) break;
  }
  return null;
}

/** A user's shifts. shifts?user_id= IS supported upstream (verified). */
export async function getUserShifts(userId: string): Promise<VaktShift[]> {
  const res = await vaktGet<VaktShift>('shifts', { user_id: userId, per_page: '250' });
  return res.data;
}

/** Map of role id -> role name. The role set is tiny (currently 4). */
export async function getRolesMap(): Promise<Record<string, string>> {
  const res = await vaktGet<VaktRole>('roles', { per_page: '250' });
  return Object.fromEntries(res.data.map((r) => [r.id, r.name]));
}

/**
 * The most recent shift-blocks. shift-blocks is ordered oldest-first and ignores
 * sort/date filters, so the newest entries live on the last page — we read
 * meta.last_page and fetch that page.
 */
export async function getRecentShiftBlocks(): Promise<VaktShiftBlock[]> {
  const first = await vaktGet<VaktShiftBlock>('shift-blocks', { per_page: '250' });
  const lastPage = first.meta.last_page;
  if (lastPage <= 1) return first.data;
  const last = await vaktGet<VaktShiftBlock>('shift-blocks', {
    per_page: '250',
    page: String(lastPage),
  });
  return last.data;
}
