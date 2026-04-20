import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { getSession } from '@/lib/auth';
import { getUserByOktaId } from '@/lib/vakt-client';
import type { UserProfile } from '@/types';

const PLACEHOLDER = 'Ikke registrert';

function deriveInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((n) => n[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;

  const session = await getSession();
  const oktaId = session?.user?.id;
  const oktaName = session?.user?.name ?? '';
  const oktaEmail = session?.user?.email ?? '';

  // Shape when logged in but no Vakt match: Okta identity + placeholders for
  // structured fields the Vakt API doesn't expose yet (birthdate, address, forening).
  const baseProfile: UserProfile = {
    id: oktaId ?? '',
    name: oktaName || PLACEHOLDER,
    avatarInitial: oktaName ? deriveInitials(oktaName) : '',
    rkEmail: PLACEHOLDER,
    email: oktaEmail || PLACEHOLDER,
    rkNr: PLACEHOLDER,
    phone: PLACEHOLDER,
    birthDate: PLACEHOLDER,
    address: PLACEHOLDER,
    forening: PLACEHOLDER,
  };

  if (!oktaId) return NextResponse.json(baseProfile);

  try {
    const vaktUser = await getUserByOktaId(oktaId);
    if (!vaktUser) return NextResponse.json(baseProfile);

    const fullName = `${vaktUser.first_name} ${vaktUser.last_name}`.trim();
    const initials = `${vaktUser.first_name[0] ?? ''}${vaktUser.last_name[0] ?? ''}`.toUpperCase();

    const profile: UserProfile = {
      id: vaktUser.id,
      name: fullName || baseProfile.name,
      avatarInitial: initials || baseProfile.avatarInitial,
      rkEmail: vaktUser.username || PLACEHOLDER,
      email: vaktUser.email || oktaEmail || PLACEHOLDER,
      rkNr: vaktUser.relation_number || PLACEHOLDER,
      phone: vaktUser.phone_number || PLACEHOLDER,
      // Not exposed by Vakt API yet — shown as placeholder until backend extends scope
      birthDate: PLACEHOLDER,
      address: PLACEHOLDER,
      forening: PLACEHOLDER,
    };

    return NextResponse.json(profile);
  } catch {
    return NextResponse.json(baseProfile);
  }
}
