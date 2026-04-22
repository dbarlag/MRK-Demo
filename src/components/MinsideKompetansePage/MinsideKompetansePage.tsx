'use client';

import { useEffect, useState } from 'react';
import { Button, Divider, Heading, Paragraph } from 'rk-designsystem';
import { PencilIcon } from '@navikt/aksel-icons';
import SiteHeader from '../shared/SiteHeader';
import LoadingSpinner from '../shared/LoadingSpinner';
import MinsideTopSection from '../shared/MinsideTopSection';
import ActivityCard from '../shared/ActivityCard';
import InfoRow from '../shared/InfoRow';
import { fetchKurser, fetchSprak, fetchSertifikater } from '@/lib/api';
import type { Kurs, Sprak, Sertifikat } from '@/types';
import styles from './MinsideKompetansePage.module.css';

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

function ModalBackdrop({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>
  );
}

function EditListModal({ title, items, labelKey, valueKey, onSave, onCancel }: {
  title: string;
  items: { label: string; value: string }[];
  labelKey: string;
  valueKey: string;
  onSave: (items: { label: string; value: string }[]) => void;
  onCancel: () => void;
}) {
  const [rows, setRows] = useState(items.map((i) => ({ ...i })));

  const updateRow = (idx: number, field: 'label' | 'value', val: string) => {
    setRows((prev) => prev.map((r, i) => i === idx ? { ...r, [field]: val } : r));
  };

  const addRow = () => setRows((prev) => [...prev, { label: '', value: '' }]);

  const removeRow = (idx: number) => setRows((prev) => prev.filter((_, i) => i !== idx));

  return (
    <ModalBackdrop onClose={onCancel}>
      <div style={{ background: 'var(--ds-color-neutral-background-default)', borderRadius: 'var(--ds-border-radius-xl)', padding: 'var(--ds-size-8)', maxWidth: '500px', width: '90%', display: 'flex', flexDirection: 'column', gap: 'var(--ds-size-4)', maxHeight: '80vh', overflow: 'auto' }}>
        <Heading data-size="sm" level={3}>{title}</Heading>
        {rows.map((row, i) => (
          <div key={i} style={{ display: 'flex', gap: 'var(--ds-size-2)', alignItems: 'end' }}>
            <label style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--ds-size-1)' }}>
              <Paragraph data-size="xs" variant="default">{labelKey}</Paragraph>
              <input
                value={row.label}
                onChange={(e) => updateRow(i, 'label', e.target.value)}
                style={{ padding: 'var(--ds-size-2)', border: '1px solid var(--ds-color-neutral-border-default)', borderRadius: 'var(--ds-border-radius-md)', fontSize: 'inherit' }}
              />
            </label>
            <label style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--ds-size-1)' }}>
              <Paragraph data-size="xs" variant="default">{valueKey}</Paragraph>
              <input
                value={row.value}
                onChange={(e) => updateRow(i, 'value', e.target.value)}
                style={{ padding: 'var(--ds-size-2)', border: '1px solid var(--ds-color-neutral-border-default)', borderRadius: 'var(--ds-border-radius-md)', fontSize: 'inherit' }}
              />
            </label>
            <button
              onClick={() => removeRow(i)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 'var(--ds-size-2)', color: 'var(--ds-color-danger-text-subtle)', fontSize: '1.2em' }}
              aria-label="Fjern rad"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={addRow}
          style={{ background: 'none', border: '1px dashed var(--ds-color-neutral-border-default)', borderRadius: 'var(--ds-border-radius-md)', padding: 'var(--ds-size-3)', cursor: 'pointer', color: 'var(--ds-color-neutral-text-subtle)' }}
        >
          + Legg til
        </button>
        <div style={{ display: 'flex', gap: 'var(--ds-size-4)', justifyContent: 'flex-end' }}>
          <Button variant="tertiary" data-color="neutral" onClick={onCancel}>Avbryt</Button>
          <Button variant="primary" data-color="primary" onClick={() => onSave(rows)}>Lagre</Button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

export default function MinsideKompetansePage() {
  const [kurser, setKurser] = useState<Kurs[]>([]);
  const [sprak, setSprak] = useState<Sprak[]>([]);
  const [sertifikater, setSertifikater] = useState<Sertifikat[]>([]);
  const [editingSprak, setEditingSprak] = useState(false);
  const [editingSertifikater, setEditingSertifikater] = useState(false);

  useEffect(() => {
    fetchKurser().then(setKurser).catch(console.error);
    fetchSprak().then(setSprak).catch(console.error);
    fetchSertifikater().then(setSertifikater).catch(console.error);
  }, []);

  return (
    <div className={styles['kompetanse-page']}>
      <div className={styles.wrapper}>
        <SiteHeader />
      </div>
      <div className={styles['page-body']}>
        <MinsideTopSection activeTab="kompetanse" styles={styles} />

        {/* Kurser */}
        <section className={styles['section-membership']}>
          <SectionHeader title="Kurser" />
          <div className={styles['activity-gallery']}>
            {kurser.map((k) => (
              <ActivityCard
                key={k.id}
                title={k.tittel}
                tagLabel={k.status}
                tagColor={k.statusColor}
                rows={[
                  { label: 'Førening', value: k.forening },
                  { label: 'Dato', value: k.dato },
                  { label: 'Type: ', value: k.type },
                ]}
                styles={styles}
              />
            ))}
          </div>
        </section>

        {/* Språker */}
        <section className={styles.body}>
          <SectionHeader title="Språker" />
          <article className={styles['detail-card']}>
            <div className={styles.body}>
              {sprak.map((s, i) => (
                <InfoRow key={i} label={`${s.sprak}:`} value={s.niva} styles={styles} />
              ))}
            </div>
            <footer className={styles.body}>
              <div className={styles['divider-wrapper']}>
                <Divider />
              </div>
              <div className={styles['actions-right']}>
                <div className={styles['btn-wrapper']}>
                  <Button loading={false} showIconRight showIconLeft={false} variant="primary" data-color="primary" className={styles['primary-btn']} onClick={() => setEditingSprak(true)}>
                    Endre
                    <PencilIcon aria-hidden="true" style={{ width: "1em", height: "1em" }} />
                  </Button>
                </div>
              </div>
            </footer>
          </article>
        </section>

        {/* Sertifikater */}
        <section className={styles.body}>
          <SectionHeader title="Sertifikater" />
          <article className={styles['detail-card']}>
            <div className={styles.body}>
              {sertifikater.map((s, i) => (
                <InfoRow key={i} label={`${s.type}:`} value={s.klasse} styles={styles} />
              ))}
            </div>
            <footer className={styles.body}>
              <div className={styles['divider-wrapper']}>
                <Divider />
              </div>
              <div className={styles['actions-right']}>
                <div className={styles['btn-wrapper']}>
                  <Button loading={false} showIconRight showIconLeft={false} variant="primary" data-color="primary" className={styles['primary-btn']} onClick={() => setEditingSertifikater(true)}>
                    Endre
                    <PencilIcon aria-hidden="true" style={{ width: "1em", height: "1em" }} />
                  </Button>
                </div>
              </div>
            </footer>
          </article>
        </section>
      </div>

      {/* Modals */}
      {editingSprak && (
        <EditListModal
          title="Endre språk"
          items={sprak.map((s) => ({ label: s.sprak, value: s.niva }))}
          labelKey="Språk"
          valueKey="Nivå"
          onSave={(items) => {
            setSprak(items.filter((i) => i.label).map((i) => ({ sprak: i.label, niva: i.value })));
            setEditingSprak(false);
          }}
          onCancel={() => setEditingSprak(false)}
        />
      )}

      {editingSertifikater && (
        <EditListModal
          title="Endre sertifikater"
          items={sertifikater.map((s) => ({ label: s.type, value: s.klasse }))}
          labelKey="Type"
          valueKey="Klasse"
          onSave={(items) => {
            setSertifikater(items.filter((i) => i.label).map((i) => ({ type: i.label, klasse: i.value })));
            setEditingSertifikater(false);
          }}
          onCancel={() => setEditingSertifikater(false)}
        />
      )}
    </div>
  );
}
