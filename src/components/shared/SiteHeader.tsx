'use client';

import { useSession } from 'next-auth/react';
import { assetPath } from '@/lib/basePath';
import { Header } from 'rk-designsystem';

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
      showUser={Boolean(session)}
      showCta={false}
      secondaryLogo
      showNavItems
      navItems={NAV_ITEMS}
      secondaryLogoSrc={secondaryLogoSrc}
      userName={session?.user?.name || undefined}
    />
  );
}
