import '@digdir/designsystemet-css/index.css';
import 'rk-design-tokens/design-tokens-build/theme.css';
import 'rk-designsystem/dist/rk-designsystem.css';
import './globals.css';
import { Source_Sans_3 } from 'next/font/google';
import AuthProvider from '@/components/shared/AuthProvider';

const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400','600','700'],
  style: ['normal'],
  display: 'swap',
});

export const metadata = {
  title: "Mitt Røde Kors",
  description: 'Mitt Røde Kors frivilligportal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body className={sourceSans3.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
