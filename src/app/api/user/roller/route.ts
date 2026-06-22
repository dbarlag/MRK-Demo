import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { getSession } from '@/lib/auth';
import { getUserByOktaId, getUserShifts, getRolesMap } from '@/lib/vakt-client';
import type { Rolle } from '@/types';

// Vakt returns role names in English; show them in Norwegian where we know them.
const ROLE_LABEL_NB: Record<string, string> = {
  Administrator: 'Administrator',
  'Group leader': 'Gruppeleder',
  Volunteer: 'Frivillig',
  Trainee: 'Lærling',
};

function formatDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('nb-NO');
}

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;

  try {
    const session = await getSession();
    const oktaId = session?.user?.id;
    if (!oktaId) throw new Error('no okta id');

    const vaktUser = await getUserByOktaId(oktaId);
    if (!vaktUser) throw new Error('user not found in Vakt');

    const [shifts, rolesMap] = await Promise.all([
      getUserShifts(vaktUser.id),
      getRolesMap(),
    ]);

    // Distinct roles the user holds, with the earliest sign-up date per role.
    const earliestByRole = new Map<string, string | null>();
    for (const s of shifts) {
      const roleId = s.user_role_id;
      if (!roleId) continue;
      const current = earliestByRole.get(roleId);
      if (current === undefined) {
        earliestByRole.set(roleId, s.signed_up_at);
      } else if (s.signed_up_at && (!current || s.signed_up_at < current)) {
        earliestByRole.set(roleId, s.signed_up_at);
      }
    }

    if (earliestByRole.size === 0) throw new Error('no roles on user shifts');

    const roller: Rolle[] = [...earliestByRole.entries()].map(([roleId, since]) => {
      const rawName = rolesMap[roleId] ?? 'Ukjent rolle';
      return {
        id: roleId,
        tittel: ROLE_LABEL_NB[rawName] ?? rawName,
        status: 'Pågående',
        statusColor: 'success',
        forening: 'Oslo Røde Kors',
        startdato: formatDate(since),
        sluttdato: 'pågående',
      };
    });

    return NextResponse.json(roller);
  } catch {
    const { mockRoller } = await import('@/data/mockEngagement');
    return NextResponse.json(mockRoller);
  }
}
