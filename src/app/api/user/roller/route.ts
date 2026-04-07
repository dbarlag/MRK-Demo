export const dynamic = "force-static";
import { NextResponse } from 'next/server';
import { vakt } from '@/lib/vakt-client';
import type { Rolle } from '@/types';

export async function GET() {
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
