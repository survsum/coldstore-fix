import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';
import type { Metadata } from 'next';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return { title: 'Product Not Found' };
  return {
    title: product.name,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { category: product.category, id: { not: product.id } },
    take: 4,
  });

  return <ProductDetailClient product={product} related={related} />;
}
