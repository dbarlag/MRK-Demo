'use client';

import { useSession, signOut } from 'next-auth/react';
import { assetPath } from '@/lib/basePath';
import { Header, Avatar } from 'rk-designsystem';
import { LeaveIcon } from '@navikt/aksel-icons';

const NAV_ITEMS = [
  { label: 'Min timeplan', href: '/timeplan' },
  { label: 'Min side', href: '/profil' },
  { label: 'Nyttig', href: '/nyttig' },
  { label: 'Læring', href: '/laering' },
];

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((n) => n[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

interface SiteHeaderProps {
  secondaryLogoSrc?: string;
}

export default function SiteHeader({ secondaryLogoSrc = assetPath('/images/28cee95e-f238-4c62-8519-15bcf9175329.png') }: SiteHeaderProps) {
  const { data: session } = useSession();
  const name = session?.user?.name ?? '';
  const initials = name ? getInitials(name) : '';

  return (
    <div style={{ position: 'relative' }}>
      <Header
        data-color="primary"
        extensionColor="tinted"
        showHeaderExtension
        showThemeToggle
        showModeToggle
        showLanguageSwitch
        showMenuButton={false}
        showSearch={false}
        showLogin={false}
        showUser={false}
        showCta={false}
        secondaryLogo
        showNavItems
        navItems={NAV_ITEMS}
        secondaryLogoSrc={secondaryLogoSrc}
      />
      {session && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: 'white',
            fontSize: '14px',
            zIndex: 10,
          }}
        >
          {name && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{name}</span>
              <Avatar aria-label={name} data-color="main" variant="circle" initials={initials} />
            </div>
          )}
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '4px 8px',
              borderRadius: '4px',
            }}
            title="Logg ut"
          >
            <LeaveIcon aria-hidden="true" style={{ width: '1.2em', height: '1.2em' }} />
            Logg ut
          </button>
        </div>
      )}
    </div>
  );
}
