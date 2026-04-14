import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const SECRET = new TextEncoder().encode(
  process.env.USER_JWT_SECRET || 'colddog_user_jwt_fallback_32chars!!'
);
const COOKIE = 'user_session';

export interface UserPayload {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
  provider: string;
}

export async function signUserToken(payload: UserPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(SECRET);
}

export async function verifyUserToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as UserPayload;
  } catch {
    return null;
  }
}

// cookies() is async in Next.js 14.2+ — must be awaited
export async function getCurrentUser(): Promise<UserPayload | null> {
  try {
    const store = await cookies();
    const token = store.get(COOKIE)?.value;
    if (!token) return null;
    return verifyUserToken(token);
  } catch {
    return null;
  }
}

export async function getUserFromRequest(req: NextRequest): Promise<UserPayload | null> {
  const token = req.cookies.get(COOKIE)?.value;
  if (!token) return null;
  return verifyUserToken(token);
}

export function createSessionCookie(token: string) {
  return {
    name: COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  };
}

export function clearSessionCookie() {
  return { name: COOKIE, value: '', maxAge: 0, path: '/' };
}
