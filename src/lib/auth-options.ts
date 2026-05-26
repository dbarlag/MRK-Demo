import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { mockUser } from '@/data/mockUser';

const isDevLoginEnabled = process.env.NEXT_PUBLIC_ENABLE_DEV_LOGIN === 'true';

function decodeJwtPayload(token: string | undefined): unknown {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const json = Buffer.from(payload, 'base64').toString('utf8');
    return JSON.parse(json);
  } catch {
    return '<undecodable>';
  }
}

/** Dev-only: signs the user in as the mock user without Okta. Gated on
 * NEXT_PUBLIC_ENABLE_DEV_LOGIN so it is impossible to enable in a production
 * deploy unless that env var is explicitly set. */
const devProvider = CredentialsProvider({
  id: 'dev',
  name: 'Demo-bruker',
  credentials: {},
  async authorize() {
    return {
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
    };
  },
});

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: 'okta',
      name: 'Okta',
      type: 'oauth',
      wellKnown: `${process.env.OKTA_ISSUER}/.well-known/openid-configuration`,
      clientId: process.env.OKTA_CLIENT_ID,
      clientSecret: process.env.OKTA_CLIENT_SECRET,
      authorization: { params: { scope: 'openid email profile' } },
      idToken: true,
      profile(profile: { sub: string; name?: string; email?: string }) {
        console.log('[OKTA_DEBUG] userinfo profile:', JSON.stringify(profile, null, 2));
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
        };
      },
    },
    ...(isDevLoginEnabled ? [devProvider] : []),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the Okta access token to the JWT
      if (account) {
        const idTokenClaims = decodeJwtPayload(account.id_token);
        const accessTokenClaims = decodeJwtPayload(account.access_token);
        console.log('[OKTA_DEBUG] account (token strings redacted):', JSON.stringify({
          ...account,
          id_token: account.id_token ? '<redacted>' : undefined,
          access_token: account.access_token ? '<redacted>' : undefined,
          refresh_token: account.refresh_token ? '<redacted>' : undefined,
        }, null, 2));
        console.log('[OKTA_DEBUG] id_token claims:', JSON.stringify(idTokenClaims, null, 2));
        console.log('[OKTA_DEBUG] access_token claims:', JSON.stringify(accessTokenClaims, null, 2));
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Make the access token available on the session
      session.accessToken = token.accessToken as string;
      session.user.id = token.sub as string;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
