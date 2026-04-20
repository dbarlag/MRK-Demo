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

export async function getUserByOktaId(oktaId: string): Promise<VaktUser | null> {
  const page = await vaktGet<VaktUser>('users', { okta_id: oktaId, per_page: '1' });
  return page.data[0] ?? null;
}
