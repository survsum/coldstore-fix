import Hero from '@/components/layout/Hero';
import FeaturedProducts from '@/components/product/FeaturedProducts';
import CategoryBanner from '@/components/layout/CategoryBanner';
import ValueProps from '@/components/layout/ValueProps';
import { prisma } from '@/lib/prisma';

export default async function HomePage() {
  const products = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <Hero />
      <ValueProps />
      <FeaturedProducts products={products} />
      <CategoryBanner />
    </>
  );
}
