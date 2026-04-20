import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { getSession } from '@/lib/auth';
import { getUserByOktaId } from '@/lib/vakt-client';
import { mockUser } from '@/data/mockUser';
import type { UserProfile } from '@/types';

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;

  const session = await getSession();
  const oktaId = session?.user?.id;

  if (!oktaId) return NextResponse.json(mockUser);

  const oktaName = session?.user?.name || mockUser.name;
  const oktaEmail = session?.user?.email || mockUser.email;
  const oktaInitials = oktaName
    .split(/\s+/)
    .map((n) => n[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const oktaFallback = {
    ...mockUser,
    id: oktaId,
    name: oktaName,
    email: oktaEmail,
    avatarInitial: oktaInitials || mockUser.avatarInitial,
  };

  try {
    const vaktUser = await getUserByOktaId(oktaId);
    if (!vaktUser) return NextResponse.json(oktaFallback);

    const fullName = `${vaktUser.first_name} ${vaktUser.last_name}`.trim();
    const initials = `${vaktUser.first_name[0] ?? ''}${vaktUser.last_name[0] ?? ''}`.toUpperCase();

    // Fields Vakt /users doesn't expose yet — keep mock fallback until dev extends scope
    const profile: UserProfile = {
      id: vaktUser.id,
      name: fullName || mockUser.name,
      rkEmail: vaktUser.username || mockUser.rkEmail,
      email: vaktUser.email || mockUser.email,
      rkNr: vaktUser.relation_number || mockUser.rkNr,
      phone: vaktUser.phone_number || mockUser.phone,
      avatarInitial: initials || mockUser.avatarInitial,
      birthDate: mockUser.birthDate,
      address: mockUser.address,
      forening: mockUser.forening,
    };

    return NextResponse.json(profile);
  } catch {
    return NextResponse.json(oktaFallback);
  }
}
