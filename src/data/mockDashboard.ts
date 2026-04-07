import type { NyttigKort, TjenesteKategori } from '@/types';

export const mockNyttigKort: NyttigKort[] = [
  {
    id: '1',
    subtittel: 'Subtitle top',
    tittel: 'Card title',
    beskrivelse: 'Most provide as with carried business are much better more the perfected designer. Writing slightly explain desk unable at supposedly about this',
    bildeSrc: '/images/8e25fd9d-f245-434d-87f5-a15ffcd09fc9.png',
  },
  {
    id: '2',
    subtittel: 'Subtitle top',
    tittel: 'Card title',
    beskrivelse: 'Most provide as with carried business are much better more the perfected designer. Writing slightly explain desk unable at supposedly about this',
    bildeSrc: '/images/ba7aa2ee-bef2-4156-8589-44d097ed683c.png',
  },
];

export const mockTjenester: TjenesteKategori[] = [
  {
    kategori: 'Administrasjon',
    tjenester: [
      { navn: 'Korsveien', url: 'https://korsveien.rodekors.no', beskrivelse: 'Intranett / Sharepoint / Office 360.' },
    ],
  },
  {
    kategori: 'Planlegging og rapportering',
    tjenester: [
      { navn: 'Kova', url: 'https://kova.rodekors.no', beskrivelse: 'Vaktplanlegging og påmelding.' },
      { navn: 'ID-kort for Hjelpekorpset', url: 'https://rodekors.no', beskrivelse: 'Bestilling av ID-kort.' },
      { navn: 'Bestill reise', url: 'https://rodekors.no', beskrivelse: 'Informasjon om bestilling av reiser som frivillig.' },
    ],
  },
  {
    kategori: 'Varsling',
    tjenester: [
      { navn: 'Varsling av kritikkverdige forhold', url: 'https://rodekors.no', beskrivelse: 'Meld forhold som anses som uetiske, skadelige, eller i strid med forskrifter.' },
    ],
  },
  {
    kategori: 'Kurs og læring',
    tjenester: [
      { navn: 'E-læring (Didac)', url: 'https://didac.rodekors.no', beskrivelse: 'E-læringsplattform for opplæring innen førstehjelp, beredskap og andre ferdigheter.' },
      { navn: 'Ressurssystemet', url: 'https://rodekors.no', beskrivelse: 'Kursadministrasjon og påmelding.' },
    ],
  },
];
