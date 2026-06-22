import { mockUser, mockParorende, mockErklaringer } from '@/data/mockUser';
import { mockMedlemskap, mockAktiviteter, mockRoller, mockVerv } from '@/data/mockEngagement';
import { mockKurser, mockSprak, mockSertifikater } from '@/data/mockCompetence';
import { mockEvents, mockPameldinger } from '@/data/mockTimeplan';
import { mockAktivitetPreferanser } from '@/data/mockAktivitetPreferanser';
import type { UserProfile, Parorende, Erklering, Medlemskap, Aktivitet, Rolle, Verv, Kurs, Sprak, Sertifikat, TimeplanEvent, AktivitetPreferanser } from '@/types';

// Fetch from our own API routes; fall back to mock data if the request fails.
async function get<T>(path: string, fallback: T): Promise<T> {
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

// Aktivitetspreferanser
export const fetchAktivitetPreferanser = () =>
  get<AktivitetPreferanser>('/user/aktivitet-preferanser', mockAktivitetPreferanser);

export async function saveAktivitetPreferanser(prefs: AktivitetPreferanser): Promise<AktivitetPreferanser> {
  try {
    const res = await fetch('/api/user/aktivitet-preferanser', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prefs),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  } catch {
    return prefs;
  }
}
