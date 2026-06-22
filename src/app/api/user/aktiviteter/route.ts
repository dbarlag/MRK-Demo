import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { vakt } from '@/lib/vakt-client';
import type { Aktivitet } from '@/types';

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;

  try {
    // The single top-level activity ("Fellesverket") is too coarse to show as a
    // list, so we surface the concrete subactivities (Leksehjelp, Møteplass, …)
    // — these are what a volunteer actually engages in. archived_at === null
    // marks the still-active ones.
    const res = await vakt.subactivities({ per_page: '250' });

    const aktiviteter: Aktivitet[] = res.data
      .filter((s) => s.archived_at === null)
      .map((s) => ({
        id: s.id,
        tittel: s.name,
        status: 'Pågående',
        statusColor: 'success',
        forening: 'Oslo Røde Kors',
        startdato: new Date(s.created_at).toLocaleDateString('nb-NO'),
        sluttdato: 'pågående',
      }));

    return NextResponse.json(aktiviteter);
  } catch {
    const { mockAktiviteter } = await import('@/data/mockEngagement');
    return NextResponse.json(mockAktiviteter);
  }
}
