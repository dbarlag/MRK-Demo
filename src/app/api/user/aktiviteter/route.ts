import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { vakt } from '@/lib/vakt-client';
import type { Aktivitet } from '@/types';

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;

  try {
    // Oslo district id (the only district in the Vakt `main` dataset today).
    const res = await vakt.activities({ district_id: 'cb3462c0-4ed8-4b86-a66d-a1459bbaf61f' });

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
