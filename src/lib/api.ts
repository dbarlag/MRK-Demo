const BASE = '/api';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// User
export const fetchProfile = () => get<import('@/types').UserProfile>('/user/profile');
export const fetchParorende = () => get<import('@/types').Parorende[]>('/user/parorende');
export const fetchErklaringer = () => get<import('@/types').Erklering[]>('/user/erklaringer');

// Engagement
export const fetchMedlemskap = () => get<import('@/types').Medlemskap>('/user/medlemskap');
export const fetchAktiviteter = () => get<import('@/types').Aktivitet[]>('/user/aktiviteter');
export const fetchRoller = () => get<import('@/types').Rolle[]>('/user/roller');
export const fetchVerv = () => get<import('@/types').Verv[]>('/user/verv');

// Competence
export const fetchKurser = () => get<import('@/types').Kurs[]>('/user/kurser');
export const fetchSprak = () => get<import('@/types').Sprak[]>('/user/spraker');
export const fetchSertifikater = () => get<import('@/types').Sertifikat[]>('/user/sertifikater');

// Timeplan
export const fetchTimeplan = () => get<import('@/types').TimeplanEvent[]>('/timeplan');

// Dashboard
export const fetchDashboard = () => get<{
  nyttig: import('@/types').NyttigKort[];
  tjenester: import('@/types').TjenesteKategori[];
}>('/dashboard');
