export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    /*
     * Protect all routes except:
     * - /login (sign-in page)
     * - /api/auth (NextAuth endpoints)
     * - /_next (Next.js internals)
     * - /images, /favicon.ico (static assets)
     */
    '/((?!login|api/auth|_next|images|favicon.ico).*)',
  ],
};
