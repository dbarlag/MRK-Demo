'use client';

import { useSession, signOut } from 'next-auth/react';
import { assetPath } from '@/lib/basePath';
import { Header } from 'rk-designsystem';
import { LeaveIcon } from '@navikt/aksel-icons';

const NAV_ITEMS = [
  { label: 'Min timeplan', href: '/timeplan' },
  { label: 'Min side', href: '/profil' },
  { label: 'Nyttig', href: '/nyttig' },
  { label: 'Læring', href: '/laering' },
];

interface SiteHeaderProps {
  secondaryLogoSrc?: string;
}

export default function SiteHeader({ secondaryLogoSrc = assetPath('/images/28cee95e-f238-4c62-8519-15bcf9175329.png') }: SiteHeaderProps) {
  const { data: session } = useSession();

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
        showUser
        showCta={false}
        secondaryLogo
        showNavItems
        navItems={NAV_ITEMS}
        secondaryLogoSrc={secondaryLogoSrc}
      />
      {session && (
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          style={{
            position: 'absolute',
            top: '12px',
            right: '16px',
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
            zIndex: 10,
          }}
          title="Logg ut"
        >
          <LeaveIcon aria-hidden="true" style={{ width: '1.2em', height: '1.2em' }} />
          Logg ut
        </button>
      )}
    </div>
  );
}
