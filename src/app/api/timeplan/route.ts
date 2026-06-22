import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { getRecentShiftBlocks } from '@/lib/vakt-client';
import type { TimeplanEvent } from '@/types';

const DAGER = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'];
const MAANEDER = ['JAN', 'FEB', 'MAR', 'APR', 'MAI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DES'];

/** ISO-8601 week number (1-53), Monday-based. */
function isoWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = (d.getUTCDay() + 6) % 7; // Mon=0 … Sun=6
  d.setUTCDate(d.getUTCDate() - dayNum + 3); // nearest Thursday
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const firstDayNum = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNum + 3);
  return 1 + Math.round((d.getTime() - firstThursday.getTime()) / (7 * 24 * 3600 * 1000));
}

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
        uke: isoWeek(start),
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
