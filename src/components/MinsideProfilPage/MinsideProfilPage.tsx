'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, Button, Divider, Heading, Paragraph } from 'rk-designsystem';
import SiteHeader from '../shared/SiteHeader';
import LoadingSpinner from '../shared/LoadingSpinner';
import MinsideTopSection from '../shared/MinsideTopSection';
import InfoRow from '../shared/InfoRow';
import { fetchProfile, fetchParorende, fetchErklaringer } from '@/lib/api';
import type { UserProfile, Parorende, Erklering } from '@/types';
import styles from './MinsideProfilPage.module.css';

const profilRowProps = {
  styles,
  wrapperClass: 'info-cell',
  labelClass: 'info-label',
  valueClass: 'info-value',
};

// Simple inline edit modal
function EditModal({ title, fields, onSave, onCancel }: {
  title: string;
  fields: { label: string; value: string; key: string }[];
  onSave: (values: Record<string, string>) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.key, f.value]))
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: 'var(--ds-color-neutral-background-default)', borderRadius: 'var(--ds-border-radius-xl)', padding: 'var(--ds-size-8)', maxWidth: '500px', width: '90%', display: 'flex', flexDirection: 'column', gap: 'var(--ds-size-4)' }}>
        <Heading data-size="sm" level={3}>{title}</Heading>
        {fields.map((f) => (
          <label key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-size-1)' }}>
            <Paragraph data-size="sm" variant="default">{f.label}</Paragraph>
            <input
              value={values[f.key]}
              onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              style={{ padding: 'var(--ds-size-3)', border: '1px solid var(--ds-color-neutral-border-default)', borderRadius: 'var(--ds-border-radius-md)', fontSize: 'inherit' }}
            />
          </label>
        ))}
        <div style={{ display: 'flex', gap: 'var(--ds-size-4)', justifyContent: 'flex-end' }}>
          <Button variant="tertiary" data-color="neutral" onClick={onCancel}>Avbryt</Button>
          <Button variant="primary" data-color="primary" onClick={() => onSave(values)}>Lagre</Button>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({ title, message, onConfirm, onCancel }: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: 'var(--ds-color-neutral-background-default)', borderRadius: 'var(--ds-border-radius-xl)', padding: 'var(--ds-size-8)', maxWidth: '400px', width: '90%', display: 'flex', flexDirection: 'column', gap: 'var(--ds-size-4)' }}>
        <Heading data-size="sm" level={3}>{title}</Heading>
        <Paragraph data-size="sm" variant="default">{message}</Paragraph>
        <div style={{ display: 'flex', gap: 'var(--ds-size-4)', justifyContent: 'flex-end' }}>
          <Button variant="tertiary" data-color="neutral" onClick={onCancel}>Avbryt</Button>
          <Button variant="primary" data-color="danger" onClick={onConfirm}>Fjern</Button>
        </div>
      </div>
    </div>
  );
}

export default function MinsideProfilPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [parorende, setParorende] = useState<Parorende[]>([]);
  const [erklaringer, setErklaringer] = useState<Erklering[]>([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingParorende, setEditingParorende] = useState<Parorende | null>(null);
  const [addingParorende, setAddingParorende] = useState(false);
  const [removingParorende, setRemovingParorende] = useState<Parorende | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  useEffect(() => {
    fetchProfile().then(setUser);
    fetchParorende().then(setParorende);
    fetchErklaringer().then(setErklaringer);
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX;
    scrollStart.current = galleryRef.current?.scrollLeft ?? 0;
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !galleryRef.current) return;
    e.preventDefault();
    galleryRef.current.scrollLeft = scrollStart.current - (e.pageX - startX.current);
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  if (!user) return <LoadingSpinner />;

  const handleSaveProfile = (values: Record<string, string>) => {
    setUser((prev) => prev ? { ...prev, phone: values.phone, email: values.email, address: values.address } : prev);
    setEditingProfile(false);
  };

  const handleSaveParorende = (values: Record<string, string>) => {
    if (editingParorende) {
      setParorende((prev) => prev.map((p) => p.id === editingParorende.id ? { ...p, ...values } as Parorende : p));
      setEditingParorende(null);
    }
  };

  const handleAddParorende = (values: Record<string, string>) => {
    const newP: Parorende = {
      id: String(Date.now()),
      navn: values.navn,
      relasjon: values.relasjon,
      telefon: values.telefon,
      epost: values.epost,
    };
    setParorende((prev) => [...prev, newP]);
    setAddingParorende(false);
  };

  const handleRemoveParorende = () => {
    if (removingParorende) {
      setParorende((prev) => prev.filter((p) => p.id !== removingParorende.id));
      setRemovingParorende(null);
    }
  };

  return (
    <div className={styles['profil-page']}>
      <div className={styles.wrapper}>
        <SiteHeader />
      </div>
      <div className={styles['page-body']}>
        <MinsideTopSection activeTab="profil" styles={styles} />

        {/* Brukerinfo */}
        <section className={styles['section-me']}>
          <div className={styles.user}>
            <div className={styles['avatar-wrapper']}>
              <Avatar badge={false} square={false} type="inital" data-color="neutral">
                <div className={styles['avatar-inner']}>
                  <Heading data-size="sm" level={3} className={styles['avatar-initial']}>{user.avatarInitial}</Heading>
                </div>
              </Avatar>
            </div>
            <div className={styles.data}>
              <div className={styles['info-heading-wrapper']}>
                <Heading data-size="xs" level={4} className={styles['info-heading']}>{user.name}</Heading>
              </div>
              <section className={styles.sections}>
                <section className={styles.section1}>
                  <div className={styles.element}>
                    <InfoRow label="Fødselsdato:" value={user.birthDate} iconSrc="/images/e70ca5a3-092e-4273-93c0-a5f310027c2f.png" {...profilRowProps} />
                    <InfoRow label="Røde Kors e-post:" value={user.rkEmail} iconSrc="/images/ccb59b7f-1e71-4cee-b012-23975a2f5284.png" {...profilRowProps} />
                    <InfoRow label="Røde Kors nr.: " value={user.rkNr} iconSrc="/images/cb335e29-eb06-44dd-9846-27907bc77d47.png" {...profilRowProps} />
                  </div>
                </section>
                <section className={styles.section1}>
                  <div className={styles.element}>
                    <InfoRow label="Tel. nummer:" value={user.phone} iconSrc="/images/cd82a362-7c7a-421b-9cfc-b25c601d54d6.png" {...profilRowProps} />
                    <InfoRow label="E-post:" value={user.email} iconSrc="/images/629c164c-9efb-4e21-8ba4-5c1251d9cc56.png" {...profilRowProps} />
                    <InfoRow label="Address: " value={user.address} iconSrc="/images/40d5c8f0-2f36-4c5e-96a2-e0d7086a2efb.png" {...profilRowProps} />
                  </div>
                </section>
              </section>
            </div>
          </div>
          <div className={styles['tabs-wrapper']}>
            <Divider />
          </div>
          <div className={styles['actions-right']}>
            <div className={styles['btn-wrapper']}>
              <Button loading={false} showIconRight showIconLeft={false} variant="primary" data-color="primary" className={styles['primary-btn']} onClick={() => setEditingProfile(true)}>
                Endre
                <img src="/images/afe096b2-3709-4688-a8d6-bb62c9fcf85c.png" alt="" className="btn-icon" />
              </Button>
            </div>
          </div>
        </section>

        {/* Pårørender */}
        <section className={styles['section-parents']}>
          <div className={styles['section-top']}>
            <div className={styles['section-top-row']}>
              <div className={styles['section-heading-wrapper']}>
                <Heading data-size="sm" level={4} className={styles['section-heading']}>Pårørender</Heading>
              </div>
              <div className={styles['btn-wrapper']}>
                <Button showIconRight loading={false} showIconLeft={false} variant="primary" data-color="neutral" className={styles['add-btn']} onClick={() => setAddingParorende(true)}>
                  Legge til
                  <img src="/images/eefc83a6-9acc-43b7-81f8-2e4306b65ce1.png" alt="" className="btn-icon" />
                </Button>
              </div>
            </div>
            <div className={styles['tabs-wrapper']}>
              <Divider />
            </div>
          </div>
          <div className={styles.gallery}>
            {parorende.map((p) => (
              <article key={p.id} className={styles['parent-card']}>
                <div className={styles.user}>
                  <div className={styles.data}>
                    <div className={styles['info-heading-wrapper']}>
                      <Heading data-size="xs" level={4} className={styles['info-heading']}>{p.navn}</Heading>
                    </div>
                    <section className={styles['info-section-compact']}>
                      <div className={styles.element}>
                        <InfoRow label="Navn:" value={p.navn} {...profilRowProps} />
                        <InfoRow label="Relasjon:" value={p.relasjon} {...profilRowProps} />
                        <InfoRow label="Telefon:" value={p.telefon} {...profilRowProps} />
                        <InfoRow label="E-post:" value={p.epost} {...profilRowProps} />
                      </div>
                    </section>
                  </div>
                </div>
                <div className={styles['tabs-wrapper']}>
                  <Divider />
                </div>
                <div className={styles['actions-right']}>
                  <div className={styles['btn-wrapper']}>
                    <Button loading={false} showIconRight showIconLeft={false} variant="primary" data-color="primary" className={styles['primary-btn']} onClick={() => setRemovingParorende(p)}>
                      Fjern
                      <img src="/images/ef0a4ff0-b687-426e-9d71-4f3d211291d4.png" alt="" className="btn-icon" />
                    </Button>
                  </div>
                  <div className={styles['btn-wrapper']}>
                    <Button loading={false} showIconRight showIconLeft={false} variant="primary" data-color="primary" className={styles['primary-btn']} onClick={() => setEditingParorende(p)}>
                      Endre
                      <img src="/images/c6449fdd-3b12-46e9-b050-49b622814a2b.png" alt="" className="btn-icon" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Erklæringer */}
        <section className={styles['section-parents']}>
          <div className={styles['section-top']}>
            <div className={styles['section-top-row']}>
              <div className={styles['section-heading-wrapper']}>
                <Heading data-size="sm" level={4} className={styles['section-heading']}>Erklæringer</Heading>
              </div>
            </div>
            <div className={styles['tabs-wrapper']}>
              <Divider />
            </div>
            <div
              className={styles['declarations-gallery']}
              ref={galleryRef}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
            >
              {erklaringer.map((e) => (
                <article key={e.id} className={e.type === 'politiattest' ? styles['section-me'] : styles.card}>
                  <div className={styles.user}>
                    <div className={styles.data}>
                      <div className={styles['info-heading-wrapper']}>
                        <Heading data-size="xs" level={4} className={styles['info-heading']}>{e.tittel}</Heading>
                      </div>
                      <section className={styles.sections}>
                        <section className={styles.section1}>
                          <div className={styles.element}>
                            {e.type === 'politiattest' ? (
                              <>
                                <InfoRow label="Utstedt dato:" value={e.dato} {...profilRowProps} />
                                {e.status && (
                                  <InfoRow label="Status:" value={e.status} valueColor={e.statusColor} {...profilRowProps} valueColorClass="status-valid" />
                                )}
                              </>
                            ) : (
                              <InfoRow label="Lest og bekreftet:" value={e.dato} {...profilRowProps} />
                            )}
                          </div>
                        </section>
                      </section>
                    </div>
                  </div>
                  <div className={styles['tabs-wrapper']}>
                    <Divider />
                  </div>
                  <div className={styles['actions-right']}>
                    <div className={styles['btn-wrapper']}>
                      <Button
                        loading={false}
                        showIconRight
                        showIconLeft={false}
                        variant="primary"
                        data-color="primary"
                        className={styles['primary-btn']}
                        onClick={() => {
                          if (e.type === 'politiattest') {
                            alert('Filopplasting er ikke tilgjengelig ennå.');
                          } else {
                            alert(`${e.tittel}\n\nLest og bekreftet: ${e.dato}`);
                          }
                        }}
                      >
                        {e.type === 'politiattest' ? 'Laste opp' : 'Les'}
                        <img src="/images/47ed3648-852e-440d-8c2b-12a774e39323.png" alt="" className="btn-icon" />
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Modals */}
      {editingProfile && (
        <EditModal
          title="Endre profil"
          fields={[
            { label: 'Telefon', value: user.phone, key: 'phone' },
            { label: 'E-post', value: user.email, key: 'email' },
            { label: 'Adresse', value: user.address, key: 'address' },
          ]}
          onSave={handleSaveProfile}
          onCancel={() => setEditingProfile(false)}
        />
      )}

      {editingParorende && (
        <EditModal
          title={`Endre ${editingParorende.navn}`}
          fields={[
            { label: 'Navn', value: editingParorende.navn, key: 'navn' },
            { label: 'Relasjon', value: editingParorende.relasjon, key: 'relasjon' },
            { label: 'Telefon', value: editingParorende.telefon, key: 'telefon' },
            { label: 'E-post', value: editingParorende.epost, key: 'epost' },
          ]}
          onSave={handleSaveParorende}
          onCancel={() => setEditingParorende(null)}
        />
      )}

      {addingParorende && (
        <EditModal
          title="Legg til pårørende"
          fields={[
            { label: 'Navn', value: '', key: 'navn' },
            { label: 'Relasjon', value: '', key: 'relasjon' },
            { label: 'Telefon', value: '', key: 'telefon' },
            { label: 'E-post', value: '', key: 'epost' },
          ]}
          onSave={handleAddParorende}
          onCancel={() => setAddingParorende(false)}
        />
      )}

      {removingParorende && (
        <ConfirmModal
          title="Fjern pårørende"
          message={`Er du sikker på at du vil fjerne ${removingParorende.navn}?`}
          onConfirm={handleRemoveParorende}
          onCancel={() => setRemovingParorende(null)}
        />
      )}
    </div>
  );
}
