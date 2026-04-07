'use client';

import { memo } from 'react';
import { Heading, Tag } from 'rk-designsystem';
import InfoRow from './InfoRow';

interface ActivityCardRow {
  label: string;
  value: string;
  iconSrc?: string;
  valueColor?: string;
}

interface ActivityCardProps {
  title: string;
  tagLabel: string;
  tagColor: string;
  rows: ActivityCardRow[];
  styles: Record<string, string>;
}

export default memo(function ActivityCard({ title, tagLabel, tagColor, rows, styles }: ActivityCardProps) {
  return (
    <article className={styles['activity-card']}>
      <div className={styles['card-top']}>
        <div className={styles['heading-fill']}>
          <Heading data-size="xs" level={4} className={styles['card-heading']}>{title}</Heading>
        </div>
        <div className={styles['tag-wrapper']}>
          <Tag tagLabel={tagLabel} data-color={tagColor} className={styles['status-tag']}>{tagLabel}</Tag>
        </div>
      </div>
      <div className={styles.footer}>
        {rows.map((row, i) => (
          <InfoRow key={i} label={row.label} value={row.value} iconSrc={row.iconSrc} valueColor={row.valueColor} styles={styles} />
        ))}
      </div>
    </article>
  );
});
