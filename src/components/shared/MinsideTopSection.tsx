'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Heading, Tabs } from 'rk-designsystem';

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
              <img src="/images/13fca71f-16c5-4b74-ac1f-afc54143b162.png" alt="" className="btn-icon" />
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
              <img src="/images/45e2ef49-f9a8-4ae7-9a75-ed57973e4c71.png" alt="" className="tab-icon" />
              Profil
            </Tabs.Tab>
            <Tabs.Tab value="engasjement">
              <img src="/images/9e6d9385-3f18-4bcd-96e1-e5d476de7b58.png" alt="" className="tab-icon" />
              Engasjement
            </Tabs.Tab>
            <Tabs.Tab value="kompetanse">
              <img src="/images/64e69874-5dc6-4236-8409-11eb55e64d92.png" alt="" className="tab-icon" />
              Kompetanse
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </div>
    </>
  );
}
