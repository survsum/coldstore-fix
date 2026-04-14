import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

// cookies() is async in Next.js 14.2+ — must be awaited
export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    return session?.value === 'authenticated';
  } catch {
    return false;
  }
}

// For API routes — reads from the request object directly (no await needed)
export function isAdminAuthenticatedFromRequest(req: NextRequest): boolean {
  const session = req.cookies.get('admin_session');
  return session?.value === 'authenticated';
}
