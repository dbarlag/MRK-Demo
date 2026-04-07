// User & Profile
export interface UserProfile {
  id: string;
  name: string;
  birthDate: string;
  rkEmail: string;
  email: string;
  rkNr: string;
  phone: string;
  address: string;
  forening: string;
  avatarInitial: string;
}

export interface Parorende {
  id: string;
  navn: string;
  relasjon: string;
  telefon: string;
  epost: string;
}

export interface Erklering {
  id: string;
  type: 'etikk' | 'taushet' | 'politiattest';
  tittel: string;
  dato: string;
  status?: string;
  statusColor?: string;
}

// Engagement
export interface Medlemskap {
  tittel: string;
  status: string;
  statusColor: string;
  forening: string;
  startdato: string;
  sluttdato: string;
  type: string;
}

export interface Aktivitet {
  id: string;
  tittel: string;
  status: string;
  statusColor: string;
  forening: string;
  startdato: string;
  sluttdato: string;
  gruppe?: string;
}

export interface Rolle {
  id: string;
  tittel: string;
  status: string;
  statusColor: string;
  forening: string;
  aktivitet?: string;
  startdato: string;
  sluttdato: string;
  gruppe?: string;
}

export interface Verv {
  id: string;
  tittel: string;
  status: string;
  statusColor: string;
  forening: string;
  startdato: string;
  sluttdato: string;
}

// Competence
export interface Kurs {
  id: string;
  tittel: string;
  status: string;
  statusColor: string;
  forening: string;
  dato: string;
  type: string;
}

export interface Sprak {
  sprak: string;
  niva: string;
}

export interface Sertifikat {
  type: string;
  klasse: string;
}

// Timeplan
export interface TimeplanEvent {
  id: string;
  dag: string;
  dato: number;
  maaned: string;
  tittel: string;
  startTid: string;
  sluttTid: string;
  type: 'arrangement' | 'kurs' | 'vakt';
  typeLabel: string;
  frist: string;
  tattePlasser: number;
  totalePlasser: number;
  status: string;
}

// Dashboard
export interface NyttigKort {
  id: string;
  subtittel: string;
  tittel: string;
  beskrivelse: string;
  bildeSrc: string;
}

export interface EksternTjeneste {
  navn: string;
  url?: string;
  beskrivelse: string;
}

export interface TjenesteKategori {
  kategori: string;
  tjenester: EksternTjeneste[];
}
