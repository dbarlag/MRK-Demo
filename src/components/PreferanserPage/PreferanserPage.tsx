'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button, Card, CardBlock, Heading, Pagination, Paragraph, Search, Tag, usePagination } from 'rk-designsystem';
import { Field, Label } from '@digdir/designsystemet-react';
import { ArrowLeftIcon, CheckmarkIcon, LocationPinIcon } from '@navikt/aksel-icons';
import SiteHeader from '../shared/SiteHeader';
import {
  AUDIENCE_LABELS,
  AUDIENCE_ORDER,
  audienceFor,
  type Audience,
} from '@/lib/audience';
import { FALLBACK_IMAGE, imageFor } from '@/lib/category-images';
import { haversineKm, resolvePlace, type Place } from '@/lib/geo';
import type { ActivityCard } from '@/lib/branches';
import { fetchAktivitetPreferanser, saveAktivitetPreferanser } from '@/lib/api';
import type { AktivitetPreferanser } from '@/types';
import styles from './PreferanserPage.module.css';

type FilterValue = Audience | 'alle';

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: 'alle', label: 'Alle' },
  ...AUDIENCE_ORDER.map((a) => ({ value: a as FilterValue, label: AUDIENCE_LABELS[a] })),
];

const PAGE_SIZE = 6;
/** Hard cap on result count. With ~2000 flattened activities, sorting all by
 * distance leaves the tail wildly far from the user — paginating through "274
 * pages" is meaningless. Cap matches typical search-result UX (10 pages max). */
const MAX_RESULTS = 60;

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

type Ranked = { activity: ActivityCard; distanceKm: number | null };

interface Props {
  activities: ActivityCard[];
}

export default function PreferanserPage({ activities }: Props) {
  const [selected, setSelected] = useState<AktivitetPreferanser | null>(null);
  const [filter, setFilter] = useState<FilterValue>('alle');
  const [placeQuery, setPlaceQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  useEffect(() => {
    fetchAktivitetPreferanser()
      .then((p) => setSelected(p.activityId ? p : null))
      .catch(console.error)
      .finally(() => setLoaded(true));
  }, []);

  /** Snap back to page 1 when filters change so users don't land on an empty
   * page after narrowing the result set. */
  useEffect(() => {
    setPage(1);
  }, [filter, placeQuery]);

  const filtered = useMemo(() => {
    const byBucket =
      filter === 'alle'
        ? activities
        : activities.filter((a) => audienceFor(a.globalActivityName) === filter);

    const query = placeQuery.trim();

    if (query === '') {
      const items: Ranked[] = byBucket.map((a) => ({ activity: a, distanceKm: null }));
      return {
        items,
        resolvedPlace: null as Place | null,
        anyLocal: false,
        usedSubstringFallback: false,
      };
    }

    const place = resolvePlace(query);

    if (place) {
      const ranked: Ranked[] = byBucket.map((a) => {
        const d =
          a.lat != null && a.lng != null
            ? haversineKm({ lat: place.lat, lng: place.lng }, { lat: a.lat, lng: a.lng })
            : Number.POSITIVE_INFINITY;
        return { activity: a, distanceKm: Number.isFinite(d) ? d : null };
      });
      ranked.sort((x, y) => {
        const dx = x.distanceKm ?? Number.POSITIVE_INFINITY;
        const dy = y.distanceKm ?? Number.POSITIVE_INFINITY;
        return dx - dy;
      });
      const anyLocal = byBucket.some(
        (a) => a.municipality?.toLowerCase() === place.name.toLowerCase(),
      );
      return { items: ranked, resolvedPlace: place, anyLocal, usedSubstringFallback: false };
    }

    const q = query.toLowerCase();
    const matched = byBucket.filter((a) => a.haystack.includes(q));
    const items: Ranked[] = (matched.length > 0 ? matched : byBucket).map((a) => ({
      activity: a,
      distanceKm: null,
    }));
    return {
      items,
      resolvedPlace: null as Place | null,
      anyLocal: matched.length > 0,
      usedSubstringFallback: matched.length === 0 && byBucket.length > 0,
    };
  }, [activities, filter, placeQuery]);

  const cappedItems = filtered.items.slice(0, MAX_RESULTS);
  const totalPages = Math.max(1, Math.ceil(cappedItems.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const visible = cappedItems.slice(pageStart, pageStart + PAGE_SIZE);
  const wasCapped = filtered.items.length > MAX_RESULTS;

  const placeDisplay = placeQuery.trim();
  const showProximityBanner =
    filtered.resolvedPlace != null && !filtered.anyLocal && filtered.items.length > 0;
  const showSubstringFallbackBanner = filtered.usedSubstringFallback;

  const { pages, prevButtonProps, nextButtonProps } = usePagination({
    currentPage: safePage,
    totalPages,
    onChange: (_e: unknown, p: number) => setPage(p),
  });

  const select = (a: ActivityCard) => {
    setSelected((prev) => {
      // User must always have one chosen — clicking the current card is a no-op.
      if (prev?.activityId === a.id) return prev;
      return {
        activityId: a.id,
        globalActivityName: a.globalActivityName,
        localActivityName: a.localActivityName,
        municipality: a.municipality,
        neighborhood: a.neighborhood,
        branchName: a.branchName,
      };
    });
    setSaveStatus('idle');
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      await saveAktivitetPreferanser(
        selected ?? {
          activityId: null,
          globalActivityName: null,
          localActivityName: null,
          municipality: null,
          neighborhood: null,
          branchName: null,
        },
      );
      setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (!img.dataset.fallback) {
      img.dataset.fallback = '1';
      img.src = FALLBACK_IMAGE;
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <SiteHeader />
      </div>
      <div className={styles.body}>
        <div className={styles.top}>
          <div className={styles['btn-wrapper']}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Button variant="tertiary" data-color="neutral" className={styles['back-btn']}>
                <ArrowLeftIcon aria-hidden="true" style={{ width: '1em', height: '1em' }} />
                Tilbake
              </Button>
            </Link>
          </div>
          <div className={styles['heading-wrap']}>
            <Heading data-size="lg" level={2} className={styles.heading}>
              Min aktivitetspreferanse
            </Heading>
            <Paragraph data-size="sm" variant="default" className={styles.intro}>
              Velg én aktivitet du er interessert i, og hvor du ønsker å bidra. Bla i tilbudene
              fra lokalforeningene og pek ut den som passer for deg.
            </Paragraph>
          </div>
        </div>

        <div className={styles['location-row']}>
          <Field>
            <Label>Hvor</Label>
            <Search>
              <Search.Input
                value={placeQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlaceQuery(e.target.value)}
                placeholder="Sted, kommune eller fylke…"
                aria-label="Filtrer på sted"
              />
              <Search.ClearButton onClick={() => setPlaceQuery('')} />
            </Search>
          </Field>
        </div>

        <div className={styles['filter-row']} role="tablist" aria-label="Filtrer på interesseområde">
          {FILTERS.map((f) => {
            const active = filter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                role="tab"
                aria-selected={active}
                className={`${styles['filter-chip']} ${active ? styles['filter-chip-active'] : ''}`}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {showProximityBanner ? (
          <p className={styles['fallback-note']}>
            Ingen aktiviteter i {capitalize(placeDisplay)}. Nærmeste tilbud:
          </p>
        ) : null}
        {showSubstringFallbackBanner ? (
          <p className={styles['fallback-note']}>
            Fant ingen aktiviteter som matcher «{placeDisplay}». Viser alle:
          </p>
        ) : null}

        <section className={styles.grid} aria-live="polite">
          {!loaded
            ? null
            : visible.map(({ activity: a, distanceKm }) => {
                const isSelected = selected?.activityId === a.id;
                const bucket = audienceFor(a.globalActivityName);
                const locationBits = [a.neighborhood, a.municipality, a.county]
                  .filter(Boolean)
                  .filter((v, i, arr) => arr.indexOf(v) === i);
                return (
                  <Card
                    key={a.id}
                    variant="default"
                    data-color="neutral"
                    className={`${styles.card} ${isSelected ? styles['card-selected'] : ''}`}
                  >
                    <CardBlock>
                      <div className={styles['card-image-wrap']}>
                        <img
                          src={imageFor(a.globalActivityName)}
                          alt=""
                          className={styles['card-image']}
                          onError={handleImageError}
                          loading="lazy"
                        />
                        {isSelected ? (
                          <span className={styles['selected-badge']} aria-hidden="true">
                            <CheckmarkIcon style={{ width: '1em', height: '1em' }} />
                          </span>
                        ) : null}
                      </div>
                    </CardBlock>
                    <CardBlock>
                      <div className={styles['card-tags']}>
                        <Tag data-color="neutral" shape="rounded">
                          {AUDIENCE_LABELS[bucket]}
                        </Tag>
                        <Tag shape="rounded">{a.globalActivityName}</Tag>
                      </div>
                      <Heading data-size="xs" level={3} className={styles['card-title']}>
                        {a.localActivityName}
                      </Heading>
                    </CardBlock>
                    <CardBlock>
                      <ul className={styles['card-meta']}>
                        {locationBits.length > 0 ? (
                          <li className={styles['meta-row']}>
                            <LocationPinIcon aria-hidden="true" style={{ width: '1.1em', height: '1.1em', flexShrink: 0 }} />
                            <span>{locationBits.join(', ')}</span>
                          </li>
                        ) : null}
                        {a.branchName ? (
                          <li className={styles['meta-row']}>
                            <span className={styles['meta-branch']}>{a.branchName}</span>
                          </li>
                        ) : null}
                        {distanceKm != null && filtered.resolvedPlace ? (
                          <li className={styles['meta-row']}>
                            <span className={styles['distance-pill']}>
                              {isLocalTo(a, filtered.resolvedPlace)
                                ? `I ${capitalize(placeDisplay)}`
                                : `≈ ${formatKm(distanceKm)} fra ${capitalize(placeDisplay)}`}
                            </span>
                          </li>
                        ) : null}
                      </ul>
                    </CardBlock>
                    <CardBlock>
                      <Button
                        variant={isSelected ? 'primary' : 'secondary'}
                        data-color={isSelected ? 'primary' : 'neutral'}
                        className={styles['card-cta']}
                        onClick={() => select(a)}
                        aria-pressed={isSelected}
                        disabled={isSelected}
                      >
                        {isSelected ? (
                          <>
                            <CheckmarkIcon aria-hidden="true" style={{ width: '1em', height: '1em' }} />
                            Valgt
                          </>
                        ) : (
                          <>Bytt til</>
                        )}
                      </Button>
                    </CardBlock>
                  </Card>
                );
              })}
          {loaded && visible.length === 0 ? (
            <p className={styles.empty}>Ingen aktiviteter tilgjengelige.</p>
          ) : null}
        </section>

        {wasCapped ? (
          <p className={styles['cap-note']}>
            Viser de {MAX_RESULTS} mest relevante av {filtered.items.length} treff. Bruk filterene
            over for å snevre inn.
          </p>
        ) : null}

        {totalPages > 1 ? (
          <Pagination data-color="neutral" aria-label="Bla i sider" className={styles.pagination}>
            <Pagination.List>
              <Pagination.Item>
                <Pagination.Button {...prevButtonProps} aria-label="Forrige side" />
              </Pagination.Item>
              {pages
                .filter(({ page: p }: { page: number | string }) => typeof p === 'number')
                .map(({ page: p, itemKey, buttonProps }: { page: number | string; itemKey: string; buttonProps: Record<string, unknown> }) => (
                  <Pagination.Item key={itemKey}>
                    <Pagination.Button {...buttonProps} aria-label={`Side ${p}`}>
                      {p}
                    </Pagination.Button>
                  </Pagination.Item>
                ))}
              <Pagination.Item>
                <Pagination.Button {...nextButtonProps} aria-label="Neste side" />
              </Pagination.Item>
            </Pagination.List>
          </Pagination>
        ) : null}
      </div>

      <div className={styles['save-bar']} role="region" aria-label="Lagre preferanse">
        <div className={styles['save-bar-inner']}>
          <Paragraph data-size="sm" variant="default" className={styles['save-count']}>
            {selected?.activityId ? (
              <>
                <strong>{selected.localActivityName}</strong>
                {selected.municipality ? <> · {selected.municipality}</> : null}
              </>
            ) : (
              <>Ingen aktivitet valgt</>
            )}
            {saveStatus === 'saved' ? <span className={styles['save-msg']}> · Lagret</span> : null}
            {saveStatus === 'error' ? (
              <span className={styles['save-msg-error']}> · Kunne ikke lagre</span>
            ) : null}
          </Paragraph>
          <Button
            variant="primary"
            data-color="primary"
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            loading={saveStatus === 'saving'}
          >
            Lagre
          </Button>
        </div>
      </div>
    </div>
  );
}

function formatKm(km: number): string {
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

function isLocalTo(a: ActivityCard, place: Place): boolean {
  const placeName = place.name.toLowerCase();
  const aliases = [placeName, placeName === 'oslo sentrum' ? 'sentrum' : null].filter(
    Boolean,
  ) as string[];
  if (a.neighborhood && aliases.includes(a.neighborhood.toLowerCase())) return true;
  if (a.municipality && aliases.includes(a.municipality.toLowerCase())) return true;
  return false;
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
