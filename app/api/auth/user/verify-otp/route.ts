import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyOTP } from '@/lib/otp';
import { signUserToken, createSessionCookie } from '@/lib/userAuth';

export async function POST(req: NextRequest) {
  try {
    const { email, code, name } = await req.json();
    if (!email || !code) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }
    const normalizedEmail = email.toLowerCase().trim();
    const result = await verifyOTP(normalizedEmail, code.trim(), 'login');
    if (!result.valid) {
      return NextResponse.json({ error: result.reason || 'Invalid OTP' }, { status: 401 });
    }

    // Upsert user
    let user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      user = await prisma.user.create({
        data: { email: normalizedEmail, name: name || normalizedEmail.split('@')[0], provider: 'email' },
      });
    }

    const token = await signUserToken({
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      avatar: user.avatar || undefined,
      provider: user.provider,
    });

    const res = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar, provider: user.provider },
    });
    res.cookies.set(createSessionCookie(token));
    return res;
  } catch (err: any) {
    console.error('Verify OTP error:', err);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
