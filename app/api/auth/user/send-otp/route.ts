import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createOTP } from '@/lib/otp';
import { sendOTPEmail } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }
    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    const { code } = await createOTP(normalizedEmail, 'login');
    await sendOTPEmail(normalizedEmail, code, user?.name || undefined);
    return NextResponse.json({ success: true, isNew: !user });
  } catch (err: any) {
    console.error('Send OTP error:', err);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
