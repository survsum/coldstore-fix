import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function isAdmin(req: NextRequest) {
  return req.cookies.get('admin_session')?.value === 'authenticated';
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const where = category ? { category } : {};
    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { name, description, price, image, category, stock } = body;
    if (!name || !price || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        price: parseFloat(price),
        image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        category,
        stock: parseInt(stock) || 0,
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
