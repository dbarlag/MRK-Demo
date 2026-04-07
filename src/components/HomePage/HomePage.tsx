'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Card, CardBlock, Divider, Heading, Paragraph } from 'rk-designsystem';
import SiteHeader from '../shared/SiteHeader';
import { fetchProfile, fetchDashboard } from '@/lib/api';
import type { UserProfile, NyttigKort, TjenesteKategori } from '@/types';
import styles from './HomePage.module.css';

export default function HomePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [nyttig, setNyttig] = useState<NyttigKort[]>([]);
  const [tjenester, setTjenester] = useState<TjenesteKategori[]>([]);

  useEffect(() => {
    fetchProfile().then(setUser);
    fetchDashboard().then((data) => {
      setNyttig(data.nyttig);
      setTjenester(data.tjenester);
    });
  }, []);

  return (
    <div className={styles.home}>
      <div className={styles.wrapper}>
        <SiteHeader />
      </div>
      <div className={styles['main-content']}>
        <section className={styles.top}>
          <div className={styles['greeting-wrapper']}>
            <Heading data-size="2xl" level={1} className={styles['greeting-heading']}>
              {user ? `Hei ${user.name}` : 'Hei'}
            </Heading>
          </div>
        </section>

        <section className={styles['section-welcome']}>
          <div className={styles['text-full-width']}>
            <Heading data-size="sm" level={3} className={styles['welcome-heading']}>Velkommen til Mitt Røde Kors</Heading>
          </div>
          <div className={styles['text-full-width']}>
            <Paragraph data-size="sm" variant="default">
              Her vil du etter hvert finne alt du trenger for å være frivillig i Røde Kors. Tjenestene er under utvikling og vi jobber kontinuerlig med å lage nytt og forbedret innhold for våre frivillige.
              <br /><br />
              Har du lyst til å hjelpe oss med å forbedre Mitt Røde Kors? Gi oss gjerne en tilbakemelding om hva du synes om tjenesten.
            </Paragraph>
          </div>
          <div className={styles['actions-right']}>
            <div className={styles['btn-wrapper']}>
              <Button
                loading={false}
                showIconRight
                showIconLeft={false}
                variant="secondary"
                data-color="primary"
                className={styles['feedback-btn']}
                onClick={() => window.open('https://rodekors.no/tilbakemelding', '_blank')}
              >
                Gi tilbakemelding
                <img src="/images/a140560f-1c59-4564-ae0d-43206ee17ad4.png" alt="" className="btn-icon" />
              </Button>
            </div>
          </div>
        </section>

        {/* Quick nav cards */}
        <section className={styles['section-link']}>
          <div className={styles['nav-links-row']}>
            <Link href="/profil" className={styles.link}>
              <div className={styles.icon}>
                <img src="/images/dcaf353a-1b79-4e14-a7b9-5d495e87dc4b.png" alt="" className={styles.person} />
              </div>
              <div className={styles.body}>
                <div className={styles['text-full-width']}>
                  <Heading data-size="sm" level={3} data-color="secondary-color-orange" className={styles['nav-link-heading']}>Min side</Heading>
                </div>
                <div className={styles['text-full-width']}>
                  <Paragraph data-size="sm" variant="default" className={styles['nav-link-text']}>Opplysninger om deg</Paragraph>
                </div>
              </div>
              <img src="/images/e713192d-31c7-4f23-896a-cf7ea5a55b39.png" alt="" className={styles.iconbutton} />
            </Link>
            <Link href="/timeplan" className={styles.link}>
              <div className={styles.icon}>
                <img src="/images/d7feaedb-62f8-4620-b658-25ab4a8b0b13.png" alt="" className={styles.person} />
              </div>
              <div className={styles.body}>
                <div className={styles['text-full-width']}>
                  <Heading data-size="sm" level={3} data-color="secondary-color-orange" className={styles['nav-link-heading']}>Min timeplan</Heading>
                </div>
                <div className={styles['text-full-width']}>
                  <Paragraph data-size="sm" variant="default" className={styles['nav-link-text']}>Din timeplan og vakter</Paragraph>
                </div>
              </div>
              <img src="/images/fb13b320-891d-404c-b50a-6df0238c774b.png" alt="" className={styles.iconbutton} />
            </Link>
          </div>
          <div className={styles['nav-links-row']}>
            <a href="#nyttig" className={styles.link}>
              <div className={styles.icon}>
                <img src="/images/3b7ad995-9411-4ac2-90ab-dd4d52df78a3.png" alt="" className={styles.person} />
              </div>
              <div className={styles.body}>
                <div className={styles['text-full-width']}>
                  <Heading data-size="sm" level={3} data-color="secondary-color-orange" className={styles['nav-link-heading']}>Nyttig</Heading>
                </div>
                <div className={styles['text-full-width']}>
                  <Paragraph data-size="sm" variant="default" className={styles['nav-link-text']}>Nyttig informasjon</Paragraph>
                </div>
              </div>
              <img src="/images/8cf2a926-b234-46e9-a171-224741195def.png" alt="" className={styles.iconbutton} />
            </a>
            <a href="#tjenester" className={styles.link}>
              <div className={styles.icon}>
                <img src="/images/f7922170-ec4e-4ded-8606-2577d2cb8b0c.png" alt="" className={styles.person} />
              </div>
              <div className={styles.body}>
                <div className={styles['text-full-width']}>
                  <Heading data-size="sm" level={3} data-color="secondary-color-orange" className={styles['nav-link-heading']}>Læring</Heading>
                </div>
                <div className={styles['text-full-width']}>
                  <Paragraph data-size="sm" variant="default" className={styles['nav-link-text']}>Kurs og opplæring</Paragraph>
                </div>
              </div>
              <img src="/images/da6416c7-2628-4db6-b5d5-e338119a6bd9.png" alt="" className={styles.iconbutton} />
            </a>
          </div>
        </section>

        {/* Nyttig */}
        <section id="nyttig" className={styles['section-nyttig']}>
          <div className={styles['section-header']}>
            <div className={styles['section-title-wrapper']}>
              <Heading data-size="sm" level={4} className={styles['section-title']}>Nyttig</Heading>
            </div>
            <div className={styles['divider-wrapper']}>
              <Divider />
            </div>
          </div>
          <div className={styles['cards-row']}>
            {nyttig.map((kort) => (
              <div key={kort.id} className={styles['card-col']} style={{ cursor: 'pointer' }} onClick={() => alert(`Åpner: ${kort.tittel}`)}>
                <Card variant="default" data-color="neutral" className={styles['nyttig-card']}>
                  <img src={kort.bildeSrc} alt="" className={styles.image} />
                  <CardBlock>
                    <div className={styles.container}>
                      <div className={styles.header}>
                        <div className={styles.content}>
                          <div className={styles['header-and-subtitle']}>
                            <div className={styles['text-full-width']}>
                              <Paragraph data-size="sm" variant="default">{kort.subtittel}</Paragraph>
                            </div>
                            <header className={styles['header-container']}>
                              <div className={styles['card-text-fill']}>
                                <Heading data-size="md" level={3} className={styles['card-title']}>{kort.tittel}</Heading>
                              </div>
                            </header>
                          </div>
                        </div>
                      </div>
                      <div className={styles['card-body']}>
                        <div className={styles['text-full-width']}>
                          <Paragraph data-size="md" variant="default">{kort.beskrivelse}</Paragraph>
                        </div>
                      </div>
                    </div>
                  </CardBlock>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* Andre tjenester */}
        <section id="tjenester" className={styles['section-nyttig']}>
          <div className={styles['section-header']}>
            <div className={styles['section-title-wrapper']}>
              <Heading data-size="sm" level={4} className={styles['section-title']}>Andre tjenester</Heading>
            </div>
            <div className={styles['divider-wrapper']}>
              <Divider />
            </div>
          </div>
          <section className={styles['cards-row']}>
            {Array.from({ length: Math.ceil(tjenester.length / 2) }, (_, i) => (
              <article key={i} className={styles['service-card']}>
                <div className={styles['service-groups-col']}>
                  {tjenester.slice(i * 2, i * 2 + 2).map((kat) => (
                    <div key={kat.kategori} className={styles['service-group']}>
                      <p className={styles['service-category-title']}>{kat.kategori}</p>
                      {kat.tjenester.map((t) => (
                        <div key={t.navn}>
                          <a
                            href={t.url || '#'}
                            target={t.url ? '_blank' : undefined}
                            rel={t.url ? 'noopener noreferrer' : undefined}
                            className={styles['external-link-row']}
                            style={{ textDecoration: 'none', cursor: 'pointer' }}
                          >
                            <p className={styles['service-link-underlined']}>{t.navn}</p>
                            <img src="/images/f25a1ea0-53ca-4d44-a192-3aafbd0fd429.png" alt="Ekstern lenke" className={styles['external-link-icon']} />
                          </a>
                          <div className={styles['service-desc-wrapper']}>
                            <p className={styles['service-desc-text']}>{t.beskrivelse}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </section>
        </section>
      </div>
    </div>
  );
}
