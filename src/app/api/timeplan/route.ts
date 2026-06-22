import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { getRecentShiftBlocks } from '@/lib/vakt-client';
import type { TimeplanEvent } from '@/types';

const DAGER = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'];
const MAANEDER = ['JAN', 'FEB', 'MAR', 'APR', 'MAI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DES'];

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;

  try {
    const blocks = (await getRecentShiftBlocks()).filter((sb) => sb.start_at);

    // Prefer upcoming shifts (ascending); if none are in the future, fall back
    // to the most recent ones (descending).
    const now = Date.now();
    const upcoming = blocks
      .filter((sb) => new Date(sb.start_at).getTime() >= now)
      .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());
    const recent = [...blocks].sort(
      (a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime(),
    );
    const sorted = (upcoming.length ? upcoming : recent).slice(0, 20);

    const events: TimeplanEvent[] = sorted.map((sb) => {
      const start = new Date(sb.start_at);
      const end = new Date(sb.end_at);

      return {
        id: sb.id,
        dag: DAGER[start.getDay()],
        dato: start.getDate(),
        maaned: MAANEDER[start.getMonth()],
        tittel: sb.title,
        startTid: start.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' }),
        sluttTid: end.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' }),
        type: 'vakt',
        typeLabel: 'Vakt',
        frist: '',
        tattePlasser: 0,
        totalePlasser: 0,
        status: 'Åpent for påmelding',
      };
    });

    return NextResponse.json(events);
  } catch {
    const { mockEvents } = await import('@/data/mockTimeplan');
    return NextResponse.json(mockEvents);
  }
}
