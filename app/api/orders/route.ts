import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, email, address, items, total } = body;
    if (!customerName || !email || !address || !items || !total) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const order = await prisma.order.create({
      data: {
        customerName,
        email,
        address,
        items: JSON.stringify(items),
        total: parseFloat(total),
      },
    });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  if (req.cookies.get('admin_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
