import type {
  PaginatedResponse,
  VaktDistrict,
  VaktActivity,
  VaktDepartment,
  VaktSubactivity,
  VaktShiftBlock,
  VaktShift,
  VaktRole,
} from '@/types/vakt-api';

async function vaktGet<T>(path: string, params?: Record<string, string>): Promise<PaginatedResponse<T>> {
  const baseUrl = process.env.VAKT_API_URL || 'https://vakt.rodekors.no';
  const token = process.env.VAKT_STATS_TOKEN;

  if (!token) {
    throw new Error('VAKT_STATS_TOKEN is not set');
  }

  const url = new URL(`${baseUrl}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
    next: { revalidate: 300 }, // cache 5 min
  });

  if (!res.ok) {
    throw new Error(`Vakt API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export const vakt = {
  districts: (params?: Record<string, string>) =>
    vaktGet<VaktDistrict>('/api/stats/v1/districts', params),

  activities: (params?: Record<string, string>) =>
    vaktGet<VaktActivity>('/api/stats/v1/activities', params),

  departments: (params?: Record<string, string>) =>
    vaktGet<VaktDepartment>('/api/stats/v1/departments', params),

  subactivities: (params?: Record<string, string>) =>
    vaktGet<VaktSubactivity>('/api/stats/v1/subactivities', params),

  shiftBlocks: (params?: Record<string, string>) =>
    vaktGet<VaktShiftBlock>('/api/stats/v1/shift-blocks', params),

  shifts: (params?: Record<string, string>) =>
    vaktGet<VaktShift>('/api/stats/v1/shifts', params),

  roles: (params?: Record<string, string>) =>
    vaktGet<VaktRole>('/api/stats/v1/roles', params),
};
