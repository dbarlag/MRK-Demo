'use client';

import { Paragraph } from 'rk-designsystem';

export default function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 'var(--ds-size-15)', width: '100%' }}>
      <Paragraph data-size="sm" variant="default">Laster inn...</Paragraph>
    </div>
  );
}
