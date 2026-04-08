import { getServerSession } from 'next-auth';
import { authOptions } from './auth-options';

/**
 * Get the current user's session from NextAuth.
 * Returns null if not authenticated.
 */
export async function getSession() {
  return getServerSession(authOptions);
}

/**
 * Get the backend API headers for authenticated requests.
 * Combines the API key with the user's Okta access token.
 */
export function getBackendHeaders(accessToken: string): HeadersInit {
  return {
    'Authorization': `Bearer ${accessToken}`,
    'x-api-key': process.env.BACKEND_API_KEY || '',
    'Content-Type': 'application/json',
  };
}
