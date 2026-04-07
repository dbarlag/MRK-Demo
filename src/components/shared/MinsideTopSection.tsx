'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Heading, Tabs } from 'rk-designsystem';
import { ArrowLeftIcon, PersonIcon, HandShakeHeartIcon, BookIcon } from '@navikt/aksel-icons';

interface MinsideTopSectionProps {
  activeTab: 'profil' | 'engasjement' | 'kompetanse';
  styles: Record<string, string>;
}

const TAB_ROUTES: Record<string, string> = {
  profil: '/profil',
  engasjement: '/engasjement',
  kompetanse: '/kompetanse',
};

export default function MinsideTopSection({ activeTab, styles }: MinsideTopSectionProps) {
  const router = useRouter();

  const handleTabChange = (value: string) => {
    const route = TAB_ROUTES[value];
    if (route && value !== activeTab) {
      router.push(route);
    }
  };

  return (
    <>
      <div className={styles['page-top']}>
        <div className={styles['btn-wrapper']}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Button loading={false} showIconRight={false} showIconLeft variant="tertiary" data-color="neutral" className={styles['back-btn']}>
              <ArrowLeftIcon aria-hidden="true" style={{ width: '1em', height: '1em' }} />
              Tilbake
            </Button>
          </Link>
        </div>
        <div className={styles.top}>
          <div className={styles['heading-fill']}>
            <Heading data-size="lg" level={2} className={styles['page-heading']}>Min side</Heading>
          </div>
        </div>
      </div>
      <div className={styles['tabs-wrapper']}>
        <Tabs data-color="primary" value={activeTab} onChange={handleTabChange}>
          <Tabs.List>
            <Tabs.Tab value="profil">
              <PersonIcon aria-hidden="true" style={{ width: '1.2em', height: '1.2em', verticalAlign: 'middle', marginRight: '0.4em' }} />
              Profil
            </Tabs.Tab>
            <Tabs.Tab value="engasjement">
              <HandShakeHeartIcon aria-hidden="true" style={{ width: '1.2em', height: '1.2em', verticalAlign: 'middle', marginRight: '0.4em' }} />
              Engasjement
            </Tabs.Tab>
            <Tabs.Tab value="kompetanse">
              <BookIcon aria-hidden="true" style={{ width: '1.2em', height: '1.2em', verticalAlign: 'middle', marginRight: '0.4em' }} />
              Kompetanse
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </div>
    </>
  );
}
