'use client';

import { signIn } from 'next-auth/react';
import { Button, Paragraph } from 'rk-designsystem';
import { assetPath } from '@/lib/basePath';
import styles from './login.module.css';

const devLoginEnabled = process.env.NEXT_PUBLIC_ENABLE_DEV_LOGIN === 'true';

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img
          src={assetPath('/images/28cee95e-f238-4c62-8519-15bcf9175329.png')}
          alt="Mitt Røde Kors"
          className={styles.logo}
        />
        <Paragraph data-size="md" className={styles.description}>
          Logg inn for å få tilgang til frivilligportalen
        </Paragraph>
        <Button
          variant="primary"
          data-color="primary"
          className={styles.button}
          onClick={() => signIn('okta', { callbackUrl: '/' })}
        >
          Logg inn med Okta
        </Button>
        {devLoginEnabled ? (
          <Button
            variant="secondary"
            data-color="neutral"
            className={styles.button}
            onClick={() => signIn('dev', { callbackUrl: '/' })}
          >
            Logg inn som demo-bruker
          </Button>
        ) : null}
      </div>
    </div>
  );
}
