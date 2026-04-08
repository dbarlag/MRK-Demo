'use client';

import { signIn } from 'next-auth/react';
import { Button, Heading, Paragraph } from 'rk-designsystem';
import styles from './login.module.css';

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src="/images/logo.png" alt="Røde Kors" className={styles.logo} />
        <Heading data-size="lg" level={1} className={styles.heading}>
          Mitt Røde Kors
        </Heading>
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
      </div>
    </div>
  );
}
