import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { vakt } from '@/lib/vakt-client';
import type { Aktivitet } from '@/types';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const res = await vakt.activities({ district_id: '87ca20f5-fa22-4969-b9c9-55ca6c813b7b' });

    const aktiviteter: Aktivitet[] = res.data
      .filter((a) => a.active === 1)
      .map((a) => ({
        id: a.id,
        tittel: a.name,
        status: 'Pågående',
        statusColor: 'success',
        forening: 'Oslo Røde Kors',
        startdato: new Date(a.created_at).toLocaleDateString('nb-NO'),
        sluttdato: 'pågående',
      }));

    return NextResponse.json(aktiviteter);
  } catch {
    const { mockAktiviteter } = await import('@/data/mockEngagement');
    return NextResponse.json(mockAktiviteter);
  }
}
