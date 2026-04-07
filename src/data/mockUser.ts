import type { UserProfile, Parorende, Erklering } from '@/types';

export const mockUser: UserProfile = {
  id: '1',
  name: 'Ola Norman',
  birthDate: '21.12.1990',
  rkEmail: 'kari.hansen@rodekors.org',
  email: 'kari.hansen@gmail.com',
  rkNr: '34734758',
  phone: '+47 47 12 12 12',
  address: 'Solveien 45c, 1256 Oslo',
  forening: 'Volda Røde Kors',
  avatarInitial: 'F',
};

export const mockParorende: Parorende[] = [
  {
    id: '1',
    navn: 'Petter Kalsen',
    relasjon: 'Far',
    telefon: '+47 47 12 23 14',
    epost: 'petter.karlsen@gmail.com',
  },
];

export const mockErklaringer: Erklering[] = [
  {
    id: '1',
    type: 'etikk',
    tittel: 'Etikkerklæringen',
    dato: '21.12.2025',
  },
  {
    id: '2',
    type: 'taushet',
    tittel: 'Taushetserklæringen',
    dato: '21.12.2025',
  },
  {
    id: '3',
    type: 'politiattest',
    tittel: 'Politiattest',
    dato: '21.12.2025',
    status: 'Gyldig',
    statusColor: 'success',
  },
];
