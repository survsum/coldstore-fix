import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/userAuth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: { id: true, total: true, status: true, createdAt: true, trackingId: true, courier: true, items: true },
    });
    return NextResponse.json({ orders });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
