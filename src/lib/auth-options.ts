import type { NextAuthOptions } from 'next-auth';

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
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
        };
      },
    },
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the Okta access token to the JWT
      if (account) {
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
  secret: process.env.NEXTAUTH_SECRET,
};
