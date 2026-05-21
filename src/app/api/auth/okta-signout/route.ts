import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  const issuer = process.env.OKTA_ISSUER;
  const postLogoutRedirect = new URL('/login', req.url).toString();

  if (!issuer) {
    return NextResponse.json({ url: postLogoutRedirect });
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const idToken = typeof token?.idToken === 'string' ? token.idToken : undefined;

  if (!idToken) {
    return NextResponse.json({ url: postLogoutRedirect });
  }

  const url =
    `${issuer}/v1/logout` +
    `?id_token_hint=${encodeURIComponent(idToken)}` +
    `&post_logout_redirect_uri=${encodeURIComponent(postLogoutRedirect)}`;

  return NextResponse.json({ url });
}
