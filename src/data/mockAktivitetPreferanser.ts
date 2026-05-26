import type { AktivitetPreferanser } from '@/types';

// Pre-seeded: the user already has one active activity. Picks Besøkstjeneste at
// Volda Røde Kors so it lines up with mockUser.forening.
export const mockAktivitetPreferanser: AktivitetPreferanser = {
  activityId: 'L230-2',
  globalActivityName: 'Besøkstjeneste',
  localActivityName: 'Volda Røde Kors Besøkstjeneste',
  municipality: 'Volda',
  neighborhood: null,
  branchName: 'Volda Røde Kors',
};
