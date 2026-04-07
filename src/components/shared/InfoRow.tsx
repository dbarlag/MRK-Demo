'use client';

import { Paragraph } from 'rk-designsystem';

interface InfoRowProps {
  label: string;
  value: string;
  iconSrc?: string;
  valueColor?: string;
  styles: Record<string, string>;
  wrapperClass?: string;
  labelClass?: string;
  valueClass?: string;
  valueColorClass?: string;
}

export default function InfoRow({
  label,
  value,
  iconSrc,
  valueColor,
  styles,
  wrapperClass = 'info-cell',
  labelClass = 'info-label',
  valueClass = 'info-value',
  valueColorClass = 'info-value-success',
}: InfoRowProps) {
  return (
    <div className={styles.line1} aria-hidden="true">
      {iconSrc && <img src={iconSrc} alt="" className={styles['icon-right']} />}
      <div className={styles[wrapperClass]}>
        <Paragraph data-size="sm" variant="default" className={styles[labelClass]}>{label}</Paragraph>
      </div>
      <div className={styles[wrapperClass]}>
        <Paragraph
          data-size="sm"
          variant="default"
          {...(valueColor ? { 'data-color': valueColor } : {})}
          className={valueColor ? styles[valueColorClass] : styles[valueClass]}
        >
          {value}
        </Paragraph>
      </div>
    </div>
  );
}
