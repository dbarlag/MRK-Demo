import { NextRequest } from 'next/server';

// TODO: Replace with real Okta integration
// Options: nextauth with Okta provider, @okta/okta-auth-js, or custom

interface OktaSession {
  userId: string;
  email: string;
  name: string;
  accessToken: string;
}

/**
 * Validate the user's Okta session from the request.
 * Returns the session if valid, null if not authenticated.
 *
 * TODO: Implement real Okta validation when credentials are available.
 * For now, returns a mock session.
 */
export async function getOktaSession(_req: NextRequest): Promise<OktaSession | null> {
  // Mock: always return an authenticated session
  return {
    userId: '1',
    email: 'kari.hansen@rodekors.org',
    name: 'Ola Norman',
    accessToken: 'mock-okta-token',
  };
}

/**
 * Get the backend API headers for authenticated requests.
 * Combines the API key with the user's Okta token.
 */
export function getBackendHeaders(oktaToken: string): HeadersInit {
  return {
    'Authorization': `Bearer ${oktaToken}`,
    'x-api-key': process.env.BACKEND_API_KEY || '',
    'Content-Type': 'application/json',
  };
}
