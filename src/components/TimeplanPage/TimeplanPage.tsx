'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Heading, Pagination, Paragraph, Tabs, usePagination } from 'rk-designsystem';
import SiteHeader from '../shared/SiteHeader';
import LoadingSpinner from '../shared/LoadingSpinner';
import { fetchTimeplan } from '@/lib/api';
import type { TimeplanEvent } from '@/types';
import styles from './TimeplanPage.module.css';

type FilterType = 'arrangement' | 'kurs' | 'vakt';
const ALL_FILTERS: FilterType[] = ['arrangement', 'kurs', 'vakt'];
const FILTER_LABELS: Record<FilterType, string> = {
  arrangement: 'Arrangementer',
  kurs: 'Kurser',
  vakt: 'Vakter',
};
const FILTER_CHIP_CLASSES: Record<FilterType, string> = {
  arrangement: 'chip-1',
  kurs: 'chip-2',
  vakt: 'chip-3',
};

const TYPE_ICONS: Record<string, string> = {
  arrangement: '/images/fade87e0-5298-487a-a81e-9d4630042aad.png',
  kurs: '/images/829f2594-0e55-4578-bbcc-f627a26726a9.png',
  vakt: '/images/ac86b9ef-72d0-44b0-8e5c-5973ecfbdb75.png',
};
const STATUS_ICONS: Record<string, string> = {
  arrangement: '/images/908d27a8-7dc6-4ab7-a93a-1355ffd60eb4.png',
  kurs: '/images/01827980-7fbd-41f1-9758-ab3ba0333279.png',
  vakt: '/images/ea81b354-6a3e-4941-9785-dc92c46e77a5.png',
};

const EVENTS_PER_WEEK = 5;

/* ---- Exact Figma card structure, dynamic data ---- */
function EventCard({ event }: { event: TimeplanEvent }) {
  const typeClass = styles[event.type] || styles.arrangement;
  const isArrangement = event.type === 'arrangement';

  return (
    <article className={styles.card}>
      <div className={styles['top-3']}>
        <div className={styles.left}>
          <div className={styles.dato}>
            <p className={styles.tor}>{event.dag}</p>
            <p className={styles.element}>{String(event.dato).padStart(2, '0')}</p>
            <p className={styles.tor}>{event.maaned}</p>
          </div>
        </div>
        <div className={styles.line} />
        <div className={styles.right}>
          <div className={styles['top-text']}>
            <p className={styles.title}>{event.tittel}</p>
          </div>
          <div className={styles.time}>
            <div className={styles['icon-left']}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M7.5005 0C11.6425 0.000247405 14.9999 3.35848 15 7.5005C14.9998 11.6424 11.6424 14.9998 7.5005 15C3.35848 14.9999 0.000247401 11.6425 0 7.5005C8.47118e-05 3.35838 3.35838 8.47141e-05 7.5005 0ZM7.5005 1.31359C4.08403 1.31368 1.31368 4.08403 1.31359 7.5005C1.31384 10.9168 4.08413 13.6863 7.5005 13.6864C10.9167 13.6862 13.6862 10.9167 13.6864 7.5005C13.6863 4.08413 10.9168 1.31384 7.5005 1.31359ZM7.5005 2.73748C7.86319 2.73765 8.1573 3.03155 8.1573 3.39428V7.09439L10.5318 8.28164C10.8559 8.44405 10.9877 8.83873 10.8256 9.16305C10.6634 9.48722 10.2685 9.61865 9.94418 9.45685L7.2067 8.08811C6.98422 7.97687 6.84382 7.74922 6.84371 7.5005V3.39428C6.84371 3.03145 7.13768 2.73748 7.5005 2.73748Z" fill="#2B2B2B"/> </svg>
            </div>
            <p className={styles['start-time']}>{event.startTid}</p>
            <p className={styles['start-time']}>-</p>
            <p className={styles['start-time']}>{event.sluttTid}</p>
          </div>
          <div className={styles.time}>
            <div className={typeClass}>
              <img src={TYPE_ICONS[event.type]} alt="" className={styles['icon-arragement']} />
              <p className={isArrangement ? styles['start-time'] : styles['kurs-text']}>{event.typeLabel}</p>
            </div>
            <div className={styles.deadline}>
              <img src="/images/4b1f3f20-9e00-4474-8106-b9bea3b270bd.png" alt="" className={styles['icon-arragement']} />
              <p className={styles.frist}>Frist:</p>
              <p className={styles['element-2']}>{event.frist}</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles['line-2']} />
      <div className={styles.underline}>
        <div className={styles.volunteer}>
          <div className={styles.accepted}>
            <img src="/images/2a4ecf9c-8b94-44e0-99bb-152a79fca0bf.png" alt="" className={styles['icon-arragement']} />
            <p className={styles.takenseats}>{event.tattePlasser}</p>
          </div>
          <p className={styles.av}>av</p>
          <div className={styles.accepted}>
            <img src="/images/8eab9d7f-6e22-4577-83a3-3e8428853bc1.png" alt="" className={styles['icon-arragement']} />
            <p className={styles.takenseats}>{event.totalePlasser}</p>
          </div>
        </div>
        <div className={styles.type}>
          <img src={STATUS_ICONS[event.type]} alt="" className={styles['icon-arragement']} />
          <p className={styles['start-time']}>{event.status}</p>
        </div>
      </div>
      <div className={styles['line-2']} />
    </article>
  );
}

/* ---- Pagination with arrows at edges ---- */
function WeekPagination({ currentWeek, totalWeeks, onChangeWeek }: {
  currentWeek: number;
  totalWeeks: number;
  onChangeWeek: (week: number) => void;
}) {
  const { pages, prevButtonProps, nextButtonProps } = usePagination({
    currentPage: currentWeek,
    totalPages: totalWeeks,
    onChange: (_e, page) => onChangeWeek(page),
  });

  return (
    <div className={styles['week-pagination']}>
      <Pagination data-color="neutral" aria-label="Forrige uke">
        <Pagination.List>
          <Pagination.Item>
            <Pagination.Button {...prevButtonProps} aria-label="Forrige uke" />
          </Pagination.Item>
        </Pagination.List>
      </Pagination>

      <Pagination data-color="neutral" aria-label="Ukenavigering">
        <Pagination.List>
          {pages.filter(({ page }) => typeof page === 'number').map(({ page, itemKey, buttonProps }) => (
            <Pagination.Item key={itemKey}>
              <Pagination.Button {...buttonProps} aria-label={`Uke ${page}`}>
                Uke {page}
              </Pagination.Button>
            </Pagination.Item>
          ))}
        </Pagination.List>
      </Pagination>

      <div className={styles['next-arrow']}>
        <Pagination data-color="neutral" aria-label="Neste uke">
          <Pagination.List>
            <Pagination.Item>
              <Pagination.Button {...nextButtonProps} aria-label="Neste uke" />
            </Pagination.Item>
          </Pagination.List>
        </Pagination>
      </div>
    </div>
  );
}

export default function TimeplanPage() {
  const [events, setEvents] = useState<TimeplanEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'kommende' | 'mine-påmeldinger'>('kommende');
  const [activeFilters, setActiveFilters] = useState<Set<FilterType>>(new Set(ALL_FILTERS));
  const [currentWeek, setCurrentWeek] = useState(1);

  useEffect(() => {
    fetchTimeplan().then(setEvents);
  }, []);

  const toggleFilter = (filter: FilterType) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(filter)) {
        next.delete(filter);
      } else {
        next.add(filter);
      }
      return next;
    });
  };

  const filteredEvents = events.filter((e) => activeFilters.has(e.type));
  const totalWeeks = Math.max(1, Math.ceil(filteredEvents.length / EVENTS_PER_WEEK));
  const startIdx = (currentWeek - 1) * EVENTS_PER_WEEK;
  const pagedEvents = filteredEvents.slice(startIdx, startIdx + EVENTS_PER_WEEK);
  const displayEvents = activeTab === 'kommende' ? pagedEvents : [];

  return (
    <div className={styles.timeplan}>
      <div className={styles.wrapper}>
        <SiteHeader />
      </div>
      <div className={styles['page-body']}>
        <div className={styles['page-top']}>
          <div className={styles['btn-wrapper']}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Button loading={false} showIconRight={false} showIconLeft variant="tertiary" data-color="neutral" className={styles['back-btn']}>
                <img src="/images/4c4a0483-3b2f-4057-8fcf-18ed6edcd8bb.png" alt="" className="btn-icon" />
                Tilbake
              </Button>
            </Link>
          </div>
          <div className={styles.top}>
            <div className={styles['heading-fill']}>
              <Heading data-size="lg" level={2} className={styles['page-heading']}>Min timeplan</Heading>
            </div>
          </div>
        </div>

        {/* Tabs + Calendar + Chips */}
        <div className={styles['menu-tabs']}>
          <div className={styles['tabs-wrapper']}>
            <Tabs data-color="primary" defaultValue="kommende" onChange={(val: string) => setActiveTab(val as 'kommende' | 'mine-påmeldinger')}>
              <Tabs.List>
                <Tabs.Tab value="kommende">
                  <img src="/images/2b47fd00-8df3-4e4b-95b0-52d5ececcf32.png" alt="" className="tab-icon" />
                  Kommende
                </Tabs.Tab>
                <Tabs.Tab value="mine-påmeldinger">
                  <img src="/images/97b266af-4528-4331-b844-72047e56e6c8.png" alt="" className="tab-icon" />
                  Mine påmeldinger
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>
          </div>
          <img src="/images/ba32031a-79dd-4cb9-9cc1-ee15a1cc66b4.png" alt="Kalender" className={styles.iconbutton} style={{ cursor: 'pointer' }} />
          <div className={styles.multisuggestion}>
            <div className={styles.input}>
              <div className={styles['left-content']}>
                <div className={styles.selected}>
                  {ALL_FILTERS.map((filter) =>
                    activeFilters.has(filter) ? (
                      <div key={filter} className={styles[FILTER_CHIP_CLASSES[filter]]} style={{ cursor: 'pointer' }} onClick={() => toggleFilter(filter)}>
                        <div className={styles['chip-text']}>
                          <Paragraph data-size="sm" variant="short">{FILTER_LABELS[filter]}</Paragraph>
                        </div>
                        <img src="/images/263ec143-ad98-4623-b58a-144172dc9ccf.png" alt={`Fjern ${FILTER_LABELS[filter]}`} className={styles['x-mark']} />
                      </div>
                    ) : null
                  )}
                  <div className={styles.text}>
                    <p className={styles['input-text']}>Filter</p>
                  </div>
                </div>
              </div>
              <div className={styles['right-content']}>
                <div className={styles.chevron} style={{ cursor: 'pointer' }} role="button" tabIndex={0} aria-label="Vis alle filter" onClick={() => setActiveFilters(new Set(ALL_FILTERS))} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveFilters(new Set(ALL_FILTERS)); }}>
                  <div className={styles['vector-2']}>
                    <svg width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M0.653193 0.783732L8.00005 6.90611L15.3469 0.783732" stroke="#2B2B2B" strokeWidth="2"/> </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <section className={styles.kmmende}>
          <div className={styles['filter-menu']}>
            <WeekPagination currentWeek={currentWeek} totalWeeks={totalWeeks} onChangeWeek={setCurrentWeek} />
          </div>
          <div className={styles.body}>
            {displayEvents.length > 0 ? (
              displayEvents.map((event) => <EventCard key={event.id} event={event} />)
            ) : (
              <div style={{ padding: 'var(--ds-size-8)', textAlign: 'center', width: '100%' }}>
                <Paragraph data-size="sm" variant="default">
                  {activeTab === 'mine-påmeldinger'
                    ? 'Du har ingen påmeldinger ennå.'
                    : activeFilters.size === 0
                      ? 'Velg et filter for å se hendelser.'
                      : 'Ingen hendelser å vise.'}
                </Paragraph>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
