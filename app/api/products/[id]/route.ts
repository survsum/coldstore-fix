import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function isAdmin(req: NextRequest) {
  return req.cookies.get('admin_session')?.value === 'authenticated';
}

type Context = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: Context) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await context.params;
    const body = await req.json();
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        price: parseFloat(body.price),
        image: body.image,
        category: body.category,
        stock: parseInt(body.stock),
      },
    });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: Context) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await context.params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
