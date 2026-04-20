import type {
  UserProfile,
  Parorende,
  Erklering,
  Medlemskap,
  Aktivitet,
  Rolle,
  Verv,
  Kurs,
  Sprak,
  Sertifikat,
  TimeplanEvent,
  NyttigKort,
  TjenesteKategori,
} from '@/types';

// GitHub Pages static export: no API routes available. Fallback is empty so the
// UI shows proper empty states instead of stale mock data.
const isStatic = typeof window !== 'undefined' && (window as any).__NEXT_DATA__?.basePath === '/MRK-Demo';

async function get<T>(path: string, fallback: T): Promise<T> {
  if (isStatic) return fallback;
  try {
    const res = await fetch(`/api${path}`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  } catch {
    return fallback;
  }
}

const PLACEHOLDER = 'Ikke registrert';
const EMPTY_PROFILE: UserProfile = {
  id: '',
  name: PLACEHOLDER,
  avatarInitial: '',
  rkEmail: PLACEHOLDER,
  email: PLACEHOLDER,
  rkNr: PLACEHOLDER,
  phone: PLACEHOLDER,
  birthDate: PLACEHOLDER,
  address: PLACEHOLDER,
  forening: PLACEHOLDER,
};

// User
export const fetchProfile = () => get<UserProfile>('/user/profile', EMPTY_PROFILE);
export const fetchParorende = () => get<Parorende[]>('/user/parorende', []);
export const fetchErklaringer = () => get<Erklering[]>('/user/erklaringer', []);

// Engagement
export const fetchMedlemskap = () => get<Medlemskap | null>('/user/medlemskap', null);
export const fetchAktiviteter = () => get<Aktivitet[]>('/user/aktiviteter', []);
export const fetchRoller = () => get<Rolle[]>('/user/roller', []);
export const fetchVerv = () => get<Verv[]>('/user/verv', []);

// Competence
export const fetchKurser = () => get<Kurs[]>('/user/kurser', []);
export const fetchSprak = () => get<Sprak[]>('/user/spraker', []);
export const fetchSertifikater = () => get<Sertifikat[]>('/user/sertifikater', []);

// Timeplan
export const fetchTimeplan = () => get<TimeplanEvent[]>('/timeplan', []);
export const fetchPameldinger = () => get<TimeplanEvent[]>('/pameldinger', []);

// Dashboard
export const fetchDashboard = () => get<{ nyttig: NyttigKort[]; tjenester: TjenesteKategori[] }>(
  '/dashboard',
  { nyttig: [], tjenester: [] },
);
