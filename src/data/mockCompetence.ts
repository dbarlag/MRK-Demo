import type { Kurs, Sprak, Sertifikat } from '@/types';

export const mockKurser: Kurs[] = [
  {
    id: '1',
    tittel: 'Startkurs',
    status: 'Fullfort',
    statusColor: 'success',
    forening: 'Volda Røde Kors',
    dato: '05.05.2025',
    type: 'Base',
  },
  {
    id: '2',
    tittel: 'Omsorg',
    status: 'Fullfort',
    statusColor: 'success',
    forening: 'Volda Røde Kors',
    dato: '05.05.2025',
    type: 'Temakurs',
  },
];

export const mockSprak: Sprak[] = [
  { sprak: 'Norsk', niva: 'morsmål' },
  { sprak: 'Engelsk', niva: 'bra' },
  { sprak: 'Arabisk', niva: 'nybegynner' },
];

export const mockSertifikater: Sertifikat[] = [
  { type: 'Personbil', klasse: 'B' },
  { type: 'Snøscooter', klasse: 'S' },
];
