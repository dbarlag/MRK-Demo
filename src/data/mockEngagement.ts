import type { Medlemskap, Aktivitet, Rolle, Verv } from '@/types';

export const mockMedlemskap: Medlemskap = {
  tittel: 'Medlem',
  status: 'Pågående',
  statusColor: 'success',
  forening: 'Volda Røde Kors',
  startdato: '05.05.2025',
  sluttdato: '05.05.2026',
  type: 'Voksen',
};

export const mockAktiviteter: Aktivitet[] = [
  {
    id: '1',
    tittel: 'Besøkstjenesten',
    status: 'Pågående',
    statusColor: 'success',
    forening: 'Volda Røde Kors',
    startdato: '05.05.2024',
    sluttdato: 'pågående',
    gruppe: 'Torsdagsgruppen',
  },
  {
    id: '2',
    tittel: 'Fellesverket',
    status: 'Fullfort',
    statusColor: 'info',
    forening: 'Volda Røde Kors',
    startdato: '05.05.2022',
    sluttdato: '05.05.2024',
    gruppe: 'Gruppe2',
  },
  {
    id: '3',
    tittel: 'Fellesverket',
    status: 'Fullfort',
    statusColor: 'info',
    forening: 'Volda Røde Kors',
    startdato: '05.05.2022',
    sluttdato: '05.05.2024',
    gruppe: 'Gruppe2',
  },
];

export const mockRoller: Rolle[] = [
  {
    id: '1',
    tittel: 'Gruppeleder',
    status: 'Pågående',
    statusColor: 'success',
    forening: 'Volda Røde Kors',
    aktivitet: 'Besøkstjenesten',
    startdato: '05.05.2024',
    sluttdato: 'pågående',
    gruppe: 'Torsdagsgruppen',
  },
];

export const mockVerv: Verv[] = [
  {
    id: '1',
    tittel: 'Leder i lokalråd omsorg',
    status: 'Pågående',
    statusColor: 'success',
    forening: 'Volda Røde Kors',
    startdato: '05.05.2024',
    sluttdato: 'pågående',
  },
];
