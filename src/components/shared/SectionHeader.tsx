'use client';

import { Divider, Heading } from 'rk-designsystem';
import styles from './SectionHeader.module.css';

interface Props {
  title: string;
}

export default function SectionHeader({ title }: Props) {
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
