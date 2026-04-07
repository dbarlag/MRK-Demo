'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Divider, Heading } from 'rk-designsystem';
import SiteHeader from '../shared/SiteHeader';
import MinsideTopSection from '../shared/MinsideTopSection';
import ActivityCard from '../shared/ActivityCard';
import { fetchMedlemskap, fetchAktiviteter, fetchRoller, fetchVerv } from '@/lib/api';
import type { Medlemskap, Aktivitet, Rolle, Verv } from '@/types';
import styles from './MinsideEngasjementPage.module.css';

function SectionHeader({ title }: { title: string }) {
  return (
    <div className={styles['section-top']}>
      <div className={styles['section-top-row']}>
        <div className={styles['section-title-wrapper']}>
          <Heading data-size="sm" level={4} className={styles['section-title']}>{title}</Heading>
        </div>
      </div>
      <div className={styles['tabs-wrapper']}>
        <Divider />
      </div>
    </div>
  );
}

export default function MinsideEngasjementPage() {
  const [medlemskap, setMedlemskap] = useState<Medlemskap | null>(null);
  const [aktiviteter, setAktiviteter] = useState<Aktivitet[]>([]);
  const [roller, setRoller] = useState<Rolle[]>([]);
  const [verv, setVerv] = useState<Verv[]>([]);

  const galleryRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  useEffect(() => {
    fetchMedlemskap().then(setMedlemskap);
    fetchAktiviteter().then(setAktiviteter);
    fetchRoller().then(setRoller);
    fetchVerv().then(setVerv);
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX;
    scrollStart.current = galleryRef.current?.scrollLeft ?? 0;
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !galleryRef.current) return;
    e.preventDefault();
    const dx = e.pageX - startX.current;
    galleryRef.current.scrollLeft = scrollStart.current - dx;
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <div className={styles['engasjement-page']}>
      <div className={styles.wrapper}>
        <SiteHeader />
      </div>
      <div className={styles['page-body']}>
        <MinsideTopSection activeTab="engasjement" styles={styles} />

        {/* Medlemskap */}
        {medlemskap && (
          <section className={styles.footer}>
            <SectionHeader title="Medlemskap" />
            <ActivityCard
              title={medlemskap.tittel}
              tagLabel={medlemskap.status}
              tagColor={medlemskap.statusColor}
              rows={[
                { label: 'Førening', value: medlemskap.forening },
                { label: 'Startdato:', value: medlemskap.startdato },
                { label: 'Sluttdato', value: medlemskap.sluttdato, valueColor: 'success' },
                { label: 'Type: ', value: medlemskap.type },
              ]}
              styles={styles}
            />
          </section>
        )}

        {/* Aktiviteter */}
        <section className={styles['section-activities']}>
          <SectionHeader title="Aktiviteter" />
          <div
            className={styles['activity-gallery']}
            ref={galleryRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {aktiviteter.map((a) => (
              <ActivityCard
                key={a.id}
                title={a.tittel}
                tagLabel={a.status}
                tagColor={a.statusColor}
                rows={[
                  { label: 'Førening:', value: a.forening },
                  { label: 'Startdato:', value: a.startdato },
                  { label: 'Sluttdato', value: a.sluttdato, valueColor: a.sluttdato === 'pågående' ? 'success' : undefined },
                  ...(a.gruppe ? [{ label: 'Gruppe: ', value: a.gruppe }] : []),
                ]}
                styles={styles}
              />
            ))}
          </div>
        </section>

        {/* Roller */}
        <section className={styles['section-activities']}>
          <SectionHeader title="Roller" />
          <div className={styles['roller-gallery']}>
            {roller.map((r) => (
              <ActivityCard
                key={r.id}
                title={r.tittel}
                tagLabel={r.status}
                tagColor={r.statusColor}
                rows={[
                  { label: 'Førening:', value: r.forening },
                  ...(r.aktivitet ? [{ label: 'Aktivitet:', value: r.aktivitet }] : []),
                  { label: 'Startdato:', value: r.startdato },
                  { label: 'Sluttdato', value: r.sluttdato, valueColor: r.sluttdato === 'pågående' ? 'success' : undefined },
                  ...(r.gruppe ? [{ label: 'Gruppe: ', value: r.gruppe }] : []),
                ]}
                styles={styles}
              />
            ))}
          </div>
        </section>

        {/* Verv */}
        <section className={styles['section-activities']}>
          <SectionHeader title="Verv" />
          <div className={styles['roller-gallery']}>
            {verv.map((v) => (
              <ActivityCard
                key={v.id}
                title={v.tittel}
                tagLabel={v.status}
                tagColor={v.statusColor}
                rows={[
                  { label: 'Førening:', value: v.forening },
                  { label: 'Startdato:', value: v.startdato },
                  { label: 'Sluttdato', value: v.sluttdato, valueColor: v.sluttdato === 'pågående' ? 'success' : undefined },
                ]}
                styles={styles}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
