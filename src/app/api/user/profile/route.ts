export const dynamic = "force-static";
import { NextResponse } from 'next/server';
import { mockUser } from '@/data/mockUser';

// TODO: Replace mock data with Azure backend call
// const res = await fetch(process.env.BACKEND_URL + '/api/user/profile', {
//   headers: {
//     'Authorization': `Bearer ${oktaToken}`,
//     'x-api-key': process.env.BACKEND_API_KEY!,
//   },
// });

export async function GET() {
  return NextResponse.json(mockUser);
}
