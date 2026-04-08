import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { vakt } from '@/lib/vakt-client';
import type { Rolle } from '@/types';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const res = await vakt.roles();

    const roller: Rolle[] = res.data.map((r) => ({
      id: r.id,
      tittel: r.name,
      status: 'Pågående',
      statusColor: 'success',
      forening: 'Oslo Røde Kors',
      startdato: '',
      sluttdato: 'pågående',
    }));

    return NextResponse.json(roller);
  } catch {
    const { mockRoller } = await import('@/data/mockEngagement');
    return NextResponse.json(mockRoller);
  }
}
