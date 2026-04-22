'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Card, CardBlock, Divider, Heading, Paragraph } from 'rk-designsystem';
import { PersonIcon, CalendarIcon, MegaphoneSpeakingIcon, BookIcon, ChevronRightIcon, ExternalLinkIcon } from '@navikt/aksel-icons';
import SiteHeader from '../shared/SiteHeader';
import LoadingSpinner from '../shared/LoadingSpinner';
import { assetPath } from '@/lib/basePath';
import { fetchProfile } from '@/lib/api';
import type { UserProfile } from '@/types';
import styles from './HomePage.module.css';

export default function HomePage() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchProfile().then(setUser).catch(console.error);
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
                <ExternalLinkIcon aria-hidden="true" style={{ width: '1em', height: '1em' }} />
              </Button>
            </div>
          </div>
        </section>

        {/* Quick nav cards */}
        <section className={styles['section-link']}>
          <div className={styles['nav-links-row']}>
            <Link href="/profil" className={styles.link}>
              <div className={styles.icon}>
                <PersonIcon aria-hidden="true" className={styles.person} />
              </div>
              <div className={styles.body}>
                <div className={styles['text-full-width']}>
                  <Heading data-size="sm" level={3} data-color="secondary-color-orange" className={styles['nav-link-heading']}>Min side</Heading>
                </div>
                <div className={styles['text-full-width']}>
                  <Paragraph data-size="sm" variant="default" className={styles['nav-link-text']}>Opplysninger om deg</Paragraph>
                </div>
              </div>
              <ChevronRightIcon aria-hidden="true" className={styles.iconbutton} />
            </Link>
            <Link href="/timeplan" className={styles.link}>
              <div className={styles.icon}>
                <CalendarIcon aria-hidden="true" className={styles.person} />
              </div>
              <div className={styles.body}>
                <div className={styles['text-full-width']}>
                  <Heading data-size="sm" level={3} data-color="secondary-color-orange" className={styles['nav-link-heading']}>Min timeplan</Heading>
                </div>
                <div className={styles['text-full-width']}>
                  <Paragraph data-size="sm" variant="default" className={styles['nav-link-text']}>Din timeplan og vakter</Paragraph>
                </div>
              </div>
              <ChevronRightIcon aria-hidden="true" className={styles.iconbutton} />
            </Link>
          </div>
          <div className={styles['nav-links-row']}>
            <a href="#nyttig" className={styles.link}>
              <div className={styles.icon}>
                <MegaphoneSpeakingIcon aria-hidden="true" className={styles.person} />
              </div>
              <div className={styles.body}>
                <div className={styles['text-full-width']}>
                  <Heading data-size="sm" level={3} data-color="secondary-color-orange" className={styles['nav-link-heading']}>Nyttig</Heading>
                </div>
                <div className={styles['text-full-width']}>
                  <Paragraph data-size="sm" variant="default" className={styles['nav-link-text']}>Nyttig informasjon</Paragraph>
                </div>
              </div>
              <ChevronRightIcon aria-hidden="true" className={styles.iconbutton} />
            </a>
            <a href="#tjenester" className={styles.link}>
              <div className={styles.icon}>
                <BookIcon aria-hidden="true" className={styles.person} />
              </div>
              <div className={styles.body}>
                <div className={styles['text-full-width']}>
                  <Heading data-size="sm" level={3} data-color="secondary-color-orange" className={styles['nav-link-heading']}>Læring</Heading>
                </div>
                <div className={styles['text-full-width']}>
                  <Paragraph data-size="sm" variant="default" className={styles['nav-link-text']}>Kurs og opplæring</Paragraph>
                </div>
              </div>
              <ChevronRightIcon aria-hidden="true" className={styles.iconbutton} />
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
            <div className={styles['card-col']}>
              <Card variant="default" data-color="neutral" className={styles['nyttig-card']}>
                <img src={assetPath('/images/8e25fd9d-f245-434d-87f5-a15ffcd09fc9.png')} alt="" className={styles.image} />
                <CardBlock>
                  <div className={styles.container}>
                    <div className={styles.header}>
                      <div className={styles.content}>
                        <div className={styles['header-and-subtitle']}>
                          <div className={styles['text-full-width']}>
                            <Paragraph data-size="sm" variant="default">Subtitle top</Paragraph>
                          </div>
                          <header className={styles['header-container']}>
                            <div className={styles['card-text-fill']}>
                              <Heading data-size="md" level={3} className={styles['card-title']}>Card title</Heading>
                            </div>
                          </header>
                        </div>
                      </div>
                    </div>
                    <div className={styles['card-body']}>
                      <div className={styles['text-full-width']}>
                        <Paragraph data-size="md" variant="default">Most provide as with carried business are much better more the perfected designer. Writing slightly explain desk unable at supposedly about this</Paragraph>
                      </div>
                    </div>
                  </div>
                </CardBlock>
              </Card>
            </div>
            <div className={styles['card-col']}>
              <Card variant="default" data-color="neutral" className={styles['nyttig-card']}>
                <img src={assetPath('/images/ba7aa2ee-bef2-4156-8589-44d097ed683c.png')} alt="" className={styles.image} />
                <CardBlock>
                  <div className={styles.container}>
                    <div className={styles.header}>
                      <div className={styles.content}>
                        <div className={styles['header-and-subtitle']}>
                          <div className={styles['text-full-width']}>
                            <Paragraph data-size="sm" variant="default">Subtitle top</Paragraph>
                          </div>
                          <header className={styles['header-container']}>
                            <div className={styles['card-text-fill']}>
                              <Heading data-size="md" level={3} className={styles['card-title']}>Card title</Heading>
                            </div>
                          </header>
                        </div>
                      </div>
                    </div>
                    <div className={styles['card-body']}>
                      <div className={styles['text-full-width']}>
                        <Paragraph data-size="md" variant="default">Most provide as with carried business are much better more the perfected designer. Writing slightly explain desk unable at supposedly about this</Paragraph>
                      </div>
                    </div>
                  </div>
                </CardBlock>
              </Card>
            </div>
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
            <article className={styles['service-card']}>
              <div className={styles['service-groups-col']}>
                <div className={styles['service-group']}>
                  <p className={styles['service-category-title']}>Administrasjon</p>
                  <div>
                    <a href="https://korsveien.rodekors.no" target="_blank" rel="noopener noreferrer" className={styles['external-link-row']} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                      <p className={styles['service-link-underlined']}>Korsveien</p>
                      <ExternalLinkIcon aria-hidden="true" className={styles['external-link-icon']} />
                    </a>
                    <div className={styles['service-desc-wrapper']}>
                      <p className={styles['service-desc-text']}>Intranett / Sharepoint / Office 360.</p>
                    </div>
                  </div>
                </div>
                <div className={styles['service-group']}>
                  <p className={styles['service-category-title']}>Planlegging og rapportering</p>
                  <div>
                    <a href="https://kova.rodekors.no" target="_blank" rel="noopener noreferrer" className={styles['external-link-row']} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                      <p className={styles['service-link-underlined']}>Kova</p>
                      <ExternalLinkIcon aria-hidden="true" className={styles['external-link-icon']} />
                    </a>
                    <div className={styles['service-desc-wrapper']}>
                      <p className={styles['service-desc-text']}>Vaktplanlegging og påmelding.</p>
                    </div>
                  </div>
                  <div>
                    <a href="https://rodekors.no" target="_blank" rel="noopener noreferrer" className={styles['external-link-row']} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                      <p className={styles['service-link-underlined']}>ID-kort for Hjelpekorpset</p>
                      <ExternalLinkIcon aria-hidden="true" className={styles['external-link-icon']} />
                    </a>
                    <div className={styles['service-desc-wrapper']}>
                      <p className={styles['service-desc-text']}>Bestilling av ID-kort.</p>
                    </div>
                  </div>
                  <div>
                    <a href="https://rodekors.no" target="_blank" rel="noopener noreferrer" className={styles['external-link-row']} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                      <p className={styles['service-link-underlined']}>Bestill reise</p>
                      <ExternalLinkIcon aria-hidden="true" className={styles['external-link-icon']} />
                    </a>
                    <div className={styles['service-desc-wrapper']}>
                      <p className={styles['service-desc-text']}>Informasjon om bestilling av reiser som frivillig.</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
            <article className={styles['service-card']}>
              <div className={styles['service-groups-col']}>
                <div className={styles['service-group']}>
                  <p className={styles['service-category-title']}>Varsling</p>
                  <div>
                    <a href="https://rodekors.no" target="_blank" rel="noopener noreferrer" className={styles['external-link-row']} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                      <p className={styles['service-link-underlined']}>Varsling av kritikkverdige forhold</p>
                      <ExternalLinkIcon aria-hidden="true" className={styles['external-link-icon']} />
                    </a>
                    <div className={styles['service-desc-wrapper']}>
                      <p className={styles['service-desc-text']}>Meld forhold som anses som uetiske, skadelige, eller i strid med forskrifter.</p>
                    </div>
                  </div>
                </div>
                <div className={styles['service-group']}>
                  <p className={styles['service-category-title']}>Kurs og læring</p>
                  <div>
                    <a href="https://didac.rodekors.no" target="_blank" rel="noopener noreferrer" className={styles['external-link-row']} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                      <p className={styles['service-link-underlined']}>E-læring (Didac)</p>
                      <ExternalLinkIcon aria-hidden="true" className={styles['external-link-icon']} />
                    </a>
                    <div className={styles['service-desc-wrapper']}>
                      <p className={styles['service-desc-text']}>E-læringsplattform for opplæring innen førstehjelp, beredskap og andre ferdigheter.</p>
                    </div>
                  </div>
                  <div>
                    <a href="https://rodekors.no" target="_blank" rel="noopener noreferrer" className={styles['external-link-row']} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                      <p className={styles['service-link-underlined']}>Ressurssystemet</p>
                      <ExternalLinkIcon aria-hidden="true" className={styles['external-link-icon']} />
                    </a>
                    <div className={styles['service-desc-wrapper']}>
                      <p className={styles['service-desc-text']}>Kursadministrasjon og påmelding.</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </section>
        </section>
      </div>
    </div>
  );
}
