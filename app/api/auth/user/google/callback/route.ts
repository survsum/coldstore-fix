import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signUserToken, createSessionCookie } from '@/lib/userAuth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  // User denied access
  if (error || !code) {
    return NextResponse.redirect(`${baseUrl}/?auth_error=access_denied`);
  }

  try {
    const redirectUri = `${baseUrl}/api/auth/user/google/callback`;

    // 1. Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenRes.json();
    if (!tokens.access_token) {
      console.error('Token exchange failed:', tokens);
      return NextResponse.redirect(`${baseUrl}/?auth_error=token_failed`);
    }

    // 2. Fetch Google user info
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const googleUser = await userRes.json();

    if (!googleUser.email) {
      return NextResponse.redirect(`${baseUrl}/?auth_error=no_email`);
    }

    // 3. Upsert user in DB
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name || googleUser.email.split('@')[0],
          avatar: googleUser.picture || null,
          provider: 'google',
        },
      });
    } else {
      // Update avatar/name if changed
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: user.name || googleUser.name,
          avatar: googleUser.picture || user.avatar,
          provider: user.provider === 'email' ? 'google' : user.provider,
        },
      });
    }

    // 4. Create JWT + set cookie
    const token = await signUserToken({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      provider: user.provider,
    });

    // 5. Redirect back to site with cookie set
    const response = NextResponse.redirect(`${baseUrl}/?auth_success=1`);
    response.cookies.set(createSessionCookie(token));
    return response;

  } catch (err: any) {
    console.error('Google OAuth callback error:', err);
    return NextResponse.redirect(`${baseUrl}/?auth_error=server_error`);
  }
}
