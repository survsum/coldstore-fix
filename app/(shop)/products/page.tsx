import { prisma } from '@/lib/prisma';
import { Suspense } from 'react';
import ProductsClient from './ProductsClient';
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop All Products',
  description: 'Browse our curated collection of premium products.',
};

function ProductsLoading() {
  return (
    <div className="min-h-screen pt-28 pb-24 px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <div className="h-3 w-24 rounded-full skeleton mb-3" />
        <div className="h-12 w-48 rounded-xl skeleton" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; minPrice?: string; maxPrice?: string; sort?: string; search?: string };
}) {
  const where: any = {};
  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search } },
      { description: { contains: searchParams.search } },
      { category: { contains: searchParams.search } },
    ];
  }
  if (searchParams.category) {
    where.category = searchParams.category;
  }
  if (searchParams.minPrice || searchParams.maxPrice) {
    where.price = {};
    if (searchParams.minPrice) where.price.gte = parseFloat(searchParams.minPrice);
    if (searchParams.maxPrice) where.price.lte = parseFloat(searchParams.maxPrice);
  }

  let orderBy: any = { createdAt: 'desc' };
  if (searchParams.sort === 'price_asc') orderBy = { price: 'asc' };
  if (searchParams.sort === 'price_desc') orderBy = { price: 'desc' };
  if (searchParams.sort === 'name') orderBy = { name: 'asc' };

  const products = await prisma.product.findMany({ where, orderBy });
  const categories = await prisma.product.findMany({
    select: { category: true },
    distinct: ['category'],
  });

  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsClient
        products={products}
        categories={categories.map((c) => c.category)}
        activeCategory={searchParams.category}
        searchQuery={searchParams.search}
      />
    </Suspense>
  );
}
