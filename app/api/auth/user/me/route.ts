import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/userAuth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload) return NextResponse.json({ user: null });
    const user = await prisma.user.findUnique({ where: { id: payload.id }, select: { id: true, email: true, name: true, avatar: true, provider: true } });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}
