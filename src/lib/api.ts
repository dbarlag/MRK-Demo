import { mockUser, mockParorende, mockErklaringer } from '@/data/mockUser';
import { mockMedlemskap, mockAktiviteter, mockRoller, mockVerv } from '@/data/mockEngagement';
import { mockKurser, mockSprak, mockSertifikater } from '@/data/mockCompetence';
import { mockEvents, mockPameldinger } from '@/data/mockTimeplan';
import type { UserProfile, Parorende, Erklering, Medlemskap, Aktivitet, Rolle, Verv, Kurs, Sprak, Sertifikat, TimeplanEvent } from '@/types';

// GitHub Pages static export: no API routes available, use mock data directly
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

// User
export const fetchProfile = () => get<UserProfile>('/user/profile', mockUser);
export const fetchParorende = () => get<Parorende[]>('/user/parorende', mockParorende);
export const fetchErklaringer = () => get<Erklering[]>('/user/erklaringer', mockErklaringer);

// Engagement
export const fetchMedlemskap = () => get<Medlemskap>('/user/medlemskap', mockMedlemskap);
export const fetchAktiviteter = () => get<Aktivitet[]>('/user/aktiviteter', mockAktiviteter);
export const fetchRoller = () => get<Rolle[]>('/user/roller', mockRoller);
export const fetchVerv = () => get<Verv[]>('/user/verv', mockVerv);

// Competence
export const fetchKurser = () => get<Kurs[]>('/user/kurser', mockKurser);
export const fetchSprak = () => get<Sprak[]>('/user/spraker', mockSprak);
export const fetchSertifikater = () => get<Sertifikat[]>('/user/sertifikater', mockSertifikater);

// Timeplan
export const fetchTimeplan = () => get<TimeplanEvent[]>('/timeplan', mockEvents);
export const fetchPameldinger = () => get<TimeplanEvent[]>('/pameldinger', mockPameldinger);
